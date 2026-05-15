import { suspendUserAccountAction } from '@/app/admin/accounts/suspend/actions';

/**
 * BCE Boundary: SuspendUserAccountBoundary (User Story #9)
 *
 * - SuspendUserAccount(): void — triggers SuspendUserAccountController.SuspendUserAccount(UserAccount_id)
 */
export function SuspendUserAccountBoundary({
  userAccountId,
}: {
  userAccountId: string;
}) {
  return (
    /* SuspendUserAccount() — submit calls SuspendUserAccountController.SuspendUserAccount(id) */
    <form action={suspendUserAccountAction}>
      <input type="hidden" name="userAccountId" value={userAccountId} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 font-medium transition cursor-pointer"
      >
        Suspend
      </button>
    </form>
  );
}
