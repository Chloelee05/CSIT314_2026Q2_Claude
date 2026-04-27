import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: FRAData (User Story #32)
 *
 * FRA: Fund Raising Activity (maps to `fundraising_activities` rows).
 * Stores and exposes view-count (visibility) statistics.
 */
export class FRAData {
  /**
   * Read the total view count for a fundraising activity.
   * Signature matches BCE diagram: fetchViewCount(fraId) — returns tuple
   *
   * @returns [success, count | null, errorMessage]
   */
  static async fetchViewCount(
    fraId: string,
  ): Promise<[boolean, number | null, string]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fundraising_activities')
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
}
