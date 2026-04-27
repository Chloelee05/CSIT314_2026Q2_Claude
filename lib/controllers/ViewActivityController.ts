import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * BCE Controller: ViewActivityController
 */
export class ViewActivityController {
  /**
   * Delegates the fetch request to the FundraisingActivity entity.
   * Returns a tuple: [success, message, activity | null]
   */
  static async ViewActivity(
    activity_id: string,
  ): Promise<[boolean, string, FundraisingActivity | null]> {
    return FundraisingActivity.get_activities_details(activity_id);
  }
}
