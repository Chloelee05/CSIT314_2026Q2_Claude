import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import SaveFRABoundary from './SaveFRABoundary';
import Link from 'next/link';

/**
 * BCE Boundary: SaveFRABoundary (server shell)
 * displaySaveButton() and showSaveResult() are in the SaveFRABoundary client component.
 */
export default async function SaveActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const activityId = resolvedParams.id ?? '';

  if (!activityId) {
    redirect('/donee/activity/search');
  }

  const [, , activity] = await ViewActivityController.ViewActivity(activityId);

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-10 text-center">
          <p className="text-red-800 font-semibold">Activity not found.</p>
          <Link href="/donee/activity/search" className="text-sm text-indigo-600 mt-3 inline-block">
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const progressPct =
    activity.goal_amount > 0
      ? Math.min(100, (activity.raised_amount / activity.goal_amount) * 100)
      : 0;

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

      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Save Campaign</h2>
          <Link
            href={`/donee/activity/view?id=${activityId}`}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Details
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="font-bold text-gray-900 text-lg">{activity.title}</h3>
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 capitalize">
              {activity.status}
            </span>
          </div>

          {activity.description && (
            <p className="text-gray-500 text-sm mb-4">{activity.description}</p>
          )}

          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Raised</span>
            <span className="font-medium text-gray-900">
              ${activity.raised_amount.toLocaleString()} / ${activity.goal_amount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* SaveFRABoundary client component — displaySaveButton + showSaveResult */}
          <SaveFRABoundary fraId={activityId} activityTitle={activity.title} />
        </div>
      </main>
    </div>
  );
}
