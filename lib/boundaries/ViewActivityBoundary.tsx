'use client';

import { useActionState } from 'react';
import {
  deleteActivityAction,
  type DeleteActivityState,
} from '@/app/dashboard/activities/actions';
import DeleteActivityBoundary from '@/lib/boundaries/DeleteActivityBoundary';
import { SearchActivityBoundary } from '@/lib/boundaries/SearchActivityBoundary';
import { StaggerList, StaggerItem, PageTransition } from '@/lib/components/motion';

type ActivityRow = {
  id: string;
  title: string;
  category: string;
  goal_amount: number;
  created_at: string;
};

const initialDeleteState: DeleteActivityState = {
  success: false,
  message: '',
};

/**
 * BCE Boundary: ViewActivityBoundary (User Story #19 — FR activity list)
 *
 * - navigateToActivities() — entry point rendered by the activities list page
 * - displayActivityDetails(activity: list) — render the activity list or flash empty state
 *
 * Wraps SearchActivityBoundary (#22) and uses DeleteActivityBoundary (#21) per row.
 *
 * Donee single-activity view (User Story #26) uses `DoneeViewActivityBoundary` instead —
 * same UML «ViewActivityBoundary» role with process_view / show_activity_details, different UI.
 */
export default function ViewActivityBoundary({
  activities,
  initialQuery = '',
  searchEmptyFlash = null,
}: {
  activities: ActivityRow[];
  initialQuery?: string;
  searchEmptyFlash?: string | null;
}) {
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteActivityAction,
    initialDeleteState,
  );

  function navigateToActivities() {
    return (
      <a
        href="/dashboard"
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← Back to dashboard
      </a>
    );
  }

  function displayActivityDetails(activityList: ActivityRow[]) {
    return (
      <SearchActivityBoundary initialQuery={initialQuery}>
        {deleteState.message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm border ${
              deleteState.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
            role="status"
          >
            {deleteState.message}
          </div>
        )}

        {searchEmptyFlash && (
          <div
            className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm"
            role="status"
          >
            {searchEmptyFlash}
          </div>
        )}

        {activityList.length === 0 && !searchEmptyFlash ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-700">
            <p>No fundraising activities found.</p>
            <a
              href="/dashboard/activities/create"
              className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Create your first activity
            </a>
          </div>
        ) : activityList.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            Try a different keyword or clear the search.
          </p>
        ) : (
          <StaggerList className="space-y-3">
            {activityList.map((a) => (
              <StaggerItem
                key={a.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h2 className="font-semibold text-gray-900">{a.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {a.category} · Goal ${Number(a.goal_amount).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`/dashboard/activities/${a.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50"
                  >
                    View details
                  </a>
                  <a
                    href={`/dashboard/activities/${a.id}/edit`}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
                  >
                    Edit
                  </a>
                  <DeleteActivityBoundary
                    activityId={a.id}
                    formAction={deleteFormAction}
                    isPending={isDeletePending}
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </SearchActivityBoundary>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {navigateToActivities()}
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            My fundraising activities
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Search, view, edit, or remove your campaigns.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/dashboard/activities/completed"
            className="inline-flex justify-center text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-lg"
          >
            Search completed
          </a>
          <a
            href="/dashboard/activities/create"
            className="inline-flex justify-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
          >
            Create activity
          </a>
        </div>
      </div>
      {displayActivityDetails(activities)}
    </div>
  );
}
