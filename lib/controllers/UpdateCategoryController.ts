import { getSession } from '@/lib/auth';
import { FRACategory } from '@/lib/entities/FRACategory';

/**
 * BCE Controller: UpdateCategoryController (User Story #40)
 *
 * Orchestrates updating an FRA category for a logged-in Platform Manager.
 */
export class UpdateCategoryController {
  /**
   * Update an existing FRA category name.
   * Signature matches BCE diagram: updateCategory(categoryId: String, categoryName: String): boolean
   *
   * Returns [success, message] to drive displayResult() in the boundary.
   * Precondition (use case): Platform Manager must be logged in with an active session.
   */
  static async updateCategory(
    categoryId: string,
    categoryName: string,
  ): Promise<[boolean, string]> {
    const session = await getSession();
    if (!session || session.role !== 'platform_management') {
      return [false, 'Unauthorised.'];
    }

    if (!categoryId?.trim() || !categoryName?.trim()) {
      return [false, 'Category name is required.'];
    }

    const exists = await FRACategory.existsByName(categoryName);
    if (exists) {
      return [false, 'Category name already exists.'];
    }

    const saved = await FRACategory.update(categoryId, categoryName);
    if (!saved) {
      return [false, 'Failed to update category. Please try again.'];
    }

    return [true, 'Category updated successfully.'];
  }
}
