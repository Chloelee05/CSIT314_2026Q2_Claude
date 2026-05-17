import { createServerClient } from '@/lib/supabase/server';

export interface DonationWithActivity {
  id: string;
  donee_id: string;
  fra_id: string;
  amount: number;
  donated_at: string;
  campaign_title: string;
  campaign_status: string;
}

type DonationRow = {
  id: string;
  donee_id: string;
  fra_id: string;
  amount: number;
  donated_at: string;
};

/**
 * BCE Entity: Donation (User Story #36)
 * Maps to the `donations` table.
 */
export class Donation {
  id: string;
  donee_id: string;
  fra_id: string;
  amount: number;
  donated_at: string;

  constructor(data: Record<string, unknown>) {
    this.id = data.id as string;
    this.donee_id = data.donee_id as string;
    this.fra_id = data.fra_id as string;
    this.amount = data.amount as number;
    this.donated_at = data.donated_at as string;
  }

  private static async donationRowsForDonee(
    doneeId: string,
  ): Promise<[DonationRow[] | null, string | null]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('donations')
      .select('id, donee_id, fra_id, amount, donated_at')
      .eq('donee_id', doneeId)
      .order('donated_at', { ascending: false });

    if (error) {
      return [null, error.message ?? 'fetch failed'];
    }

    return [data as DonationRow[], null];
  }

  private static async activityTitleStatusByIds(
    fraIds: string[],
  ): Promise<[Map<string, { title: string; status: string }> | null, string | null]> {
    if (fraIds.length === 0) {
      return [new Map(), null];
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('fundraising_activity')
      .select('id, title, status')
      .in('id', fraIds);

    if (error) {
      return [null, error.message ?? 'activity fetch failed'];
    }

    const map = new Map<string, { title: string; status: string }>();
    for (const row of data ?? []) {
      const r = row as { id: string; title?: string | null; status?: string | null };
      map.set(r.id, {
        title: (r.title as string) ?? '',
        status: (r.status as string) ?? 'unknown',
      });
    }
    return [map, null];
  }

  private static rowsToDonationWithActivity(
    rows: DonationRow[],
    activityMap: Map<string, { title: string; status: string }>,
  ): DonationWithActivity[] {
    return rows.map((row) => {
      const fra = activityMap.get(row.fra_id);
      return {
        id: row.id,
        donee_id: row.donee_id,
        fra_id: row.fra_id,
        amount: row.amount,
        donated_at: row.donated_at,
        campaign_title: fra?.title ?? 'Unknown Campaign',
        campaign_status: fra?.status ?? 'unknown',
      };
    });
  }

  /**
   * BCE Method: getByKeyword
   * Searches a donee's donation history by campaign title keyword.
   * Returns a tuple: [success, message, donations]
   */
  static async getByKeyword(
    keyword: string,
    doneeId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    const [rows, fetchErr] = await Donation.donationRowsForDonee(doneeId);
    if (fetchErr !== null || rows === null) {
      return [false, 'Failed to fetch donation history.', []];
    }

    const fraIds = [...new Set(rows.map((r) => r.fra_id).filter(Boolean))];
    const [activityMap, activityErr] = await Donation.activityTitleStatusByIds(fraIds);
    if (activityErr !== null || activityMap === null) {
      return [false, 'Failed to fetch donation history.', []];
    }

    const kw = keyword.trim().toLowerCase();
    let withActivity = Donation.rowsToDonationWithActivity(rows, activityMap);

    if (kw !== '') {
      withActivity = withActivity.filter((d) =>
        d.campaign_title.toLowerCase().includes(kw),
      );
    }

    if (withActivity.length === 0) {
      return [false, 'No matching donations found.', []];
    }

    return [true, 'Donations found.', withActivity];
  }

  /**
   * Fetch all donation history for a donee.
   * Signature matches BCE diagram: fetchDonationHistory(): list — User Story #37
   */
  static async fetchDonationHistory(
    userId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    return Donation.getByUserId(userId);
  }

  /**
   * BCE Method: getByUserId (User Story #37)
   * Retrieves all donation history for a donee.
   * Returns a tuple: [success, message, donations]
   */
  static async getByUserId(
    userId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    const [rows, fetchErr] = await Donation.donationRowsForDonee(userId);
    if (fetchErr !== null || rows === null) {
      return [false, 'Failed to fetch donation history.', []];
    }

    if (rows.length === 0) {
      return [false, 'No donation history found.', []];
    }

    const fraIds = [...new Set(rows.map((r) => r.fra_id).filter(Boolean))];
    const [activityMap, activityErr] = await Donation.activityTitleStatusByIds(fraIds);
    if (activityErr !== null || activityMap === null) {
      return [false, 'Failed to fetch donation history.', []];
    }

    const donations = Donation.rowsToDonationWithActivity(rows, activityMap);

    return [true, 'Donation history found.', donations];
  }
}
