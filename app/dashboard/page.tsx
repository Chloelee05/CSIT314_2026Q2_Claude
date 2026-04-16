import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { userLogoutAction } from '@/app/login/actions';

const ROLE_LABELS: Record<string, string> = {
  fund_raiser: 'Fund Raiser',
  donee: 'Donee',
  platform_management: 'Platform Management',
};

/**
 * User Dashboard — shown after successful non-admin login.
 * BCE Boundary: show_dashboard() target for non-admin roles.
 */
export default async function UserDashboard() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role === 'admin') {
    redirect('/admin/dashboard');
  }

  const roleLabel = ROLE_LABELS[session.role] ?? session.role;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">FundRaise</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as{' '}
              <span className="font-medium">{session.username}</span>
            </span>
            <form action={userLogoutAction}>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome, {session.username}
          </h2>
          <p className="text-gray-600">
            You are logged in as{' '}
            <span className="font-medium text-indigo-600">{roleLabel}</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
