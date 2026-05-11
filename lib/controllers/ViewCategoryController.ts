import { FRACategory } from '@/lib/entities/FRACategory';

/**
 * BCE Controller: ViewCategoryController (User Story #39)
 *
 * Retrieves all FRA categories for display by the Platform Manager.
 */
export class ViewCategoryController {
  /**
   * Fetch all FRA categories.
   * Signature matches BCE diagram: getCategories(): list
   */
  static async getCategories(): Promise<FRACategory[]> {
    return FRACategory.getAll();
  }
}
