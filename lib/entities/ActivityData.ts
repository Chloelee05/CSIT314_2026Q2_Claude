import { createServerClient } from '@/lib/supabase/server';

export interface DailyReport {
  date: string;
  newActivities: number;
  totalDonations: number;
  totalDonationAmount: number;
  newUsers: number;
}

/**
 * BCE Entity: ActivityData (User Story #45)
 * Aggregates daily platform activity from the database.
 */
export class ActivityData {
  /**
   * US#45 — Fetch daily activity metrics for a given date (YYYY-MM-DD).
   */
  static async getDailyActivity(date: string): Promise<DailyReport> {
    const supabase = createServerClient();
    const dayStart = `${date}T00:00:00.000Z`;
    const dayEnd = `${date}T23:59:59.999Z`;

    const [activitiesRes, donationsRes, usersRes] = await Promise.all([
      supabase
        .from('fundraising_activities')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),

      supabase
        .from('donations')
        .select('amount')
        .gte('donated_at', dayStart)
        .lte('donated_at', dayEnd),

      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd),
    ]);

    const totalDonationAmount = (donationsRes.data ?? []).reduce(
      (sum, d) => sum + parseFloat(String(d.amount)),
      0,
    );

    return {
      date,
      newActivities: activitiesRes.count ?? 0,
      totalDonations: donationsRes.data?.length ?? 0,
      totalDonationAmount,
      newUsers: usersRes.count ?? 0,
    };
  }
}
