'use client';

import Link from 'next/link';
import { process_search as doneeSearchSubmit } from '@/app/donee/activity/search/actions';

/**
 * BCE «Boundary» for User Story #25 (Donee search campaigns).
 *
 * UML class name on the diagram: `SearchActivityBoundary` — same stereotype as #22 but this
 * variant drives Donee UX (server action redirect → `?keyword=`), while #22 uses GET `q` on the FR dashboard.
 *
 * Class diagram operations:
 * - process_search() — capture keyword and submit via server action → `/donee/activity/search?keyword=…`
 * - show_results() — render slot supplied by the route (page runs SearchActivityController.searchActiveActivities)
 *
 * Controller / entity wiring (implementation detail vs simplified diagram labels):
 * - `SearchActivityController.searchActiveActivities(keyword)` → `FundraisingActivity.find_active_activities(keyword)`
 *   (global active campaigns). Diagram text sometimes says `SearchActivity` / `find_activities`; this codebase uses the
 *   dedicated Donee browsing APIs above for correct authorization scope.
 */
export default function DoneeSearchActivityBoundary({
  currentKeyword = '',
  children,
}: {
  currentKeyword?: string;
  children?: React.ReactNode;
}) {
  function process_search() {
    return (
      <form
        action={doneeSearchSubmit}
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-end"
        role="search"
        aria-label="Search fundraising campaigns"
      >
        <div className="flex-1 w-full">
          <label
            htmlFor="donee-search-keyword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Campaigns
          </label>
          <input
            id="donee-search-keyword"
            type="text"
            name="keyword"
            defaultValue={currentKeyword}
            placeholder="Enter campaign name..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition"
          >
            Search
          </button>
          {currentKeyword ? (
            <Link
              href="/donee/activity/search"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition inline-flex items-center"
            >
              Clear
            </Link>
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
