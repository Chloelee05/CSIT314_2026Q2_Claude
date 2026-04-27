'use server';

import { DeleteActivityController } from '@/lib/controllers/DeleteActivityController';
import { revalidatePath } from 'next/cache';

export interface DeleteActivityState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: process_delete() → DeleteActivityController.DeleteActivity()
 * flash success / flash failure per sequence diagram.
 */
export async function deleteActivityAction(
  _prevState: DeleteActivityState,
  formData: FormData,
): Promise<DeleteActivityState> {
  const activityId = (formData.get('activityId') as string) ?? '';
  if (!activityId.trim()) {
    return {
      success: false,
      message: 'Could not remove the activity. Please try again.',
    };
  }

  const [ok, message] = await DeleteActivityController.DeleteActivity(
    activityId.trim(),
  );

  if (ok) {
    revalidatePath('/dashboard/activities');
    revalidatePath('/dashboard');
    return {
      success: true,
      message: 'Activity removed successfully.',
    };
  }

  return { success: false, message };
}
