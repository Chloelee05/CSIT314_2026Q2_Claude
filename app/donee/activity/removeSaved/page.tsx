import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { RemoveFavouriteBoundary } from '@/lib/boundaries/RemoveFavouriteBoundary';

/**
 * BCE Boundary: RemoveFavouriteBoundary — process_removeFRA() (User Story #29)
 * Authenticates the donee then delegates rendering to RemoveFavouriteBoundary.
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
        <RemoveFavouriteBoundary
          fraId={fraId}
          activityTitle={activity?.title ?? null}
          hasError={hasError}
        />
      </main>
    </div>
  );
}
