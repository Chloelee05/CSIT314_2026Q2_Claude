'use client';

import { useActionState } from 'react';
import {
  deleteCategoryAction,
  type DeleteCategoryState,
} from '@/app/pr/FRA/deleteCategories/actions';

interface Props {
  categoryId: string;
  categoryName: string;
  isInUse: boolean;
}

const initialState: DeleteCategoryState = {
  success: false,
  message: '',
};

/**
 * BCE Boundary: ManageCategoriesBoundary (User Story #41)
 *
 * - displayCategories() — shows the category details and confirmation prompt
 * - showDeleteResult() — displays success or error after the action (sequence diagram)
 *
 * Exception flow 5a/5b: when isInUse is true, shows the block message and
 * disables the Confirm Delete button.
 */
export default function ManageCategoriesBoundary({
  categoryId,
  categoryName,
  isInUse,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    deleteCategoryAction,
    initialState,
  );

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <a
          href="/pr/FRA/viewCategories"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to categories
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Delete FRA Category
        </h1>
      </div>

      {/* displayCategories() — confirmation card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <p className="text-sm text-gray-600">
          You are about to delete the category:
        </p>
        <p className="text-lg font-semibold text-gray-900 mt-2">{categoryName}</p>
      </div>

      {/* Exception flow 5a — category in use (block message, button disabled) */}
      {isInUse && (
        <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Cannot delete category. It is currently in use by active FRAs.
        </div>
      )}

      {/* showDeleteResult() — failure message from server action */}
      {!state.success && state.message && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {state.message}
        </div>
      )}

      {/* Confirmation form — Confirm Delete button disabled when category is in use (5b) */}
      <form action={formAction} className="flex gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />
        <a
          href="/pr/FRA/viewCategories"
          className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isPending || isInUse}
          className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Deleting…' : 'Confirm Delete'}
        </button>
      </form>
    </div>
  );
}
