import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

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
