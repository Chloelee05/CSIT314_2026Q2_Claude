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

  /**
   * BCE Method: getByKeyword
   * Searches a donee's donation history by campaign title keyword.
   * Returns a tuple: [success, message, donations]
   */
  static async getByKeyword(
    keyword: string,
    doneeId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    const supabase = createServerClient();

    let query = supabase
      .from('donations')
      .select('id, donee_id, fra_id, amount, donated_at, fundraising_activities(title, status)')
      .eq('donee_id', doneeId)
      .order('donated_at', { ascending: false });

    if (keyword && keyword.trim() !== '') {
      query = query.ilike('fundraising_activities.title', `%${keyword.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      return [false, 'Failed to fetch donation history.', []];
    }

    const donations: DonationWithActivity[] = (data ?? [])
      .filter((row) => {
        if (!keyword || keyword.trim() === '') return true;
        const fra = row.fundraising_activities as unknown as Record<string, unknown> | null;
        if (!fra) return false;
        const title = (fra.title as string) ?? '';
        return title.toLowerCase().includes(keyword.trim().toLowerCase());
      })
      .map((row) => {
        const fra = row.fundraising_activities as unknown as Record<string, unknown> | null;
        return {
          id: row.id as string,
          donee_id: row.donee_id as string,
          fra_id: row.fra_id as string,
          amount: row.amount as number,
          donated_at: row.donated_at as string,
          campaign_title: fra ? (fra.title as string) : 'Unknown Campaign',
          campaign_status: fra ? (fra.status as string) : 'unknown',
        };
      });

    if (donations.length === 0) {
      return [false, 'No matching donations found.', []];
    }

    return [true, 'Donations found.', donations];
  }

  /**
   * BCE Method: getByUserId (User Story #37)
   * Retrieves all donation history for a donee.
   * Returns a tuple: [success, message, donations]
   */
  static async getByUserId(
    userId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('donations')
      .select('id, donee_id, fra_id, amount, donated_at, fundraising_activities(title, status)')
      .eq('donee_id', userId)
      .order('donated_at', { ascending: false });

    if (error) {
      return [false, 'Failed to fetch donation history.', []];
    }

    const donations: DonationWithActivity[] = (data ?? []).map((row) => {
      const fra = row.fundraising_activities as unknown as Record<string, unknown> | null;
      return {
        id: row.id as string,
        donee_id: row.donee_id as string,
        fra_id: row.fra_id as string,
        amount: row.amount as number,
        donated_at: row.donated_at as string,
        campaign_title: fra ? (fra.title as string) : 'Unknown Campaign',
        campaign_status: fra ? (fra.status as string) : 'unknown',
      };
    });

    if (donations.length === 0) {
      return [false, 'No donation history found.', []];
    }

    return [true, 'Donation history found.', donations];
  }
}
