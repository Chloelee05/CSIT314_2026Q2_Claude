import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ViewFavouriteListController } from '@/lib/controllers/ViewFavouriteListController';
import { ViewFavouriteListBoundary } from '@/lib/boundaries/ViewFavouriteListBoundary';
import Link from 'next/link';

/**
 * BCE Boundary: ViewFavouriteListBoundary — viewFavourite() (User Story #28)
 * Authenticates the donee then delegates rendering to ViewFavouriteListBoundary.
 */
export default async function ViewSavedPage({
  searchParams,
}: {
  searchParams: Promise<{ removed?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const justRemoved = resolvedParams.removed === '1';

  const [success, message, favList] = await ViewFavouriteListController.getFavouriteList(
    session.userId,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            FundRaise <span className="text-indigo-600">Donee</span>
          </h1>
          <span className="text-sm text-gray-600">
            Logged in as <span className="font-medium">{session.username}</span>
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {justRemoved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-800 text-sm font-medium">
            Activity removed from your favourites.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Favourites</h2>
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        <ViewFavouriteListBoundary
          success={success}
          message={message}
          favList={favList}
        />
      </main>
    </div>
  );
}
