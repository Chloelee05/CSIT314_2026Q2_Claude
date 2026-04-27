import { createServerClient } from '@/lib/supabase/server';

export class FundraisingActivity {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  raised_amount: number;
  status: string;
  organizer_id: string | null;
  created_at: string;
  updated_at: string;

  constructor(data: Record<string, unknown>) {
    this.id = data.id as string;
    this.title = data.title as string;
    this.description = (data.description as string) ?? null;
    this.goal_amount = (data.goal_amount as number) ?? 0;
    this.raised_amount = (data.raised_amount as number) ?? 0;
    this.status = data.status as string;
    this.organizer_id = (data.organizer_id as string) ?? null;
    this.created_at = data.created_at as string;
    this.updated_at = data.updated_at as string;
  }

  /**
   * BCE Method: find_activities
   * Searches active fundraising activities by keyword (title match).
   * Returns a tuple: [success, message, activities]
   */
  static async find_activities(
    keyword: string,
  ): Promise<[boolean, string, FundraisingActivity[]]> {
    const supabase = createServerClient();

    let query = supabase
      .from('fundraising_activities')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (keyword && keyword.trim() !== '') {
      query = query.ilike('title', `%${keyword.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      return [false, 'Failed to fetch activities.', []];
    }

    const activities = (data ?? []).map((row) => new FundraisingActivity(row));

    if (activities.length === 0) {
      return [false, 'No activities found.', []];
    }

    return [true, 'Activities found.', activities];
  }
}
