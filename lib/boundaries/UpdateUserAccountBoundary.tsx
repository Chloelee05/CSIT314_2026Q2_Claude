'use client';

import { useActionState } from 'react';
import { updateAccountAction, UpdateAccountState } from '@/app/admin/accounts/update/actions';

const ROLES = [
  { value: 'fund_raiser', label: 'Fund Raiser' },
  { value: 'donee', label: 'Donee' },
  { value: 'platform_management', label: 'Platform Management' },
  { value: 'admin', label: 'Admin' },
];

interface Props {
  userAccountId: string;
  currentUsername: string;
  currentRole: string;
}

const initialState: UpdateAccountState = { success: false, message: '' };

/**
 * BCE Boundary: UpdateUserAccountBoundary (User Story #8)
 *
 * - Show_Update_Form(UserAccount_id: int)   — renders the pre-populated update form
 * - UpdatedUserAccount(UserAccount_id: int) — form submission triggers UpdatedUserAccount on controller
 */
export default function UpdateUserAccountBoundary({
  userAccountId,
  currentUsername,
  currentRole,
}: Props) {
  const [state, formAction, isPending] = useActionState(updateAccountAction, initialState);

  function UpdatedUserAccount(userAccountId: string) {
    if (!state.message) return null;
    return (
      <div
        className={`rounded-lg px-4 py-3 text-sm font-medium ${
          state.success
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}
      >
        {state.message}
      </div>
    );
  }

  function Show_Update_Form(userAccountId: string) {
    return (
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="userAccountId" value={userAccountId} />

        <div>
          <label htmlFor="newUserName" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="newUserName"
            name="newUserName"
            type="text"
            defaultValue={currentUsername}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password{' '}
            <span className="text-gray-400 font-normal">(leave blank to keep existing)</span>
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="newRole"
            name="newRole"
            defaultValue={currentRole}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition cursor-pointer"
          >
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {UpdatedUserAccount(userAccountId)}
      {Show_Update_Form(userAccountId)}
    </div>
  );
}
