import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { userLogoutAction } from '@/app/login/actions';
import { clickLogout } from '@/app/dashboard/DashboardPageBoundary';
import { pmLogoutAction } from '@/app/pr/account/logout/actions';
import Link from 'next/link';
import DashboardGrid from '@/app/dashboard/DashboardGrid';

const ROLE_LABELS: Record<string, string> = {
  fund_raiser: 'Fund Raiser',
  donee: 'Donee',
  platform_management: 'Platform Management',
};

/**
 * User Dashboard — shown after successful non-admin login.
 * BCE Boundary: show_dashboard() target for non-admin roles.
 * Donee logout (User Story #31): form action `clickLogout` → DashboardPageBoundary.
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
          <h1 className="text-lg font-bold text-gray-900">
            FundRaise{' '}
            {session.role === 'donee' && <span className="text-indigo-600">Donee</span>}
            {session.role === 'fund_raiser' && <span className="text-indigo-600">Fund Raiser</span>}
            {session.role === 'platform_management' && <span className="text-indigo-600">Platform Management</span>}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as{' '}
              <span className="font-medium">{session.username}</span>
            </span>
            <form action={session.role === 'donee' ? clickLogout : session.role === 'platform_management' ? pmLogoutAction : userLogoutAction}>
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
            <span className="font-medium text-indigo-600">{roleLabel}</span>.
          </p>
          {session.role === 'fund_raiser' && (
            <p className="mt-4 flex flex-wrap gap-4">
              <a
                href="/dashboard/activities"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                My activities →
              </a>
              <a
                href="/dashboard/activities/create"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Create fundraising activity →
              </a>
              <a
                href="/dashboard/activities/completed"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Search completed activities →
              </a>
            </p>
          )}
        </div>

        {session.role === 'donee' && (
          <DashboardGrid cards={[
            { href: '/donee/activity/search', title: 'Search Campaigns', description: 'Browse and search for active fundraising campaigns.' },
            { href: '/donee/activity/viewSaved', title: 'My Favourites', description: 'View fundraising campaigns you have saved.' },
            { href: '/donee/donation/history', title: 'Search Donations', description: 'Search your past donations by campaign name.' },
            { href: '/donee/donation/viewHistory', title: 'View Donation History', description: 'View all your past donation transactions.' },
          ]} />
        )}

        {session.role === 'platform_management' && (
          <DashboardGrid cards={[
            { href: '/pr/FRA/createCategories', title: 'Create Category', description: 'Add a new category to organise fundraising campaigns.' },
            { href: '/pr/FRA/viewCategories', title: 'View Categories', description: 'Browse and manage all FRA categories.' },
            { href: '/pr/FRA/searchCategories', title: 'Search Categories', description: 'Search FRA categories by keyword.' },
            { href: '/pr/dailyReport/create', title: 'Daily Report', description: 'Generate a daily activity report for any date.' },
            { href: '/pr/weeklyReport/create', title: 'Weekly Report', description: 'Generate a 7-day activity report to track trends.' },
            { href: '/pr/monthlyReport/create', title: 'Monthly Report', description: 'Analyse long-term performance for any month.' },
          ]} />
        )}
      </main>
    </div>
  );
}
