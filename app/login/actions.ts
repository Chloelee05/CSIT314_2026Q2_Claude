'use server';

import { LoginController } from '@/lib/controllers/LoginController';
import { LogoutBoundary } from '@/lib/boundaries/LogoutBoundary';
import { LogoutController } from '@/lib/controllers/LogoutController';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export interface LoginState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: process_login()
 *
 * Routes to the correct controller method based on login mode:
 * - Username mode (#16 / #23 / #30): LoginController.Login(username, password, role)
 *   → role selected from dropdown (admin, fund_raiser, donee, platform_management)
 * - Email mode (#49): LoginController.authenticateUser(email, pw)
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
    const username = formData.get('username') as string;
    const role = formData.get('role') as string;
    if (!username || !role) {
      return { success: false, message: 'All fields are required.' };
    }

    const [success, message] = await LoginController.Login(
      username,
      password,
      role,
    );

    if (!success) {
      return { success: false, message };
    }

    if (role === 'admin') {
      redirect('/admin/dashboard');
    }
    redirect('/dashboard');
  } else {
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
  await LogoutBoundary.Logout();
}

/**
 * User Story #24 — FR 등: `/dashboard`에서 Donee/PM이 아닌 역할이 쓰는 로그아웃 액션.
 * `LogoutController.logout()` 후 역할에 따라 리다이렉트.
 *
 * Donee 로그아웃(User Story #31)은 `DashboardPageBoundary.clickLogout` 경로를 사용.
 */
export async function userLogoutAction(): Promise<void> {
  const session = await getSession();
  const role = session?.role;

  await LogoutController.logout();

  if (role === 'donee') {
    redirect('/donee/account/login');
  }

  redirect(
    '/login?message=' +
      encodeURIComponent('Logged out successfully.'),
  );
}
