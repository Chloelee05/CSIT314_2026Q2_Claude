'use client';

import { useActionState } from 'react';
import { updateUserProfileAction, UpdateProfileState } from './actions';

interface UpdateUserProfileFormProps {
  userAccountId: string;
  userProfileId: string;
  currentUsername: string;
  currentDob: string;
  currentAddress: string;
  currentPhone: string;
}

const initialState: UpdateProfileState = { success: null, message: '' };

export default function UpdateUserProfileForm({
  userAccountId,
  userProfileId,
  currentUsername,
  currentDob,
  currentAddress,
  currentPhone,
}: UpdateUserProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateUserProfileAction, initialState);

  return (
    <form action={formAction} className="bg-white shadow-sm rounded-xl border border-gray-200 p-8 space-y-6">
      <input type="hidden" name="User_Account_id" value={userAccountId} />
      <input type="hidden" name="UserProfile_id" value={userProfileId} />

      {/* Flash Messages */}
      {state.success === true && (
        <div className="rounded-lg px-4 py-3 text-sm font-medium bg-green-50 text-green-700 border border-green-200">
          {state.message}
        </div>
      )}
      {state.success === false && (
        <div className="rounded-lg px-4 py-3 text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          name="NewUserName"
          type="text"
          defaultValue={currentUsername}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password <span className="text-gray-400 font-normal">(leave blank to keep existing)</span>
        </label>
        <input
          name="NewPassword"
          type="password"
          placeholder="Enter new password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      <hr className="border-gray-200" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input
          name="NewDOB"
          type="date"
          defaultValue={currentDob}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input
          name="NewAddress"
          type="text"
          defaultValue={currentAddress}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          name="NewPhoneNumber"
          type="text"
          defaultValue={currentPhone}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
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