import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: SearchActivityController (User Story #22)
 *
 * Coordinates search over a Fund Raiser's own fundraising activities.
 */
export class SearchActivityController {
  /**
   * Run a keyword search over the FR's activities.
   * Signature matches BCE diagram: SearchActivity(keyword: str): tuple
   *
   * @returns [activities, noResultsMessage] where noResultsMessage is
   *          "No activities found." when the keyword is non-empty and nothing matched
   *          (exception flow in the sequence diagram); otherwise null.
   */
  static async SearchActivity(
    keyword: string,
    userId: string,
  ): Promise<[FundraisingActivity[], string | null]> {
    const activities = await FundraisingActivity.find_activities(
      keyword,
      userId,
    );
    const trimmed = keyword.trim();
    if (trimmed && activities.length === 0) {
      return [activities, 'No activities found.'];
    }
    return [activities, null];
  }
}
