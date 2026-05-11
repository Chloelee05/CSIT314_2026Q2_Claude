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

/**
 * BCE Entity: ActivityData (User Story #45, #46)
 * Aggregates platform activity from the database.
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

  /**
   * US#46 — Fetch weekly activity metrics between start_date and end_date (YYYY-MM-DD).
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
        .from('fundraising_activities')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),

      supabase
        .from('donations')
        .select('amount')
        .gte('donated_at', rangeStart)
        .lte('donated_at', rangeEnd),

      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),
    ]);

    const totalDonationAmount = (donationsRes.data ?? []).reduce(
      (sum, d) => sum + parseFloat(String(d.amount)),
      0,
    );

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
        .from('fundraising_activities')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),

      supabase
        .from('donations')
        .select('amount')
        .gte('donated_at', rangeStart)
        .lte('donated_at', rangeEnd),

      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', rangeStart)
        .lte('created_at', rangeEnd),
    ]);

    const totalDonationAmount = (donationsRes.data ?? []).reduce(
      (sum, d) => sum + parseFloat(String(d.amount)),
      0,
    );

    return {
      month,
      year,
      newActivities: activitiesRes.count ?? 0,
      totalDonations: donationsRes.data?.length ?? 0,
      totalDonationAmount,
      newUsers: usersRes.count ?? 0,
    };
  }
}
