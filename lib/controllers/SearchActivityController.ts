import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import { ViewCompletedActivityController } from '@/lib/controllers/ViewCompletedActivityController';

/**
 * BCE Controller: SearchActivityController (User Story #22, #34)
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

  /**
   * Search among **completed** (ended) activities only. Delegates to
   * `FundraisingActivity.getCompletedByKeyword` (BCE: searchCompletedActivities → getCompletedByKeyword).
   *
   * @returns [completedActivities, noResultsMessage] where noResultsMessage is
   *          "No completed fundraising activities found." when the list is empty (alt. 3a).
   */
  static async searchCompletedActivities(
    keyword: string,
    userId: string,
  ): Promise<[FundraisingActivity[], string | null]> {
    return ViewCompletedActivityController.getCompletedActivitiesWithMessage(
      userId,
      keyword,
    );

/**
 * BCE Controller: SearchActivityController
 */
export class SearchActivityController {
  /**
   * Delegates the search request to the FundraisingActivity entity.
   * Returns a tuple: [success, message, activities]
   */
  static async SearchActivity(
    keyword: string,
  ): Promise<[boolean, string, FundraisingActivity[]]> {
    return FundraisingActivity.find_activities(keyword);
  }
}
