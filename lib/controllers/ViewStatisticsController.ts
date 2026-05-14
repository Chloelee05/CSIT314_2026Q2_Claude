import { FRAData } from '@/lib/entities/FRAData';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import { SavedFRAData } from '@/lib/entities/SavedFRAData';

/**
 * BCE Control: ViewStatisticsController (User Story #32, #33)
 *
 * Coordinates view-count and shortlist statistics for a Fund Raiser's activity.
 */
export class ViewStatisticsController {
  /**
   * Retrieve the public visibility metric (view count) for an activity.
   * Signature matches BCE diagram: getViewCount(fraId): tuple
   *
   * @returns [success, count | null, errorMessage]
   *          count is 0 for “0 views” (exception 2a).
   */
  static async getViewCount(
    fraId: string,
  ): Promise<[boolean, number | null, string]> {
    return FRAData.fetchViewCount(fraId);
  }

  /**
   * Total number of Donees who shortlisted this activity.
   * BCE diagram: getShortlistCount(fraId) — delegates to countShortlists(fraId)
   * (session `userId` is required so only the activity owner can see the metric.)
   *
   * @returns [success, count | null, errorMessage] — 0 for “0 shortlists” (exception 2a).
   */
  static async getShortlistCount(
    fraId: string,
    userId: string,
  ): Promise<[boolean, number | null, string]> {
    const activity = await FundraisingActivity.getById(fraId);
    if (!activity) {
      return [false, null, 'Activity not found.'];
    }
    if (activity.user_id !== userId) {
      return [
        false,
        null,
        'You are not allowed to view statistics for this activity.',
      ];
    }
    return SavedFRAData.countShortlists(fraId);
  }
}
