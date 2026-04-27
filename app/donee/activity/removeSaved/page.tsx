import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { removeFavouriteAction } from './actions';
import Link from 'next/link';

/**
 * BCE Boundary: RemoveFavouriteBoundary
 * Displays a confirmation dialog before removing a saved campaign.
 */
export default async function RemoveSavedPage({
  searchParams,
}: {
  searchParams: Promise<{ fraId?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const fraId = resolvedParams.fraId ?? '';
  const hasError = resolvedParams.error === '1';

  if (!fraId) {
    redirect('/donee/activity/viewSaved');
  }

  const [, , activity] = await ViewActivityController.ViewActivity(fraId);

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

      <main className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Remove from Favourites</h2>

          {hasError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
              Failed to remove the activity. Please try again.
            </div>
          )}

          {activity ? (
            <>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to remove{' '}
                <span className="font-semibold text-gray-900">&quot;{activity.title}&quot;</span>{' '}
                from your favourites? This action cannot be undone.
              </p>

              {/* Confirm removal form */}
              <form action={removeFavouriteAction} className="flex gap-3">
                <input type="hidden" name="fraId" value={fraId} />
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition cursor-pointer"
                >
                  Yes, Remove
                </button>
                {/* Exception flow 4a: cancel — no removal occurs */}
                <Link
                  href="/donee/activity/viewSaved"
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg text-sm transition"
                >
                  Cancel
                </Link>
              </form>
            </>
          ) : (
            <p className="text-gray-500 text-sm mb-6">Activity not found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
