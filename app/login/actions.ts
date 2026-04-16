'use server';

import { LoginController } from '@/lib/controllers/LoginController';
import { LogoutController } from '@/lib/controllers/LogoutController';
import { deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export interface LoginState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: process_login()
 *
 * Routes to the correct controller method based on login mode:
 * - Admin (#16): LoginController.Login(username, password, role)
 * - User  (#49): LoginController.authenticateUser(email, pw)
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const loginMode = formData.get('loginMode') as string;
  const password = formData.get('password') as string;

  if (!password) {
    return { success: false, message: 'All fields are required.' };
  }

  if (loginMode === 'admin') {
    // User Story #16: Admin login flow (username + role)
    const username = formData.get('username') as string;
    if (!username) {
      return { success: false, message: 'All fields are required.' };
    }

    const [success, message] = await LoginController.Login(
      username,
      password,
      'admin',
    );

    if (!success) {
      return { success: false, message };
    }

    // show_dashboard(): redirect to Admin Homepage
    redirect('/admin/dashboard');
  } else {
    // User Story #49: User login flow (email + password)
    const email = formData.get('email') as string;
    if (!email) {
      return { success: false, message: 'All fields are required.' };
    }

    const [success, message] = await LoginController.authenticateUser(
      email,
      password,
    );

    if (!success) {
      return { success: false, message };
    }

    // displayDashboard(): redirect to User dashboard
    redirect('/dashboard');
  }
}

/**
 * User Story #17 — Admin Logout (BCE: Boundary only, no Controller/Entity)
 *
 * LogoutBoundary sequence:
 *   Logout() → DisplayMessage(msg) → redirectToLoginPage()
 */
export async function adminLogoutAction(): Promise<void> {
  // Logout(): remove all session data
  await deleteSession();

  // DisplayMessage + redirectToLoginPage
  redirect(
    '/login?message=' +
      encodeURIComponent('You have been logout successfully'),
  );
}

/**
 * User Story #50 — User Logout (BCE: LogoutUI → LogoutController → UserAccount)
 *
 * Sequence:
 *   clickLogout() → LogoutController.logout() → UserAccount.clearSession()
 *   → displayLoginPage()
 *
 * ALT: session already expired → still redirects to login page
 */
export async function userLogoutAction(): Promise<void> {
  // LogoutUI → LogoutController: logout()
  // LogoutController → UserAccount: clearSession()
  await LogoutController.logout();

  // displayLoginPage(): redirect to login regardless of result
  redirect('/login');
}
