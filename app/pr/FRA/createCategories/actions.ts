'use server';

import { CreateCategoryController } from '@/lib/controllers/CreateCategoryController';

export interface CreateCategoryState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: submitCategory(categoryName) → CreateCategoryController.createCategory()
 * Maps controller result to displayResult() messages (sequence diagram).
 */
export async function createCategoryAction(
  _prevState: CreateCategoryState,
  formData: FormData,
): Promise<CreateCategoryState> {
  const categoryName = (formData.get('categoryName') as string) ?? '';

  const [success, message] = await CreateCategoryController.createCategory(categoryName);

  return { success, message };
}
