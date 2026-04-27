type ActivityDetails = {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  category: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * BCE Boundary: ViewActivityUI — displayActivityDetails(activity) (User Story #19)
 */
export function ViewActivityDetailsUI({
  activity,
}: {
  activity: ActivityDetails;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <a
        href="/dashboard/activities"
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← Back to activities
      </a>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={`/dashboard/activities/${activity.id}/edit`}
          className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
        >
          Edit activity
        </a>
      </div>
      <article className="mt-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{activity.title}</h1>
        <p className="text-sm text-indigo-600 mt-1">{activity.category}</p>
        <p className="text-lg font-semibold text-gray-800 mt-4">
          Goal: ${Number(activity.goal_amount).toFixed(2)}
        </p>
        {activity.end_date && (
          <p className="text-sm text-gray-600 mt-2">
            End date:{' '}
            {new Date(activity.end_date + 'T12:00:00').toLocaleDateString()}
          </p>
        )}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Description
          </h2>
          <p className="text-gray-700 mt-2 whitespace-pre-wrap">
            {activity.description}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Created {new Date(activity.created_at).toLocaleString()}
        </p>
      </article>
    </div>
  );
}
