import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { ViewAccountController } from '@/lib/controllers/ViewAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';
import Link from 'next/link';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  fund_raiser: 'Fund Raiser',
  donee: 'Donee',
  platform_management: 'Platform Management',
};

/**
 * BCE Boundary: ViewAccountUI — displayAccountDetails(account: UserAccount)
 *
 * Displays details of a single user account.
 * Sequence: selectUser(userId) → getAccountDetails(userId) → getById(userId) → displayAccountDetails()
 */
export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { id } = await params;

  // ViewAccountUI → ViewAccountController: getAccountDetails(userId)
  const account = (await ViewAccountController.getAccountDetails(
    id,
  )) as UserAccount | null;

  if (!account) {
    redirect('/admin/accounts');
  }

  const roleLabel = ROLE_LABELS[account.role] ?? account.role;

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

        {/* displayAccountDetails(account) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Account Details
          </h2>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-gray-900">
                {account.full_name ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-gray-900">{account.username}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-gray-900">{account.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                  {roleLabel}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {account.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-gray-900">
                {new Date(account.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
