'use client';

import { useActionState } from 'react';
import { pmLoginAction, LoginState } from '@/app/pr/account/login/actions';

const initialState: LoginState = { success: false, message: '' };

/**
 * BCE Boundary: LoginPageBoundary (User Story #43)
 *
 * - displayLoginForm()  — username + password form
 * - showDashboard()     — handled by server redirect on success
 */
export default function LoginPageBoundary({
  logoutMessage,
}: {
  logoutMessage?: string;
}) {
  const [state, formAction, isPending] = useActionState(pmLoginAction, initialState);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">FundRaise</h1>
          <p className="text-sm text-gray-500 mt-1">Platform Management Portal</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Sign In</h2>

          {/* Logout success message */}
          {logoutMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
              {logoutMessage}
            </div>
          )}

          {/* Exception flow 4a — invalid credentials */}
          {state.message && !state.success && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {state.message}
            </div>
          )}

          {/* displayLoginForm() */}
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Enter your username"
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
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition"
            >
              {isPending ? 'Signing in…' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
