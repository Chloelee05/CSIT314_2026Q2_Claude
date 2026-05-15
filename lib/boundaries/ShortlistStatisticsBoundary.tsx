/**
 * BCE Boundary: ShortlistStatisticsBoundary (User Story #33)
 *
 * - viewStatistics()        — renders the shortlist statistics section
 * - displayShortlistCount() — surfaces the shortlist count metric
 */
function shortlistLabel(n: number): string {
  if (n === 0) return '0 shortlists';
  if (n === 1) return '1 shortlist';
  return `${n} shortlists`;
}

export function ShortlistStatisticsBoundary({
  activityId,
  shortlistSuccess,
  shortlistCount,
  shortlistErrorMessage,
}: {
  activityId: string;
  shortlistSuccess: boolean;
  shortlistCount: number | null;
  shortlistErrorMessage: string | null;
}) {
  const shortlists = shortlistCount ?? 0;

  function viewStatistics() {
    return (
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Shortlist interest</h2>
        <p className="text-sm text-gray-500 mt-1">
          Measure how many Donees shortlisted this fundraising activity.
        </p>
      </div>
    );
  }

  function displayShortlistCount() {
    if (!shortlistSuccess) {
      return (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Shortlist count
          </p>
          <p className="text-red-800 text-sm mt-2">
            {shortlistErrorMessage ?? 'Could not load shortlist count. Please try again.'}
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
        <p className="text-sm text-gray-500 uppercase tracking-wide">Shortlist count</p>
        <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
          {shortlistLabel(shortlists)}
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Number of Donees who saved this activity as a favorite.
        </p>
      </div>
    );
  }

  return (
    <>
      {viewStatistics()}
      {displayShortlistCount()}
    </>
  );
}
