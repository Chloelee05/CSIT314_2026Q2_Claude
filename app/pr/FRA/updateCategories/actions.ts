'use server';

import { UpdateCategoryController } from '@/lib/controllers/UpdateCategoryController';

export interface UpdateCategoryState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: submitUpdate(categoryId, categoryName) → UpdateCategoryController.updateCategory()
 * Maps controller result to displayResult() messages (sequence diagram).
 */
export async function updateCategoryAction(
  _prevState: UpdateCategoryState,
  formData: FormData,
): Promise<UpdateCategoryState> {
  const categoryId = (formData.get('categoryId') as string) ?? '';
  const categoryName = (formData.get('categoryName') as string) ?? '';

  const [success, message] = await UpdateCategoryController.updateCategory(
    categoryId,
    categoryName,
  );

  return { success, message };
}
