'use client';

/**
 * BCE Boundary: SearchCompleteActivityBoundary (User Story #34)
 *
 * - process_search()  — GET form targeting the completed activities page
 * - show_results()    — renders the matched list or the alternate-flow flash message
 */

type ActivityRow = {
  id: string;
  title: string;
  category: string;
  goal_amount: number;
  end_date: string | null;
};

function show_results(activities: ActivityRow[]) {
  return (
    <ul className="space-y-3" role="list">
      {activities.map((a) => (
        <li
          key={a.id}
          className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h2 className="font-semibold text-gray-900">{a.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {a.category} · Goal ${Number(a.goal_amount).toFixed(2)}
              {a.end_date
                ? ` · Ended ${new Date(a.end_date + 'T12:00:00').toLocaleDateString()}`
                : null}
            </p>
          </div>
          <a
            href={`/dashboard/activities/completed/${a.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 self-start"
          >
            View details
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SearchCompleteActivityBoundary({
  activities,
  initialQuery,
  emptyStateMessage,
}: {
  activities: ActivityRow[];
  initialQuery: string;
  emptyStateMessage: string | null;
}) {
  function process_search(query: string) {
    return (
      <form
        method="GET"
        action="/dashboard/activities/completed"
        className="mt-6 flex gap-2"
      >
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by title, description, or category…"
          aria-label="Search completed fundraising activities"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <a
        href="/dashboard/activities"
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← My activities
      </a>
      <h1 className="text-2xl font-bold text-gray-900 mt-2">
        Search completed fundraising activities
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Only campaigns with an end date on or before today are included.
      </p>

      {process_search(initialQuery)}

      <div className="mt-6">
        {activities.length === 0 ? (
          <p
            className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm"
            role="status"
          >
            {emptyStateMessage ?? 'No completed fundraising activities found.'}
          </p>
        ) : (
          show_results(activities)
        )}
      </div>
    </div>
  );
}
