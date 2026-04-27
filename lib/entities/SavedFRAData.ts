import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: SavedFRAData (User Story #33 + Donee save/favourite features)
 *
 * - countShortlists: FR statistics — counts rows in `saved_fra` (User Story #33)
 * - save / fetchSavedFRAs / delete: Donee save/favourite — uses `saved_fundraising_activities`
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

  /**
   * Retrieves all fundraising activities saved by the donee, with campaign details.
   * Returns [success, message, savedList]
   */
  static async fetchSavedFRAs(doneeId: string): Promise<[boolean, string, SavedFRAWithDetails[]]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('saved_fundraising_activities')
      .select(`
        id,
        saved_at,
        fundraising_activities (
          id, title, description, goal_amount, raised_amount, status, end_date
        )
      `)
      .eq('donee_id', doneeId)
      .order('saved_at', { ascending: false });

    if (error) {
      return [false, 'Failed to retrieve your favourites. Please try again.', []];
    }

    const saved = (data ?? [])
      .filter((row) => row.fundraising_activities !== null)
      .map((row) => {
        const fra = row.fundraising_activities as unknown as Record<string, unknown>;
        return {
          savedId: row.id as string,
          savedAt: row.saved_at as string,
          ...fra,
        };
      }) as SavedFRAWithDetails[];

    if (saved.length === 0) {
      return [false, 'Your favourite list is empty.', []];
    }

    return [true, 'Favourites retrieved.', saved];
  }

  /**
   * Removes a saved activity record for the donee.
   * Returns [success, message]
   */
  static async delete(doneeId: string, fraId: string): Promise<[boolean, string]> {
    const supabase = createServerClient();

    const { error } = await supabase
      .from('saved_fundraising_activities')
      .delete()
      .eq('donee_id', doneeId)
      .eq('fra_id', fraId);

    if (error) {
      return [false, 'Failed to remove activity. Please try again.'];
    }

    return [true, 'Activity removed from favourites.'];
  }
}

export interface SavedFRAWithDetails {
  savedId: string;
  savedAt: string;
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  raised_amount: number;
  status: string;
  end_date: string | null;
}
