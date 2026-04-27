import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Control: ViewCompletedActivityController (User Story #35)
 *
 * List and detail of completed (ended) fundraising activities for a Fund Raiser.
 */
export class ViewCompletedActivityController {
  /**
   * BCE diagram: getCompletedActivities(userId: String): list
   */
  static async getCompletedActivities(
    userId: string,
  ): Promise<FundraisingActivity[]> {
    return FundraisingActivity.getCompletedByKeyword('', userId);
  }

  /**
   * List with optional search keyword (reuses #34 filters) and empty-state message
   * like the US #35 alt / sequence “no results” path.
   */
  static async getCompletedActivitiesWithMessage(
    userId: string,
    keyword: string,
  ): Promise<[FundraisingActivity[], string | null]> {
    const activities = await FundraisingActivity.getCompletedByKeyword(
      keyword,
      userId,
    );
    if (activities.length === 0) {
      return [
        activities,
        'No completed fundraising activities found.',
      ];
    }
    return [activities, null];
  }

  /**
   * One completed activity for the FR who owns it; null if missing, not completed, or wrong user.
   * Sequence: getCompletedById + ownership.
   */
  static async getCompletedActivityForUser(
    activityId: string,
    userId: string,
  ): Promise<FundraisingActivity | null> {
    const a = await FundraisingActivity.getCompletedById(activityId);
    if (!a) {
      return null;
    }
    if (a.user_id !== userId) {
      return null;
    }
    return a;
  }
}
