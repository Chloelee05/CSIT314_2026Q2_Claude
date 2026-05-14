import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: ViewCompletedActivityController (User Story #35)
 *
 * List and detail of completed (ended) fundraising activities for a Fund Raiser.
 */
export class ViewCompletedActivityController {
  /**
   * Retrieve all completed activities for a user.
   * Signature matches BCE diagram: getCompletedActivity(): list
   */
  static async getCompletedActivity(
    userId: string,
  ): Promise<FundraisingActivity[]> {
    return FundraisingActivity.fetchCompletedActivity(userId);
  }

  /**
   * One completed activity for the FR who owns it; null if missing, not completed, or wrong user.
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
