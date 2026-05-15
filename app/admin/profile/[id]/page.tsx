import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { ViewProfileController } from '@/lib/controllers/ViewProfileController';
import ViewProfileBoundary from '@/lib/boundaries/ViewProfileBoundary';
import Link from 'next/link';

/**
 * BCE page: ViewProfileBoundary — User Story #12
 * getProfileDetails(userId) → fetchProfile(userId) → displayProfileDetails / displayErrorMessage
 */
export default async function ViewProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const result = await ViewProfileController.getProfileDetails(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            FundRaise <span className="text-indigo-600">Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{session.username}</span>
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
        <Link
          href="/admin/profile"
          className="text-indigo-600 hover:text-indigo-800 text-sm mb-6 inline-block transition"
        >
          &larr; Back to Profiles List
        </Link>

        <ViewProfileBoundary profile={result.profile} error={result.error} />
      </main>
    </div>
  );
}
