'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';

/**
 * BCE Boundary: LoginPageBoundary
 * displayLoginForm()     → renders the form below
 * redirectToDashboard()  → handled by server action redirect on success
 */
export default function DoneeLoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    null,
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            FundRaise <span className="text-indigo-600">Donee</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {state?.error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
              {state.error}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {isPending ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
