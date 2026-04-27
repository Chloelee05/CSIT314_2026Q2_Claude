import { getSession } from '@/lib/auth';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: UpdateActivityController (User Story #20)
 *
 * Orchestrates updates to a fundraising activity owned by a Fund Raiser.
 */
export class UpdateActivityController {
  /**
   * Update campaign fields for an existing activity.
   * Signature matches BCE diagram:
   * UpdateActivity(activity_id: int, title: str, description: str, goal: float): tuple
   *
   * Optional `endDate` (yyyy-mm-dd) is supported per User Story #20 use case (campaign end date).
   *
   * @returns [success, message]
   */
  static async UpdateActivity(
    activity_id: string,
    title: string,
    description: string,
    goal: number,
    endDate: string | null = null,
  ): Promise<[boolean, string]> {
    const session = await getSession();
    if (!session) {
      return [false, 'You must be logged in.'];
    }
    if (session.role !== 'fund_raiser') {
      return [false, 'You are not allowed to update this activity.'];
    }

    const trimmedTitle = title?.trim() ?? '';
    const trimmedDesc = description?.trim() ?? '';
    if (!trimmedTitle || !trimmedDesc) {
      return [false, 'Please fill in all required fields.'];
    }

    if (
      goal == null ||
      Number.isNaN(goal) ||
      !Number.isFinite(goal) ||
      goal <= 0
    ) {
      return [false, 'Goal amount must be a valid positive number.'];
    }

    const existing = await FundraisingActivity.getById(activity_id);
    if (!existing) {
      return [false, 'Activity not found.'];
    }
    if (existing.user_id !== session.userId) {
      return [false, 'You are not allowed to update this activity.'];
    }

    return FundraisingActivity.save_activity(
      activity_id,
      trimmedTitle,
      trimmedDesc,
      goal,
      endDate,
    );
  }
}
