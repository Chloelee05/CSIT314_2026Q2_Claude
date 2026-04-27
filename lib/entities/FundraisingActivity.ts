import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: FundraisingActivity (User Story #18, #19, #20, #21, #22, #32)
 *
 * Represents a fundraising campaign activity in the system.
 */
export class FundraisingActivity {
  id: string;
  user_id: string;
  title: string;
  description: string;
  goal_amount: number;
  category: string;
  end_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;

  constructor(data: Record<string, unknown>) {
    this.id = data.id as string;
    this.user_id = data.user_id as string;
    this.title = data.title as string;
    this.description = data.description as string;
    this.goal_amount =
      typeof data.goal_amount === 'string'
        ? parseFloat(data.goal_amount)
        : (data.goal_amount as number);
    this.category = data.category as string;
    this.end_date =
      data.end_date === undefined || data.end_date === null
        ? null
        : String(data.end_date);
    this.view_count =
      typeof data.view_count === 'number'
        ? data.view_count
        : parseInt(String(data.view_count ?? 0), 10) || 0;
    this.created_at = data.created_at as string;
    this.updated_at = data.updated_at as string;
  }

  /**
   * Persist a new fundraising activity.
   * Signature matches BCE diagram: save(activity: FundraisingActivity): boolean
   */
  static async save(activity: FundraisingActivity): Promise<boolean> {
    const supabase = createServerClient();

    const { error } = await supabase.from('fundraising_activities').insert({
      user_id: activity.user_id,
      title: activity.title,
      description: activity.description,
      goal_amount: activity.goal_amount,
      category: activity.category,
      end_date: activity.end_date,
      view_count: activity.view_count ?? 0,
    });

    return !error;
  }

  /**
   * Load a single activity by id.
   * Signature matches BCE diagram: getById(activityId: String): FundraisingActivity
   */
  static async getById(id: string): Promise<FundraisingActivity | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fundraising_activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }
    return new FundraisingActivity(data);
  }

  /**
   * List all activities created by a user.
   * Signature matches BCE diagram: getByUserId(userId: String): list
   */
  static async getByUserId(userId: string): Promise<FundraisingActivity[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fundraising_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }
    return data.map((row) => new FundraisingActivity(row));
  }

  /**
   * Find activities for a user whose title, description, or category matches the keyword
   * (case-insensitive substring). Empty keyword returns all activities for the user (use case 4b).
   * Signature matches BCE diagram: find_activities(keyword: str) — return list as part of the tuple
   * produced by the controller.
   */
  static async find_activities(
    keyword: string,
    userId: string,
  ): Promise<FundraisingActivity[]> {
    const all = await FundraisingActivity.getByUserId(userId);
    const kw = keyword.trim();
    if (!kw) {
      return all;
    }
    const lower = kw.toLowerCase();
    return all.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.description.toLowerCase().includes(lower) ||
        a.category.toLowerCase().includes(lower),
    );
  }

  /**
   * Remove an activity from persistent storage.
   * Signature matches BCE diagram: remove_activity(activity_id: int): tuple
   *
   * @returns [success, message]
   */
  static async remove_activity(
    activity_id: string,
  ): Promise<[boolean, string]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fundraising_activities')
      .delete()
      .eq('id', activity_id)
      .select('id');

    if (error) {
      return [false, 'Could not remove the activity. Please try again.'];
    }
    if (!data || data.length === 0) {
      return [false, 'Activity not found.'];
    }

    return [true, 'Activity removed.'];
  }

  /**
   * Update an existing fundraising activity in persistent storage.
   * Signature matches BCE diagram: save_activity(activity_id: int, title: str, description: str, goal: float): tuple
   *
   * User Story #20 use case also supports an optional campaign end date (stored as end_date).
   *
   * @returns [success, message]
   */
  static async save_activity(
    activity_id: string,
    title: string,
    description: string,
    goal: number,
    endDate: string | null = null,
  ): Promise<[boolean, string]> {
    const supabase = createServerClient();

    const { error } = await supabase
      .from('fundraising_activities')
      .update({
        title,
        description,
        goal_amount: goal,
        end_date: endDate && endDate.trim() ? endDate.trim() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activity_id);

    if (error) {
      return [false, 'Could not update the activity. Please try again.'];
    }

    return [true, 'Activity updated.'];
  }
}
