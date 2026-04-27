import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: SavedFRAData (User Story #33)
 *
 * Persists and queries which Donees have shortlisted (saved) a fundraising activity.
 */
export class SavedFRAData {
  /**
   * Count how many Donees have shortlisted this activity.
   * BCE diagram: countShortlists(fraId) — return tuple
   *
   * @returns [success, count | null, errorMessage]
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
}
