import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: SavedFRAData
 * Handles persistence of a Donee's saved fundraising activities.
 */
export class SavedFRAData {
  id: string;
  donee_id: string;
  fra_id: string;
  saved_at: string;

  constructor(data: Record<string, unknown>) {
    this.id = data.id as string;
    this.donee_id = data.donee_id as string;
    this.fra_id = data.fra_id as string;
    this.saved_at = data.saved_at as string;
  }

  /**
   * BCE Method: save
   * Inserts a saved activity record for the donee.
   * Returns [success, message] — handles duplicate gracefully.
   */
  static async save(doneeId: string, fraId: string): Promise<[boolean, string]> {
    const supabase = createServerClient();

    const { data: existing } = await supabase
      .from('saved_fundraising_activities')
      .select('id')
      .eq('donee_id', doneeId)
      .eq('fra_id', fraId)
      .maybeSingle();

    if (existing) {
      return [false, 'Already saved'];
    }

    const { error } = await supabase
      .from('saved_fundraising_activities')
      .insert({ donee_id: doneeId, fra_id: fraId });

    if (error) {
      return [false, 'Failed to save activity. Please try again.'];
    }

    return [true, 'Activity saved successfully.'];
  }
}
