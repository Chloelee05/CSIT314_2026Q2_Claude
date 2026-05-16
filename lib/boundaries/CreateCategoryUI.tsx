'use client';

import { useActionState } from 'react';
import {
  createCategoryAction,
  type CreateCategoryState,
} from '@/app/pr/FRA/createCategories/actions';

const initialState: CreateCategoryState = {
  success: false,
  message: '',
};

/**
 * BCE Boundary: CreateCategoryUI (User Story #38)
 *
 * - submitCategory(categoryName) — form submission to boundary action
 * - displayResult(message) — shows success or error (sequence diagram steps 6 & 7)
 */
export default function CreateCategoryUI() {
  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    initialState,
  );

  function displayResult() {
    if (state.success && state.message) {
      return (
        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          {state.message}
        </div>
      );
    }
    if (!state.success && state.message) {
      return (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {state.message}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <a
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to dashboard
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Create FRA Category
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new category to organise fundraising campaigns.
        </p>
      </div>

      {displayResult()}

      <form
        action={formAction}
        className="space-y-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div>
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category Name
          </label>
          <input
            id="categoryName"
            name="categoryName"
            type="text"
            required
            placeholder="e.g. Health, Education, Environment"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Creating…' : 'Create Category'}
        </button>
      </form>
    </div>
  );
}
