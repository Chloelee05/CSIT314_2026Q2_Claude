import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: SavedFRAData (User Story #27, #33)
 *
 * - save: Donee saves a fundraising activity as a favourite (User Story #27)
 * - countShortlists: FR statistics — counts rows in `saved_fra` (User Story #33)
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
   * Count how many Donees have shortlisted this activity (via saved_fra table).
   * BCE diagram: countShortlists(fraId) — User Story #33
   */
  static async countShortlists(
    fraId: string,
  ): Promise<[boolean, number | null, string]> {
    const supabase = createServerClient();

    const { count, error } = await supabase
      .from('saved_fra')
      .select('*', { count: 'exact', head: true })
      .eq('fundraising_activity_id', fraId);

    if (error) {
      return [
        false,
        null,
        'Could not load shortlist count. Please try again.',
      ];
    }

    return [true, count ?? 0, ''];
  }

  /**
   * Donee saves a fundraising activity as a favourite.
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

