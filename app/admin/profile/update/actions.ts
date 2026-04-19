'use server';

import { UpdateUserProfileController } from '@/lib/controllers/UpdateUserProfileController';
import { revalidatePath } from 'next/cache';

export interface UpdateProfileState {
  success: boolean | null;
  message: string;
}

export async function updateUserProfileAction(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const accountId = formData.get('User_Account_id') as string;
  const profileId = formData.get('UserProfile_id') as string;
  const username = formData.get('NewUserName') as string;
  const password = formData.get('NewPassword') as string;
  const dob = formData.get('NewDOB') as string;
  const address = formData.get('NewAddress') as string;
  const phone = formData.get('NewPhoneNumber') as string;

  // BCE Sequence: Call UpdatedUserProfile(...)
  const isUpdated = await UpdateUserProfileController.UpdatedUserProfile(
    profileId || accountId, 
    username,
    password,
    dob,
    address,
    phone,
    accountId
  );

  if (!isUpdated) {
    // Alternate Flow Post-Condition
    return { success: false, message: 'Credentials not updated successfully' };
  }

  // BCE Sequence: Call Get_Updated(...) to verify data was saved
  await UpdateUserProfileController.Get_Updated(accountId);

  // Clear Next.js cache so the UI refreshes
  revalidatePath('/admin/profile/update');
  revalidatePath(`/admin/profile/${accountId}`);

  // Regular Flow Post-Condition
  return { success: true, message: 'Credentials updated successfully' };
}