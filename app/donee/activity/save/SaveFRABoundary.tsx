'use client';

import { useActionState } from 'react';
import { saveFRAAction, type SaveFRAState } from './actions';

interface SaveFRABoundaryProps {
  fraId: string;
  activityTitle: string;
}

export default function SaveFRABoundary({ fraId, activityTitle }: SaveFRABoundaryProps) {
  const [state, formAction, isPending] = useActionState<SaveFRAState, FormData>(
    saveFRAAction,
    null,
  );

  return (
    <div className="mt-4">
      {/* showSaveResult() */}
      {state && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
            state.success
              ? 'bg-green-50 border border-green-200 text-green-800'
              : state.message === 'Already saved'
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      {/* displaySaveButton() */}
      {!state?.success && (
        <form action={formAction}>
          <input type="hidden" name="fraId" value={fraId} />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : `Save "${activityTitle}"`}
          </button>
        </form>
      )}
    </div>
  );
}
