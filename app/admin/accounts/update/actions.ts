'use server';

import { UpdateUserAccountController } from '@/lib/controllers/UpdateUserAccountController';

/**
 * BCE Boundary: UpdateUserAccountBoundary — UpdatedUserAccount(UserAccount_id)
 *
 * Server action for User Story #8: Update User Account.
 * Sequence: UpdatedUserAccount(id,...) → Controller.UpdatedUserAccount(...) → Entity.UpdatedUserAccount(...)
 */
export interface UpdateAccountState {
  success: boolean;
  message: string;
}

export async function updateAccountAction(
  _prevState: UpdateAccountState,
  formData: FormData,
): Promise<UpdateAccountState> {
  const userAccountId = formData.get('userAccountId') as string;
  const newUserName = (formData.get('newUserName') as string) ?? '';
  const newPassword = (formData.get('newPassword') as string) ?? '';
  const newRole = (formData.get('newRole') as string) ?? '';

  if (!userAccountId) {
    return { success: false, message: 'Account not updated successfully' };
  }

  if (!newUserName.trim()) {
    return { success: false, message: 'Account not updated successfully' };
  }

  if (!newRole.trim()) {
    return { success: false, message: 'Account not updated successfully' };
  }

  const success = await UpdateUserAccountController.UpdatedUserAccount(
    userAccountId,
    newUserName,
    newPassword,
    newRole,
    userAccountId,
  );

  if (!success) {
    return { success: false, message: 'Account not updated successfully' };
  }

  return { success: true, message: 'Account updated Successfully' };
}
