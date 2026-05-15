'use client';

import { useRef } from 'react';

/**
 * BCE Boundary: DeleteActivityBoundary (User Story #21)
 *
 * Class diagram:
 * - process_delete() — confirms intent and submits hidden activityId to server action
 *   → DeleteActivityController.DeleteActivity(activity_id) → FundraisingActivity.remove_activity(activity_id)
 *
 * Parent owns useActionState(deleteActivityAction) so one hook drives all row deletes on the list page.
 */
export default function DeleteActivityBoundary({
  activityId,
  formAction,
  isPending,
}: {
  activityId: string;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  function process_delete() {
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

  return process_delete();
}
