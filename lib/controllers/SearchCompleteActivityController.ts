import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: SearchCompleteActivityController (User Story #34)
 *
 * Coordinates keyword search over the FR's completed fundraising activities.
 */
export class SearchCompleteActivityController {
  /**
   * Search completed activities by keyword.
   * Signature matches BCE diagram: SearchCompleteActivity(keyword: str): tuple
   *
   * @returns [activities, noResultsMessage]
   *          noResultsMessage is set on the alternate flow (no matches).
   */
  static async SearchCompleteActivity(
    keyword: string,
    userId: string,
  ): Promise<[FundraisingActivity[], string | null]> {
    const activities = await FundraisingActivity.getCompletedByKeyword(
      keyword,
      userId,
    );
    if (keyword.trim() && activities.length === 0) {
      return [[], 'No completed fundraising activities found.'];
    }
    return [activities, null];
  }
}
