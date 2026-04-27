import { getSession } from '@/lib/auth';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: CreateActivityController (User Story #18)
 *
 * Orchestrates creation of a fundraising activity for a logged-in Fund Raiser.
 */
export class CreateActivityController {
  /**
   * Create a new fundraising activity.
   * Signature matches BCE diagram:
   * createActivity(title: String, description: String, goalAmount: float, category: String): boolean
   *
   * Precondition (use case): Fund Raiser must be logged in with an active session.
   */
  static async createActivity(
    title: string,
    description: string,
    goalAmount: number,
    category: string,
  ): Promise<boolean> {
    const session = await getSession();
    if (!session || session.role !== 'fund_raiser') {
      return false;
    }

    if (!CreateActivityController.isValidInput(title, description, goalAmount, category)) {
      return false;
    }

    const activity = new FundraisingActivity({
      id: '',
      user_id: session.userId,
      title: title.trim(),
      description: description.trim(),
      goal_amount: goalAmount,
      category: category.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return FundraisingActivity.save(activity);
  }

  /**
   * Validates required fields for the alternate flow (4a) in the use case description.
   */
  static isValidInput(
    title: string,
    description: string,
    goalAmount: number,
    category: string,
  ): boolean {
    if (!title?.trim() || !description?.trim() || !category?.trim()) {
      return false;
    }
    if (
      goalAmount == null ||
      Number.isNaN(goalAmount) ||
      !Number.isFinite(goalAmount) ||
      goalAmount <= 0
    ) {
      return false;
    }
    return true;
  }
}
