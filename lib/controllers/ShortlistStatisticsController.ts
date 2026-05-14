import { FRAData } from '@/lib/entities/FRAData';

/**
 * BCE Controller: ShortlistStatisticsController (User Story #33)
 *
 * Coordinates shortlist-count statistics for a Fund Raiser's activity.
 */
export class ShortlistStatisticsController {
  /**
   * Total number of Donees who shortlisted this activity.
   * Signature matches BCE diagram: getShortlistCount(fraId): tuple
   *
   * @returns [success, count | null, errorMessage] — 0 for "0 shortlists" (exception 2a).
   */
  static async getShortlistCount(
    fraId: string,
  ): Promise<[boolean, number | null, string]> {
    return FRAData.fetchShortlistCount(fraId);
  }
}
