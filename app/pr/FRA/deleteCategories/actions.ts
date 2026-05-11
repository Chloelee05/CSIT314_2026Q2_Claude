'use server';

import { CategoryController } from '@/lib/controllers/CategoryController';
import { redirect } from 'next/navigation';

export interface DeleteCategoryState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: select category & click Delete → CategoryController.deleteFRACategory()
 * Maps controller result to showDeleteResult() messages (sequence diagram).
 * On success, redirects back to the category list.
 */
export async function deleteCategoryAction(
  _prevState: DeleteCategoryState,
  formData: FormData,
): Promise<DeleteCategoryState> {
  const categoryId = (formData.get('categoryId') as string) ?? '';

  const [success, message] = await CategoryController.deleteFRACategory(categoryId);

  if (success) {
    redirect('/pr/FRA/viewCategories');
  }

  return { success, message };
}
