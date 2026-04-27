/**
 * BCE Boundary: ViewFRAStatisticsBoundary (User Story #32, #33)
 *
 * - clickViewStatistics() — user opens this page (link from activity details)
 * - displayViewCount(count) / displayShortlistCount(count)
 */
type StatErrorProps = { activityId: string; message: string; label: string };

function StatErrorBlock({ activityId, message, label }: StatErrorProps) {
  return (
    <div className="bg-white rounded-xl border border-red-200 p-6 h-full">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-red-800 text-sm mt-2">{message}</p>
      <a
        href={`/dashboard/activities/${activityId}/stats`}
        className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        Retry
      </a>
    </div>
  );
}

function shortlistLabel(n: number): string {
  if (n === 0) return '0 shortlists';
  if (n === 1) return '1 shortlist';
  return `${n} shortlists`;
}

export function ViewFRAStatisticsBoundary({
  activityId,
  activityTitle,
  viewSuccess,
  viewCount,
  viewErrorMessage,
  shortlistSuccess,
  shortlistCount,
  shortlistErrorMessage,
}: {
  activityId: string;
  activityTitle: string;
  viewSuccess: boolean;
  viewCount: number | null;
  viewErrorMessage: string | null;
  shortlistSuccess: boolean;
  shortlistCount: number | null;
  shortlistErrorMessage: string | null;
}) {
  const views = viewCount ?? 0;
  const shortlists = shortlistCount ?? 0;

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

      <div className="mt-8 space-y-6">
        {!viewSuccess ? (
          <StatErrorBlock
            activityId={activityId}
            label="View count"
            message={viewErrorMessage ?? 'Could not load view count. Please try again.'}
          />
        ) : (
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
        )}

        {!shortlistSuccess ? (
          <StatErrorBlock
            activityId={activityId}
            label="Shortlist count"
            message={
              shortlistErrorMessage ??
              'Could not load shortlist count. Please try again.'
            }
          />
        ) : (
          <div
            className="bg-white rounded-xl border border-gray-200 p-8 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-gray-500 uppercase tracking-wide">Shortlist count</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              {shortlistLabel(shortlists)}
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Number of Donees who saved this activity as a favorite.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
