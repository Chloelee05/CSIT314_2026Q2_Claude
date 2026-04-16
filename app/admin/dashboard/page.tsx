import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import Link from 'next/link';

/**
 * Admin Dashboard — shown after successful Admin login.
 * BCE Boundary: show_dashboard() target for admin role.
 */
export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome, {session.username}
          </h2>
          <p className="text-gray-600">
            You are logged in as{' '}
            <span className="font-medium text-indigo-600">Admin</span>. Use the
            actions below to manage user accounts and system settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/accounts/create"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
              Create Account
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Register a new user account
            </p>
          </Link>
          <Link
            href="/admin/accounts"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
              View Accounts
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Browse and inspect user accounts
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
