import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: FundraisingActivity (User Story #18)
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
}
