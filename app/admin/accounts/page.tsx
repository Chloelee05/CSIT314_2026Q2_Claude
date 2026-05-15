import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { ViewAccountController } from '@/lib/controllers/ViewAccountController';
import { ViewAccountUI } from '@/lib/boundaries/ViewAccountUI';
import Link from 'next/link';

/**
 * BCE page: ViewAccountUI — User Story #7
 * navigateToUsers() → getAccountDetails() → fetchAccountDetails()
 *   → displayAccountDetails(account) | displayResult("No accounts found")
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

  const { message: flashMessage } = await searchParams;

  const [success, message, accounts] =
    await ViewAccountController.getAccountDetails();

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
          <h2 className="text-xl font-semibold text-gray-900">User Accounts</h2>
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

        {flashMessage && (
          <div className="mb-4 rounded-lg px-4 py-3 text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            {flashMessage}
          </div>
        )}

        <ViewAccountUI success={success} message={message} accounts={accounts} />
      </main>
    </div>
  );
}
