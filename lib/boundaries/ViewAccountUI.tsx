import { UserAccount } from '@/lib/entities/UserAccount';
import { suspendUserAccountAction } from '@/app/admin/accounts/suspend/actions';
import Link from 'next/link';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  fund_raiser: 'Fund Raiser',
  donee: 'Donee',
  platform_management: 'Platform Management',
};

/**
 * BCE Boundary: ViewAccountUI (User Story #7)
 *
 * - navigateToUsers()                       — user navigates to the accounts list page
 * - displayAccountDetails(account: UserAccount) — renders the account list table
 * - displayResult(msg: String)              — shows "No accounts found" alternate flow
 */
export function ViewAccountUI({
  success,
  message,
  accounts,
}: {
  success: boolean;
  message: string;
  accounts: UserAccount[];
}) {
  if (!success) {
    /* displayResult(msg) — alternate flow: No accounts found */
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
        <p className="text-gray-500">{message}</p>
      </div>
    );
  }

  /* displayAccountDetails(account) — main flow: account list table */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr
              key={account.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 text-gray-900">
                {account.full_name ?? account.username}
              </td>
              <td className="px-4 py-3 text-gray-600">{account.email}</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                  {ROLE_LABELS[account.role] ?? account.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    account.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {account.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/accounts/${account.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    View Details
                  </Link>
                  {account.status === 'active' && (
                    <form action={suspendUserAccountAction}>
                      <input type="hidden" name="userAccountId" value={account.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 font-medium transition cursor-pointer"
                      >
                        Suspend
                      </button>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
