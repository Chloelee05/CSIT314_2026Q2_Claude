'use server';

import { SuspendUserProfileController } from '@/lib/controllers/SuspendUserProfileController';
import { revalidatePath } from 'next/cache';

export interface SuspendProfileState {
  success: boolean | null;
  message: string;
}

// Make sure this exact export name is here!
export async function suspendUserProfileAction(
  prevState: SuspendProfileState,
  formData: FormData
): Promise<SuspendProfileState> {
  const userprofile_id = formData.get('userprofile_id') as string;

  if (!userprofile_id) {
    return { success: false, message: 'Invalid profile ID.' };
  }

  // BCE Sequence: Call SuspendUserProfile(userprofile_id: string)
  const isSuspended = await SuspendUserProfileController.SuspendUserProfile(userprofile_id);

  if (!isSuspended) {
    return { success: false, message: 'Failed to suspend profile.' };
  }

  // Clear Next.js cache so the UI list immediately reflects the "Suspended" status
  revalidatePath('/admin/profile');

  // Regular Flow Post-Condition Flash Message
  return { success: true, message: 'User Profile status has been updated.' };
}