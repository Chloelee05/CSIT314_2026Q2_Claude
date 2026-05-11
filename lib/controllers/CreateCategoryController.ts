import { getSession } from '@/lib/auth';
import { FRACategory } from '@/lib/entities/FRACategory';

/**
 * BCE Controller: CreateCategoryController (User Story #38)
 *
 * Orchestrates creation of an FRA category for a logged-in Platform Manager.
 */
export class CreateCategoryController {
  /**
   * Create a new FRA category.
   * Signature matches BCE diagram: createCategory(categoryName: String): boolean
   *
   * Returns [success, message] to drive displayResult() in the boundary.
   * Precondition (use case): Platform Manager must be logged in with an active session.
   */
  static async createCategory(
    categoryName: string,
  ): Promise<[boolean, string]> {
    const session = await getSession();
    if (!session || session.role !== 'platform_management') {
      return [false, 'Unauthorised.'];
    }

    if (!categoryName?.trim()) {
      return [false, 'Category name is required.'];
    }

    const exists = await FRACategory.existsByName(categoryName);
    if (exists) {
      return [false, 'Category already exists.'];
    }

    const saved = await FRACategory.save(categoryName);
    if (!saved) {
      return [false, 'Failed to create category. Please try again.'];
    }

    return [true, 'Category created successfully.'];
  }
}
