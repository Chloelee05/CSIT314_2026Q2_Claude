'use client';

import { useActionState, useRef } from 'react';
import {
  deleteActivityAction,
  type DeleteActivityState,
} from './actions';

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
 * BCE Boundary: ViewActivityUI (User Story #19)
 *
 * - displayActivityList(activities) — render the list (or empty state)
 * - navigateToActivities / selectActivity — links to detail route
 *
 * Delete flow (User Story #21) remains on the same page for convenience.
 */
export default function ViewActivityUI({
  activities,
}: {
  activities: ActivityRow[];
}) {
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteActivityAction,
    initialDeleteState,
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <a
            href="/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to dashboard
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            My fundraising activities
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View campaign details or remove an activity you no longer need.
          </p>
        </div>
        <a
          href="/dashboard/activities/create"
          className="inline-flex justify-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
        >
          Create activity
        </a>
      </div>

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

      {/* displayActivityList — ALT 2a: no activities */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-700">
          <p>No fundraising activities found.</p>
          <a
            href="/dashboard/activities/create"
            className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Create your first activity
          </a>
        </div>
      ) : (
        <ul className="space-y-3">
          {activities.map((a) => (
            <li
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
                <DeleteRowForm
                  activityId={a.id}
                  formAction={deleteFormAction}
                  isPending={isDeletePending}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DeleteRowForm({
  activityId,
  formAction,
  isPending,
}: {
  activityId: string;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="inline">
      <input type="hidden" name="activityId" value={activityId} />
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (
            !window.confirm(
              'Are you sure you want to remove this activity? This cannot be undone.',
            )
          ) {
            return;
          }
          formRef.current?.requestSubmit();
        }}
        className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? 'Removing…' : 'Remove'}
      </button>
    </form>
  );
}
