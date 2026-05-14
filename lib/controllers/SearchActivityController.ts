import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: SearchActivityController (User Story #22)
 *
 * Coordinates search over fundraising activities.
 */
export class SearchActivityController {
  /**
   * Run a keyword search over the FR's own activities.
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

  /**
   * Global search for active fundraising activities (for donee browsing).
   * Delegates to FundraisingActivity.find_active_activities(keyword).
   */
  static async searchActiveActivities(
    keyword: string,
  ): Promise<[boolean, string, FundraisingActivity[]]> {
    return FundraisingActivity.find_active_activities(keyword);
  }
}
