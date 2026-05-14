import { getSession } from '@/lib/auth';
import { FRACategory } from '@/lib/entities/FRACategory';

/**
 * BCE Controller: DeleteCategoryController (User Story #41)
 *
 * Orchestrates deletion of an FRA category for a logged-in Platform Manager.
 */
export class DeleteCategoryController {
  /**
   * Delete an FRA category by ID.
   * Signature matches BCE diagram: deleteFRACategory(category_id): boolean
   *
   * Returns [success, message] to drive showDeleteResult() in the boundary.
   * Precondition (use case): Platform Manager must be logged in.
   * Exception flow 5a: category is in use by active FRAs → blocked.
   */
  static async deleteFRACategory(
    categoryId: string,
  ): Promise<[boolean, string]> {
    const session = await getSession();
    if (!session || session.role !== 'platform_management') {
      return [false, 'Unauthorised.'];
    }

    if (!categoryId?.trim()) {
      return [false, 'Invalid category.'];
    }

    const category = await FRACategory.getById(categoryId);
    if (!category) {
      return [false, 'Category not found.'];
    }

    const inUse = await FRACategory.isInUseByActiveFRAs(category.name);
    if (inUse) {
      return [
        false,
        'Cannot delete category. It is currently in use by active FRAs.',
      ];
    }

    const deleted = await FRACategory.deleteCategory(categoryId);
    if (!deleted) {
      return [false, 'Failed to delete category. Please try again.'];
    }

    return [true, 'Category deleted successfully.'];
  }
}
