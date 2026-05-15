import { FRAData } from '@/lib/entities/FRAData';

/**
 * BCE Controller: ViewStatisticsController (User Story #32)
 *
 * Coordinates view-count statistics for a Fund Raiser's activity.
 */
export class ViewStatisticsController {
  /**
   * Retrieve the public visibility metric (view count) for an activity.
   * Signature matches BCE diagram: getViewCount(fraId): tuple
   *
   * @returns [success, count | null, errorMessage]
   *          count is 0 for "0 views" (exception 2a).
   */
  static async getViewCount(
    fraId: string,
  ): Promise<[boolean, number | null, string]> {
    return FRAData.fetchViewCount(fraId);
  }
}
