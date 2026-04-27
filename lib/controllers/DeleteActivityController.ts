import { getSession } from '@/lib/auth';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: DeleteActivityController (User Story #21)
 *
 * Coordinates removal of a fundraising activity for a Fund Raiser.
 */
export class DeleteActivityController {
  /**
   * Delete (remove) a fundraising activity.
   * Signature matches BCE diagram: DeleteActivity(activity_id: int): tuple
   *
   * Exception 5a: FR must own the activity (authorization).
   * Exception 5b: persistence errors are surfaced from the entity layer.
   *
   * @returns [success, message]
   */
  static async DeleteActivity(
    activity_id: string,
  ): Promise<[boolean, string]> {
    const session = await getSession();
    if (!session) {
      return [false, 'You must be logged in.'];
    }
    if (session.role !== 'fund_raiser') {
      return [false, 'You are not allowed to remove this activity.'];
    }

    const existing = await FundraisingActivity.getById(activity_id);
    if (!existing) {
      return [false, 'Activity not found.'];
    }
    if (existing.user_id !== session.userId) {
      return [false, 'You are not allowed to remove this activity.'];
    }

    return FundraisingActivity.remove_activity(activity_id);
  }
}
