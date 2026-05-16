import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: FRAData (User Story #27, #28, #29, #32, #33)
 *
 * FRA: Fund Raising Activity.
 * - save: donee saves a campaign as a favourite (User Story #27)
 * - fetchSavedFRAs: retrieve a donee's saved campaigns (User Story #28)
 * - delete: remove a saved campaign from favourites (User Story #29)
 * - fetchViewCount: view-count visibility statistics (User Story #32)
 * - fetchShortlistCount: shortlist count statistics (User Story #33)
 */
export class FRAData {
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
   * Donee saves a fundraising activity as a favourite.
   * Signature matches BCE diagram: save(doneeId, fraId): tuple — User Story #27
   */
  static async save(doneeId: string, fraId: string): Promise<[boolean, string]> {
    const supabase = createServerClient();

    const { data: existing } = await supabase
      .from('fra_data')
      .select('id')
      .eq('donee_id', doneeId)
      .eq('fra_id', fraId)
      .maybeSingle();

    if (existing) {
      return [false, 'Already saved'];
    }

    const { error } = await supabase
      .from('fra_data')
      .insert({ donee_id: doneeId, fra_id: fraId });

    if (error) {
      return [false, 'Failed to save activity. Please try again.'];
    }

    return [true, 'Activity saved successfully.'];
  }
  /**
   * Retrieve all fundraising activities saved by the donee, with campaign details.
   * Signature matches BCE diagram: fetchSavedFRAs(doneeId): list
   *
   * @returns [success, message, savedList]
   */
  static async fetchSavedFRAs(
    doneeId: string,
  ): Promise<[boolean, string, SavedFRAWithDetails[]]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fra_data')
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
   * Remove a saved activity record for the donee.
   * Signature matches BCE diagram: delete(doneeId, fraId): tuple — User Story #29
   */
  static async delete(doneeId: string, fraId: string): Promise<[boolean, string]> {
    const supabase = createServerClient();

    const { error } = await supabase
      .from('fra_data')
      .delete()
      .eq('donee_id', doneeId)
      .eq('fra_id', fraId);

    if (error) {
      return [false, 'Failed to remove activity. Please try again.'];
    }

    return [true, 'Activity removed from favourites.'];
  }

  /**
   * Read the total view count for a fundraising activity.
   * Signature matches BCE diagram: fetchViewCount(fraId) — User Story #32
   *
   * @returns [success, count | null, errorMessage]
   */
  static async fetchViewCount(
    fraId: string,
  ): Promise<[boolean, number | null, string]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fundraising_activity')
      .select('view_count')
      .eq('id', fraId)
      .single();

    if (error || !data) {
      return [
        false,
        null,
        'Could not load view count. Please try again.',
      ];
    }

    const n =
      typeof data.view_count === 'number'
        ? data.view_count
        : parseInt(String(data.view_count), 10);
    if (Number.isNaN(n) || n < 0) {
      return [true, 0, ''];
    }

    return [true, n, ''];
  }

  /**
   * Count how many Donees have shortlisted this activity.
   * Signature matches BCE diagram: fetchShortlistCount(fraId): tuple — User Story #33
   */
  static async fetchShortlistCount(
    fraId: string,
  ): Promise<[boolean, number | null, string]> {
    const supabase = createServerClient();

    const { count, error } = await supabase
      .from('fra_data')
      .select('*', { count: 'exact', head: true })
      .eq('fra_id', fraId);

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
