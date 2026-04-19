'use client';

import { useActionState, useEffect } from 'react';
import { suspendUserProfileAction, SuspendProfileState } from './actions';

interface SuspendBoundaryProps {
  userprofile_id: string;
  currentStatus: string;
}

const initialState: SuspendProfileState = { success: null, message: '' };

/**
 * BCE Boundary: SuspendUserProfileBoundary
 */
export default function SuspendUserProfileBoundary({ userprofile_id, currentStatus }: SuspendBoundaryProps) {
  const [state, formAction, isPending] = useActionState(suspendUserProfileAction, initialState);

  // Trigger browser alert for the flash message as required by the sequence diagram feedback loop
  useEffect(() => {
    if (state.success === true) {
      alert(state.message); // "User Profile status has been updated."
    } else if (state.success === false) {
      alert(state.message);
    }
  }, [state]);

  // If already suspended, just show the status text
  if (currentStatus === 'suspended') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Suspended
      </span>
    );
  }

  // If active, show the Suspend form/button
  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="userprofile_id" value={userprofile_id} />
      <button 
        type="submit" 
        disabled={isPending}
        className="text-red-600 hover:text-red-900 text-sm font-medium transition disabled:opacity-50"
      >
        {isPending ? 'Suspending...' : 'Suspend'}
      </button>
    </form>
  );
}