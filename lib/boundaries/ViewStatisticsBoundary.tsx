/**
 * BCE Boundary: ViewStatisticsBoundary (User Story #32)
 *
 * - viewStatistics()  — renders the view count statistics section
 * - displayShortlistCount() — (see ShortlistStatisticsBoundary for US#33)
 */
export function ViewStatisticsBoundary({
  activityId,
  activityTitle,
  viewSuccess,
  viewCount,
  viewErrorMessage,
}: {
  activityId: string;
  activityTitle: string;
  viewSuccess: boolean;
  viewCount: number | null;
  viewErrorMessage: string | null;
}) {
  const views = viewCount ?? 0;

  function viewStatistics() {
    return (
      <>
        <a
          href={`/dashboard/activities/${activityId}`}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to activity
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Activity statistics</h1>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activityTitle}</p>
      </>
    );
  }

  function displayShortlistCount() {
    if (!viewSuccess) {
      return (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            View count
          </p>
          <p className="text-red-800 text-sm mt-2">
            {viewErrorMessage ?? 'Could not load view count. Please try again.'}
          </p>
          <a
            href={`/dashboard/activities/${activityId}/stats`}
            className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Retry
          </a>
        </div>
      );
    }
    return (
      <div
        className="bg-white rounded-xl border border-gray-200 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-gray-500 uppercase tracking-wide">Total views</p>
        <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tabular-nums">
          {views} {views === 1 ? 'view' : 'views'}
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Use this number to measure visibility of your fundraising activity.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {viewStatistics()}
      <div className="mt-8">
        {displayShortlistCount()}
      </div>
    </div>
  );
}
