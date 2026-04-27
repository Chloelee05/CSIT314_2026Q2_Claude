import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: FundraisingActivity (User Story #18, #21)
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
    });

    return !error;
  }

  /**
   * Load a single activity by id.
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
   * List all activities created by a user (for FR activity list, User Story #21).
   */
  static async listByUserId(userId: string): Promise<FundraisingActivity[]> {
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
}
