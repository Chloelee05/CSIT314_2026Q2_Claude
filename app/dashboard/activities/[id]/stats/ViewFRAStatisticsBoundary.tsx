/**
 * BCE Boundary: ViewFRAStatisticsBoundary (User Story #32)
 *
 * - clickViewStatistics() — user opens this page (navigation from activity details)
 * - displayViewCount(count) — render the total view count or error / retry
 */
export function ViewFRAStatisticsBoundary({
  activityId,
  activityTitle,
  success,
  viewCount,
  errorMessage,
}: {
  activityId: string;
  activityTitle: string;
  success: boolean;
  viewCount: number | null;
  errorMessage: string | null;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <a
        href={`/dashboard/activities/${activityId}`}
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← Back to activity
      </a>

      <h1 className="text-2xl font-bold text-gray-900 mt-4">Activity statistics</h1>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activityTitle}</p>

      {!success || errorMessage ? (
        <div className="mt-8 bg-white rounded-xl border border-red-200 p-6">
          <p className="text-red-800 text-sm">
            {errorMessage ?? 'Could not load view count. Please try again.'}
          </p>
          <a
            href={`/dashboard/activities/${activityId}/stats`}
            className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Retry
          </a>
        </div>
      ) : (
        <div
          className="mt-8 bg-white rounded-xl border border-gray-200 p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Total views
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tabular-nums">
            {viewCount ?? 0}{' '}
            {(viewCount ?? 0) === 1 ? 'view' : 'views'}
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Use this number to measure visibility of your fundraising activity.
          </p>
        </div>
      )}
    </div>
  );
}
