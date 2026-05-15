'use client';

import { useActionState } from 'react';
import { suspendUserProfileAction, SuspendProfileState } from '@/app/admin/profile/suspend/actions';

interface Props {
  userprofile_id: string;
  currentStatus: string;
}

const initialState: SuspendProfileState = { success: null, message: '' };

/**
 * BCE Boundary: SuspendUserProfileBoundary (User Story #14)
 *
 * - SuspendUserProfile(userprofile_id: str, status: str) — form submission triggers
 *   SuspendUserProfileController.SuspendUserProfile(userprofile_id)
 */
export default function SuspendUserProfileBoundary({ userprofile_id, currentStatus }: Props) {
  const [state, formAction, isPending] = useActionState(suspendUserProfileAction, initialState);

  function SuspendUserProfile(userprofile_id: string, status: string) {
    if (status === 'suspended') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Suspended
        </span>
      );
    }
    return (
      <form action={formAction} className="inline-block">
        <input type="hidden" name="userprofile_id" value={userprofile_id} />
        {state.message && (
          <span className={`text-xs mr-2 ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </span>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="text-red-600 hover:text-red-900 text-sm font-medium transition disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'Suspending…' : 'Suspend'}
        </button>
      </form>
    );
  }

  return SuspendUserProfile(userprofile_id, currentStatus);
}
