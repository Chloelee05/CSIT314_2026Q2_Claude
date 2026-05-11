'use server';

import { AuthController } from '@/lib/controllers/AuthController';
import { redirect } from 'next/navigation';

export interface LoginState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: US#43 — Platform Manager Login
 *
 * Sequence: enter credentials & click Log In
 *   → AuthController.login(username, password)
 *   → UserData.validateCredentials(username, password)
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

  const [success, message] = await AuthController.login(username, password);

  if (!success) {
    return { success: false, message };
  }

  redirect('/dashboard');
}
