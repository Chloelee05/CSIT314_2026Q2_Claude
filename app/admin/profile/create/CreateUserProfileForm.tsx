'use client';

import { useActionState } from 'react';
import { createUserProfileAction, CreateUserProfileState } from './actions';

const ROLES = [
  { value: 'fund_raiser', label: 'Fund Raiser' },
  { value: 'donee', label: 'Donee' },
  { value: 'platform_management', label: 'Platform Management' },
  { value: 'admin', label: 'Admin' },
];

interface AccountOption {
  id: string;
  label: string;
}

interface CreateUserProfileFormProps {
  accounts: AccountOption[];
}

const initialState: CreateUserProfileState = { success: false, message: '' };

/**
 * BCE Boundary: CreateUserProfileBoundary — Show_Create_Form() + CreateUserProfile()
 *
 * Client-side form component for User Story #11.
 */
export default function CreateUserProfileForm({ accounts }: CreateUserProfileFormProps) {
  const [state, formAction, isPending] = useActionState(createUserProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            state.success
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1">
          User Account
        </label>
        <select
          id="accountId"
          name="accountId"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        >
          <option value="">Select an account…</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="accountPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Account Password{' '}
          <span className="text-gray-400 font-normal">(leave blank to keep existing)</span>
        </label>
        <input
          id="accountPassword"
          name="accountPassword"
          type="password"
          placeholder="Set account password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          id="dob"
          name="dob"
          type="date"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Enter address"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="Enter phone number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="role"
          name="role"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        >
          <option value="">Select a role…</option>
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
          {isPending ? 'Creating…' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}
