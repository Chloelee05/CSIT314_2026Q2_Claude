type ActivityDetails = {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  category: string;
  end_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

/**
 * BCE Boundary: ViewCompletedActivityDetailsBoundary (User Story #35)
 *
 * - displayActivityDetails(activity) — show full details for a completed (ended) campaign
 */
export function ViewCompletedActivityDetailsBoundary({
  activity,
}: {
  activity: ActivityDetails;
}) {
  function displayActivityDetails(a: ActivityDetails) {
    return (
      <div className="max-w-2xl mx-auto">
        <a
          href="/dashboard/activities/completed"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to completed activities
        </a>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded">
            Completed
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`/dashboard/activities/${a.id}/stats`}
            className="text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-lg"
          >
            View statistics
          </a>
          <a
            href={`/dashboard/activities/${a.id}/edit`}
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
          >
            Edit activity
          </a>
        </div>

        <article className="mt-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{a.title}</h1>
          <p className="text-sm text-indigo-600 mt-1">{a.category}</p>
          <p className="text-lg font-semibold text-gray-800 mt-4">
            Goal: ${Number(a.goal_amount).toFixed(2)}
          </p>
          {a.end_date && (
            <p className="text-sm text-gray-600 mt-2">
              Ended:{' '}
              {new Date(a.end_date + 'T12:00:00').toLocaleDateString()}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Total views: {a.view_count}
          </p>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Description
            </h2>
            <p className="text-gray-700 mt-2 whitespace-pre-wrap">
              {a.description}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Created {new Date(a.created_at).toLocaleString()}
          </p>
        </article>
      </div>
    );
  }

  return displayActivityDetails(activity);
}
