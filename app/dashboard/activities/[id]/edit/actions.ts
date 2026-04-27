'use server';

import { UpdateActivityController } from '@/lib/controllers/UpdateActivityController';
import { revalidatePath } from 'next/cache';

export interface UpdateActivityState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: process_update() → UpdateActivityController.UpdateActivity()
 * flash success / flash failure per sequence diagram.
 */
export async function updateActivityAction(
  _prevState: UpdateActivityState,
  formData: FormData,
): Promise<UpdateActivityState> {
  const activityId = (formData.get('activityId') as string) ?? '';
  const title = (formData.get('title') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';
  const goalRaw = formData.get('goal') as string;
  const goal = parseFloat(goalRaw);
  const endDateRaw = (formData.get('endDate') as string) ?? '';

  const [ok, message] = await UpdateActivityController.UpdateActivity(
    activityId,
    title,
    description,
    goal,
    endDateRaw.trim() || null,
  );

  if (ok) {
    revalidatePath('/dashboard/activities');
    revalidatePath(`/dashboard/activities/${activityId}`);
    return {
      success: true,
      message: 'Activity updated successfully.',
    };
  }

  return { success: false, message };
}
