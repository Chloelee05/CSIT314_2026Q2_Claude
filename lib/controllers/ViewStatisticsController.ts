import { FRAData } from '@/lib/entities/FRAData';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Control: ViewStatisticsController (User Story #32)
 *
 * Coordinates view-count statistics for a Fund Raiser's activity.
 */
export class ViewStatisticsController {
  /**
   * Retrieve the public visibility metric (view count) for an activity.
   * Signature matches BCE diagram: getViewCount(fraId)
   *
   * @returns [success, count | null, errorMessage]
   *          count is 0 for “0 views” (exception 2a).
   */
  static async getViewCount(
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
    return FRAData.fetchViewCount(fraId);
  }
}
