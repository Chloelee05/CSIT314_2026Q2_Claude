'use client';

/**
 * BCE Boundary: SearchActivityBoundary (User Story #22)
 *
 * - process_search() — GET form submit to /dashboard/activities?q=…
 * - show_results() — parent passes list + messages as children
 */
export function SearchActivityBoundary({
  initialQuery,
  children,
}: {
  initialQuery: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <form
        method="get"
        action="/dashboard/activities"
        className="mb-6 flex flex-col sm:flex-row gap-2 sm:items-center"
        role="search"
        aria-label="Search fundraising activities"
      >
        <input
          type="search"
          name="q"
          defaultValue={initialQuery}
          placeholder="Search by title, description, or category…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
          >
            Search
          </button>
          {initialQuery ? (
            <a
              href="/dashboard/activities"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 inline-flex items-center"
            >
              Clear
            </a>
          ) : null}
        </div>
      </form>
      {children}
    </div>
  );
}
