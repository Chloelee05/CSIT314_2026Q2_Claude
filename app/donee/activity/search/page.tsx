import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SearchActivityController } from '@/lib/controllers/SearchActivityController';
import SearchActivityBoundary from './SearchActivityBoundary';
import Link from 'next/link';

/**
 * BCE Boundary: SearchActivityBoundary
 * Implements show_results() — renders the search form and campaign results.
 * process_search() is handled by the client form + server action.
 */
export default async function SearchActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const keyword = resolvedParams.keyword ?? '';

  const [success, , activities] = await SearchActivityController.SearchActivity(keyword);

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Search Campaigns</h2>
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        <SearchActivityBoundary currentKeyword={keyword} />

        {keyword && !success ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 font-medium">No activities found</p>
            <p className="text-yellow-600 text-sm mt-1">
              No active campaigns match &quot;{keyword}&quot;. Try a different keyword.
            </p>
          </div>
        ) : !keyword && !success ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">Enter a keyword above to search for campaigns.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{activity.title}</h3>
                  {activity.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Raised</span>
                    <span className="font-medium text-gray-900">
                      ${activity.raised_amount.toLocaleString()} / ${activity.goal_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, activity.goal_amount > 0 ? (activity.raised_amount / activity.goal_amount) * 100 : 0)}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
