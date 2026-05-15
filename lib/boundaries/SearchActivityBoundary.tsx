'use client';

/**
 * BCE Boundary: SearchActivityBoundary (User Story #22)
 *
 * Class diagram:
 * - process_search() — GET form to /dashboard/activities?q=… (boundary input)
 * - show_results() — renders child content (list / empty states) from parent data
 *
 * Flow: SearchActivityController.SearchActivity(keyword) runs on server; this boundary
 * only handles input + presentation region for results.
 *
 * User Story #34: optional `formAction` targets `/dashboard/activities/completed`.
 *
 * Donee browse flow (User Story #25) uses `DoneeSearchActivityBoundary` in this folder instead —
 * same UML «SearchActivityBoundary» role with `process_search` / `show_results`, different transport.
 */
export function SearchActivityBoundary({
  initialQuery,
  children,
  formAction = '/dashboard/activities',
  searchAriaLabel = 'Search fundraising activities',
  searchPlaceholder = 'Search by title, description, or category…',
}: {
  initialQuery: string;
  children: React.ReactNode;
  formAction?: string;
  searchAriaLabel?: string;
  searchPlaceholder?: string;
}) {
  const clearHref = formAction;

  function process_search() {
    return (
      <form
        method="get"
        action={formAction}
        className="mb-6 flex flex-col sm:flex-row gap-2 sm:items-center"
        role="search"
        aria-label={searchAriaLabel}
      >
        <input
          type="search"
          name="q"
          defaultValue={initialQuery}
          placeholder={searchPlaceholder}
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
              href={clearHref}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 inline-flex items-center"
            >
              Clear
            </a>
          ) : null}
        </div>
      </form>
    );
  }

  function show_results() {
    return <>{children}</>;
  }

  return (
    <div>
      {process_search()}
      {show_results()}
    </div>
  );
}
