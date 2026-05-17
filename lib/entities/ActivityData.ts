import { createServerClient } from '@/lib/supabase/server';

export interface DailyReport {
  date: string;
  newActivities: number;
  totalDonations: number;
  totalDonationAmount: number;
  newUsers: number;
}

export interface WeeklyReport {
  startDate: string;
  endDate: string;
  newActivities: number;
  totalDonations: number;
  totalDonationAmount: number;
  newUsers: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  newActivities: number;
  totalDonations: number;
  totalDonationAmount: number;
  newUsers: number;
}

export interface ActivitySnapshot {
  id: string;
  fra_id: string;
  recorded_at: string;
  view_count: number;
  shortlist_count: number;
  donation_count: number;
  raised_snapshot: number;
  note: string | null;
}

/**
 * BCE Entity: ActivityData (User Story #45, #46, #47)
 * Generates platform-wide reports and records per-activity snapshots.
 */
export class ActivityData {
  /**
   * US#45 — Fetch daily activity metrics for a given date (YYYY-MM-DD).
   * Also saves a snapshot of all active activities.
   */
  static async getDailyActivity(date: string): Promise<DailyReport> {
    const supabase = createServerClient();
    const dayStart = `${date}T00:00:00.000Z`;
    const dayEnd = `${date}T23:59:59.999Z`;

    const [activitiesRes, donationsRes, usersRes] = await Promise.all([
      supabase
        .from('fundraising_activity')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),

      supabase
        .from('donations')
        .select('amount')
        .gte('donated_at', dayStart)
        .lte('donated_at', dayEnd),

      supabase
        .from('user_account')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),
    ]);

    const totalDonationAmount = (donationsRes.data ?? []).reduce(
      (sum, d) => sum + parseFloat(String(d.amount)),
      0,
    );

    await ActivityData.saveSnapshotsForAllActive();

    return {
      date,
      newActivities: activitiesRes.count ?? 0,
      totalDonations: donationsRes.data?.length ?? 0,
      totalDonationAmount,
      newUsers: usersRes.count ?? 0,
    };
  }

  /**
   * US#46 — Fetch weekly activity metrics between start_date and end_date (YYYY-MM-DD).
   * Also saves a snapshot of all active activities.
   */
  static async getWeeklyActivity(
    start_date: string,
    end_date: string,
  ): Promise<WeeklyReport> {
    const supabase = createServerClient();
    const rangeStart = `${start_date}T00:00:00.000Z`;
    const rangeEnd = `${end_date}T23:59:59.999Z`;

    const [activitiesRes, donationsRes, usersRes] = await Promise.all([
      supabase
        .from('fundraising_activity')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),

      supabase
        .from('donations')
        .select('amount')
        .gte('donated_at', rangeStart)
        .lte('donated_at', rangeEnd),

      supabase
        .from('user_account')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),
    ]);

    const totalDonationAmount = (donationsRes.data ?? []).reduce(
      (sum, d) => sum + parseFloat(String(d.amount)),
      0,
    );

    await ActivityData.saveSnapshotsForAllActive();

    return {
      startDate: start_date,
      endDate: end_date,
      newActivities: activitiesRes.count ?? 0,
      totalDonations: donationsRes.data?.length ?? 0,
      totalDonationAmount,
      newUsers: usersRes.count ?? 0,
    };
  }

  /**
   * US#47 — Fetch monthly activity metrics for a given month (1–12) and year.
   * Also saves a snapshot of all active activities.
   */
  static async getMonthlyActivity(
    month: number,
    year: number,
  ): Promise<MonthlyReport> {
    const supabase = createServerClient();

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
    const rangeStart = monthStart.toISOString();
    const rangeEnd = monthEnd.toISOString();

    const [activitiesRes, donationsRes, usersRes] = await Promise.all([
      supabase
        .from('fundraising_activity')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),

      supabase
        .from('donations')
        .select('amount')
        .gte('donated_at', rangeStart)
        .lte('donated_at', rangeEnd),

      supabase
        .from('user_account')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),
    ]);

    const totalDonationAmount = (donationsRes.data ?? []).reduce(
      (sum, d) => sum + parseFloat(String(d.amount)),
      0,
    );

    await ActivityData.saveSnapshotsForAllActive();

    return {
      month,
      year,
      newActivities: activitiesRes.count ?? 0,
      totalDonations: donationsRes.data?.length ?? 0,
      totalDonationAmount,
      newUsers: usersRes.count ?? 0,
    };
  }

  /**
   * Save a single activity snapshot to activity_data.
   */
  static async saveSnapshot(
    fra_id: string,
    view_count: number,
    shortlist_count: number,
    donation_count: number,
    raised_snapshot: number,
    note?: string,
  ): Promise<boolean> {
    const supabase = createServerClient();

    const { error } = await supabase.from('activity_data').insert({
      fra_id,
      view_count,
      shortlist_count,
      donation_count,
      raised_snapshot,
      note: note ?? null,
    });

    return !error;
  }

  /**
   * Fetch all current active activities and save a snapshot of each.
   * Called automatically when any report is generated.
   */
  static async saveSnapshotsForAllActive(): Promise<void> {
    const supabase = createServerClient();

    const { data: activities } = await supabase
      .from('fundraising_activity')
      .select('id, raised_amount, view_count')
      .eq('status', 'active');

    if (!activities || activities.length === 0) return;

    const snapshots = await Promise.all(
      activities.map(async (activity) => {
        const [shortlistRes, donationRes] = await Promise.all([
          supabase
            .from('fra_data')
            .select('*', { count: 'exact', head: true })
            .eq('fra_id', activity.id),
          supabase
            .from('donations')
            .select('*', { count: 'exact', head: true })
            .eq('fra_id', activity.id),
        ]);

        return {
          fra_id: activity.id,
          view_count: activity.view_count ?? 0,
          shortlist_count: shortlistRes.count ?? 0,
          donation_count: donationRes.count ?? 0,
          raised_snapshot: parseFloat(String(activity.raised_amount ?? 0)),
          note: null,
        };
      }),
    );

    await supabase.from('activity_data').insert(snapshots);
  }

  /**
   * Fetch stored snapshots, optionally filtered by activity.
   */
  static async getSnapshots(fra_id?: string): Promise<ActivitySnapshot[]> {
    const supabase = createServerClient();

    let query = supabase
      .from('activity_data')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (fra_id) {
      query = query.eq('fra_id', fra_id);
    }

    const { data, error } = await query;

    if (error || !data) return [];
    return data as ActivitySnapshot[];
  }
}
