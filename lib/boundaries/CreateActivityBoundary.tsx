'use client';

import { useActionState } from 'react';
import {
  createActivityAction,
  type CreateActivityState,
} from './actions';

const initialState: CreateActivityState = {
  success: false,
  message: '',
};

/**
 * BCE Boundary: CreateActivityBoundary (User Story #18)
 *
 * - create_activity_form() — render the activity creation form
 * - Flashes success/failure message based on controller response
 */
export default function CreateActivityBoundary() {
  const [state, formAction, isPending] = useActionState(
    createActivityAction,
    initialState,
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <a
          href="/dashboard/activities"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to activities
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Create Fundraising Activity
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          As a Fund Raiser, create a new campaign to launch your fundraising
          activity.
        </p>
      </div>

      {/* displayResult — success (main flow step 5) */}
      {state.success && state.message && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          {state.message}
        </div>
      )}

      {/* displayResult — failure (ALT: validation fails, use case 4a) */}
      {!state.success && state.message && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {state.message}
        </div>
      )}

      {/* displayForm + submitDetails (sequence diagram) */}
      <form action={formAction} className="space-y-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
            placeholder="Activity title"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
            placeholder="Describe your campaign"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
          />
        </div>

        <div>
          <label
            htmlFor="goalAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Goal amount
          </label>
          <input
            id="goalAmount"
            name="goalAmount"
            type="number"
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            placeholder="e.g. Health, Education"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Creating…' : 'Create activity'}
        </button>
      </form>
    </div>
  );
}
