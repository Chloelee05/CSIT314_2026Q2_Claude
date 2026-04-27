import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: ViewActivityController (User Story #19)
 *
 * Mediates read access to fundraising activities for a Fund Raiser.
 */
export class ViewActivityController {
  /**
   * Load all activities for a user.
   * Signature matches BCE diagram: getActivities(userId: String): list
   * Sequence: delegates to FundraisingActivity.getByUserId(userId)
   */
  static async getActivities(
    userId: string,
  ): Promise<FundraisingActivity[]> {
    return FundraisingActivity.getByUserId(userId);
  }

  /**
   * Load a single activity for a viewer (sequence: selectActivity → getById).
   * Ensures the activity belongs to the user (only FR may view their own data).
   * Returns null if the activity is missing or not owned.
   */
  static async getActivityForUser(
    activityId: string,
    userId: string,
  ): Promise<FundraisingActivity | null> {
    const activity = await FundraisingActivity.getById(activityId);
    if (!activity) {
      return null;
    }
    if (activity.user_id !== userId) {
      return null;
    }
    return activity;
  }
}
