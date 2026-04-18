import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { SearchUserAccountController } from '@/lib/controllers/SearchUserAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';
import { Suspense } from 'react';
import Link from 'next/link';
import SearchUserAccountForm from './SearchUserAccountForm';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  fund_raiser: 'Fund Raiser',
  donee: 'Donee',
  platform_management: 'Platform Management',
};

/**
 * BCE Boundary: SearchUserAccountBoundary — SearchUserAccount()
 *
 * Displays search bar and results for user account search.
 * Sequence: SearchUserAccount() → Controller.SearchUserAccount(Keyword, search_by) → Entity.SearchUserAccount(Keyword, search_by) → return list
 *
 * User Story #10: Search User Account
 * Route: /admin/accounts/search
 */
export default async function SearchUserAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; search_by?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { keyword = '', search_by = 'UserName' } = await searchParams;

  // SearchUserAccountBoundary → SearchUserAccountController: SearchUserAccount(Keyword, search_by)
  const accounts = (await SearchUserAccountController.SearchUserAccount(
    keyword,
    search_by,
  )) as UserAccount[];

  const hasSearched = keyword.trim().length > 0;

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
        <div className="mb-6">
          <Link
            href="/admin/accounts"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Account List
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-xl font-semibold text-gray-900">Search User Accounts</h2>
          {/* SearchUserAccountBoundary: SearchUserAccount() */}
          <Suspense>
            <SearchUserAccountForm />
          </Suspense>
        </div>

        {!hasSearched ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">Enter a keyword above to search for user accounts.</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">
              No accounts found matching{' '}
              <span className="font-medium text-gray-700">&ldquo;{keyword}&rdquo;</span>.
            </p>
          </div>
        ) : (
          /* return list — display matching accounts */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-sm text-gray-500">
              {accounts.length} result{accounts.length !== 1 ? 's' : ''} for{' '}
              <span className="font-medium text-gray-700">&ldquo;{keyword}&rdquo;</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Username</th>
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
                      {account.full_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{account.username}</td>
                    <td className="px-4 py-3 text-gray-600">{account.email ?? '—'}</td>
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
                      <Link
                        href={`/admin/accounts/${account.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                      >
                        View Details
                      </Link>
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
