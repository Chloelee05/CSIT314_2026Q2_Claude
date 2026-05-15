/**
 * BCE Boundary: ViewCompletedActivityBoundary (User Story #35)
 *
 * - viewCompletedActivity()                          — renders the completed activities page
 * - displayCompletedActivity(FundraisingActivity: list) — shows the list or alternate-flow flash
 */
type ActivityRow = {
  id: string;
  title: string;
  category: string;
  goal_amount: number;
  end_date: string | null;
};

export function ViewCompletedActivityBoundary({
  activities,
}: {
  activities: ActivityRow[];
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <a
        href="/dashboard/activities"
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← My activities
      </a>
      <h1 className="text-2xl font-bold text-gray-900 mt-2">
        Completed fundraising activities
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Campaigns with an end date on or before today.
      </p>

      <div className="mt-6">
        {activities.length === 0 ? (
          <p
            className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm"
            role="status"
          >
            No completed fundraising activities found.
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
