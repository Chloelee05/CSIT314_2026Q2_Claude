'use server';

import { LoginController } from '@/lib/controllers/LoginController';
import { redirect } from 'next/navigation';

export interface LoginState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: US#43 — Platform Manager Login
 *
 * Sequence: enter credentials & click Log In
 *   → LoginController.Login(username, password, role)
 *   → UserAccount.verify_credentials(username, password, role)
 *   → grant access → showDashboard()
 */
export async function pmLoginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, message: 'All fields are required.' };
  }

  const [success, message] = await LoginController.Login(username, password, 'platform_management');

  if (!success) {
    return { success: false, message };
  }

  redirect('/dashboard');
}
