import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { UserAccount } from '@/lib/entities/UserAccount';
import Link from 'next/link';
import CreateUserProfileForm from './CreateUserProfileForm';

/**
 * BCE Boundary: CreateUserProfileBoundary — Show_Create_Form()
 *
 * Displays the create user profile form with an account selector.
 * Sequence: Show_Create_Form() → render form → CreateUserProfile(...)
 *
 * User Story #11: Create User Profile
 * Route: /admin/profile/create
 */
export default async function CreateUserProfilePage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  // Load all accounts so admin can select which one to create a profile for
  const accounts = await UserAccount.getAll();
  const accountOptions = accounts.map((a) => ({
    id: a.id,
    label: a.full_name ? `${a.full_name} (${a.username})` : a.username,
  }));

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
            href="/admin/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Create User Profile</h2>
          <p className="text-sm text-gray-500 mb-6">
            Add personal details to an existing user account.
          </p>

          {/* CreateUserProfileBoundary: Show_Create_Form() + CreateUserProfile() */}
          <CreateUserProfileForm accounts={accountOptions} />
        </div>
      </main>
    </div>
  );
}
