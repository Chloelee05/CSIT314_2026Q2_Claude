import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { ViewAccountController } from '@/lib/controllers/ViewAccountController';
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
 * BCE Boundary: ViewAccountUI — displayAccountList(accounts: list)
 *
 * Displays the list of all user accounts.
 * Sequence: navigateToUsers() → getAccountDetails(null) → getAll() → displayAccountList()
 */
export default async function AccountListPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { message } = await searchParams;

  // ViewAccountUI → ViewAccountController: getAccountDetails(null)
  const accounts = (await ViewAccountController.getAccountDetails(
    null,
  )) as UserAccount[];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            FundRaise <span className="text-indigo-600">Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as{' '}
              <span className="font-medium">{session.username}</span>
            </span>
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            User Accounts
          </h2>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/accounts/search"
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
            >
              Search Accounts
            </Link>
            <Link
              href="/admin/accounts/create"
              className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* SuspendUserProfileBoundary: flash message */}
        {message && (
          <div className="mb-4 rounded-lg px-4 py-3 text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            {message}
          </div>
        )}

        {/* ALT: No user accounts exist */}
        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">No user accounts found.</p>
          </div>
        ) : (
          /* displayAccountList(accounts) */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Status
                  </th>
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
                        {/* selectUser(userId) */}
                        <Link
                          href={`/admin/accounts/${account.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                          View Details
                        </Link>
                        {/* SuspendUserProfileBoundary: SuspendUserAccount(UserAccount_id) */}
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
        )}
      </main>
    </div>
  );
}
