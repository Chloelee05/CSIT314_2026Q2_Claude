import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ViewFavouriteListController } from '@/lib/controllers/ViewFavouriteListController';
import Link from 'next/link';

/**
 * BCE Boundary: ViewFavouriteListBoundary
 * clickViewFavourites() → Donee navigates here from the dashboard.
 * displayFavouriteList(favList) → Rendered below.
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

        {/* Exception flow: empty or error */}
        {!success ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">{message}</p>
            <Link
              href="/donee/activity/search"
              className="inline-block mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse campaigns →
            </Link>
          </div>
        ) : (
          /* displayFavouriteList(favList) */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favList.map((item) => {
              const progressPct =
                item.goal_amount > 0
                  ? Math.min(100, (item.raised_amount / item.goal_amount) * 100)
                  : 0;

              return (
                <div
                  key={item.savedId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-base">{item.title}</h3>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                  )}

                  <div className="mt-auto">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Raised</span>
                      <span className="font-medium text-gray-900">
                        ${item.raised_amount.toLocaleString()} / ${item.goal_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Saved on {new Date(item.savedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href={`/donee/activity/view?id=${item.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
                      >
                        View
                      </Link>
                      <Link
                        href={`/donee/activity/removeSaved?fraId=${item.id}`}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                      >
                        Remove
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
