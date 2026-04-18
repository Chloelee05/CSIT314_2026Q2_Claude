'use server';

import { SuspendUserAccountController } from '@/lib/controllers/SuspendUserAccountController';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * BCE Boundary: SuspendUserProfileBoundary — SuspendUserAccount(UserAccount_id)
 *
 * Server action for User Story #9: Suspend User Account.
 * Sequence: SuspendUserAccount(id) → Controller.SuspendUserAccount(id) → Entity.SuspendUserAccount(id)
 */
export async function suspendUserAccountAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const userAccountId = formData.get('userAccountId') as string;

  const success = await SuspendUserAccountController.SuspendUserAccount(userAccountId);

  const message = success
    ? 'User Account status has been updated.'
    : 'Failed to update account status.';

  redirect(`/admin/accounts?message=${encodeURIComponent(message)}`);
}
