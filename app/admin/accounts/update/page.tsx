import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { UpdateUserAccountController } from '@/lib/controllers/UpdateUserAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';
import Link from 'next/link';
import UpdateUserAccountForm from './UpdateUserAccountForm';

/**
 * BCE Boundary: UpdateUserAccountBoundary — Show_Update_Form(UserAccount_id)
 *
 * Displays the update form pre-populated with current account data.
 * Sequence: Show_Update_Form(id) → Get_Updated(id) → Entity.Get_Updated(id)
 *
 * User Story #8: Update User Account
 * Route: /admin/accounts/update?id=<uuid>
 */
export default async function UpdateUserAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { id } = await searchParams;
  if (!id) {
    redirect('/admin/accounts');
  }

  // UpdateUserAccountBoundary → UpdateUserAccountController: Get_Updated(userAccount_id)
  const account = (await UpdateUserAccountController.Get_Updated(id)) as UserAccount | null;

  if (!account) {
    redirect('/admin/accounts');
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
        <div className="mb-6">
          <Link
            href={`/admin/accounts/${id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Account Details
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Update User Account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Editing account for{' '}
            <span className="font-medium text-gray-700">{account.full_name ?? account.username}</span>
          </p>

          {/* UpdateUserAccountBoundary → Show_Update_Form(UserAccount_id) */}
          <UpdateUserAccountForm
            userAccountId={account.id}
            currentUsername={account.username}
            currentRole={account.role}
          />
        </div>
      </main>
    </div>
  );
}
