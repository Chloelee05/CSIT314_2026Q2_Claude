'use client';

import { useActionState } from 'react';
import {
  updateCategoryAction,
  type UpdateCategoryState,
} from '@/app/pr/FRA/updateCategories/actions';

interface Props {
  categoryId: string;
  currentName: string;
}

const initialState: UpdateCategoryState = {
  success: false,
  message: '',
};

/**
 * BCE Boundary: UpdateCategoryUI (User Story #40)
 *
 * - UpdateCategory()              — entry point; routing handled by Next.js
 * - displayResult(message: String) — shows "Category updated successfully." or
 *                                    "Category name already exists.." (alt flow)
 */
export default function UpdateCategoryUI({ categoryId, currentName }: Props) {
  const [state, formAction, isPending] = useActionState(
    updateCategoryAction,
    initialState,
  );

  function UpdateCategory() {
    return null;
  }

  function displayResult(message: string) {
    if (!message) return null;
    return state.success ? (
      <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
        {message}
      </div>
    ) : (
      <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
        {message}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {UpdateCategory()}
      <div className="mb-6">
        <a
          href="/pr/FRA/viewCategories"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to categories
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Update FRA Category
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Modify the category name below.
        </p>
      </div>

      {displayResult(state.message)}

      <form
        action={formAction}
        className="space-y-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <input type="hidden" name="categoryId" value={categoryId} />

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
            defaultValue={currentName}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Saving…' : 'Update Category'}
        </button>
      </form>
    </div>
  );
}
