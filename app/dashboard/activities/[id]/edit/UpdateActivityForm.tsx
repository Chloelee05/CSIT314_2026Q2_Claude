'use client';

import { useActionState } from 'react';
import {
  updateActivityAction,
  type UpdateActivityState,
} from './actions';

const initialState: UpdateActivityState = {
  success: false,
  message: '',
};

export type EditActivityInitial = {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  end_date: string | null;
};

/**
 * BCE Boundary: UpdateActivityBoundary (User Story #20)
 *
 * - show_edit_form() — pre-filled fields
 * - process_update() — submit via server action
 * - flash success / flash failure — from action state
 */
export default function UpdateActivityForm({
  initial,
}: {
  initial: EditActivityInitial;
}) {
  const [state, formAction, isPending] = useActionState(
    updateActivityAction,
    initialState,
  );

  const endDateInputValue =
    initial.end_date && initial.end_date.length >= 10
      ? initial.end_date.slice(0, 10)
      : initial.end_date ?? '';

  return (
    <div className="max-w-2xl mx-auto">
      <a
        href={`/dashboard/activities/${initial.id}`}
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← Back to activity
      </a>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">Edit activity</h1>
      <p className="text-sm text-gray-500 mt-1">
        Update campaign information, then save your changes.
      </p>

      {state.message && (
        <div
          className={`mt-6 p-3 rounded-lg text-sm border ${
            state.success
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
          role="status"
        >
          {state.message}
        </div>
      )}

      <form
        action={formAction}
        className="mt-6 space-y-5 bg-white rounded-xl border border-gray-200 p-6"
      >
        <input type="hidden" name="activityId" value={initial.id} />

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initial.title}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={initial.description}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 resize-y"
          />
        </div>

        <div>
          <label
            htmlFor="goal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Goal amount
          </label>
          <input
            id="goal"
            name="goal"
            type="number"
            required
            min="0.01"
            step="0.01"
            defaultValue={initial.goal_amount}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End date (optional)
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={endDateInputValue}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
