'use client';

import { useActionState } from 'react';
import { createAccountAction, type CreateAccountState } from '@/app/admin/accounts/create/actions';
import Link from 'next/link';

const initialState: CreateAccountState = {
  success: false,
  message: '',
};

/**
 * BCE Boundary: RegistrationUI (User Story #6)
 *
 * - navigateToRegister()        — user navigates to this page
 * - displayRegistrationForm()   — renders the account creation form
 * - submitDetails(email, pw)    — form submission triggers createAccount(email, pw)
 * - displayResult(msg: String)  — shows "Account created" or "Email already exists"
 */
export default function RegistrationUI() {
  const [state, formAction, isPending] = useActionState(
    createAccountAction,
    initialState,
  );

  function navigateToRegister() {
    // Admin navigates to this page via Next.js routing
    return null;
  }

  function displayResult(msg: string) {
    if (!msg) return null;
    return state.success ? (
      <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
        {msg}
      </div>
    ) : (
      <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
        {msg}
      </div>
    );
  }

  function submitDetails(_email: string, _password: string) {
    // Form data forwarded to createAccountAction (CreateAccountController) on submit
    return null;
  }

  function displayRegistrationForm() {
    return (
      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Enter full name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter email address"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            <option value="fund_raiser">Fund Raiser</option>
            <option value="donee">Donee</option>
            <option value="platform_management">Platform Management</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {isPending ? 'Creating...' : 'Create Account'}
          </button>
          <Link
            href="/admin/dashboard"
            className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Create User Account
        </h2>
        {navigateToRegister()}
        {submitDetails('', '')}
        {displayResult(state.message)}
        {displayRegistrationForm()}
      </div>
    </div>
  );
}
