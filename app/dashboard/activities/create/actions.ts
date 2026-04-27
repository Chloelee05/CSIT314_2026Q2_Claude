'use server';

import { CreateActivityController } from '@/lib/controllers/CreateActivityController';

export interface CreateActivityState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: submitDetails() → CreateActivityController.createActivity()
 * Maps controller boolean to displayResult() messages (sequence diagram).
 */
export async function createActivityAction(
  _prevState: CreateActivityState,
  formData: FormData,
): Promise<CreateActivityState> {
  const title = (formData.get('title') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';
  const category = (formData.get('category') as string) ?? '';
  const goalRaw = formData.get('goalAmount') as string;
  const goalAmount = parseFloat(goalRaw);

  const ok = await CreateActivityController.createActivity(
    title,
    description,
    goalAmount,
    category,
  );

  if (!ok) {
    return {
      success: false,
      message: 'Please fill in all required fields.',
    };
  }

  return {
    success: true,
    message: 'Activity created',
  };
}
