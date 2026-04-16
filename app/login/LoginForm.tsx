'use client';

import { useState, useActionState } from 'react';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {
  success: false,
  message: '',
};

interface LoginFormProps {
  logoutMessage?: string;
}

/**
 * BCE Boundary: LoginBoundary (#16) / LoginUI (#49)
 *
 * Admin mode (#16):
 *   - process_login() via LoginController.Login(username, password, role)
 *   - show_dashboard() → redirect to /admin/dashboard
 *
 * User mode (#49):
 *   - submitCredentials(email, password) via LoginController.authenticateUser(email, pw)
 *   - displayDashboard() → redirect to /dashboard
 *   - displayError(msg) → error banner
 */
export default function LoginForm({ logoutMessage }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">FundRaise</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Mode tabs: Admin (#16) / User (#49) */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition cursor-pointer ${
                isAdmin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition cursor-pointer ${
                !isAdmin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              User
            </button>
          </div>

          {/* DisplayMessage: logout success notification (#17 / #50) */}
          {logoutMessage && (
            <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {logoutMessage}
            </div>
          )}

          {/* displayError: login error notification */}
          {state.message && !state.success && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {state.message}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            {/* Hidden field to indicate login mode */}
            <input
              type="hidden"
              name="loginMode"
              value={isAdmin ? 'admin' : 'user'}
            />

            {isAdmin ? (
              /* #16 Admin: Username field */
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
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            ) : (
              /* #49 User: Email field */
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
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            )}

            {/* Password field (shared) */}
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
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isPending ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
