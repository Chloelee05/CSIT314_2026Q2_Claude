import { getSession } from '@/lib/auth';
import { FRACategory } from '@/lib/entities/FRACategory';

/**
 * BCE Controller: SearchCategoriesController (User Story #42)
 *
 * Orchestrates category search operations for the Platform Manager.
 */
export class SearchCategoriesController {
  /**
   * Search FRA categories by keyword.
   * Signature matches BCE diagram: searchFRACategories(keyword)
   *
   * Returns [categories, message] — message is non-empty only on exception flow 4a.
   * Precondition (use case): Platform Manager must be logged in.
   */
  static async searchFRACategories(
    keyword: string,
  ): Promise<[FRACategory[], string]> {
    const session = await getSession();
    if (!session || session.role !== 'platform_management') {
      return [[], 'Unauthorised.'];
    }

    const categories = await FRACategory.getCategoriesByKeyword(keyword);

    if (categories.length === 0) {
      return [[], 'No categories found matching your search.'];
    }

    return [categories, ''];
  }
}
