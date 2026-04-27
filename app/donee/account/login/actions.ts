'use server';

import { LoginController } from '@/lib/controllers/LoginController';
import { redirect } from 'next/navigation';

export type LoginState = { error: string } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Please enter your username and password.' };
  }

  const [success, message] = await LoginController.authenticate(username, password);

  if (!success) {
    return { error: message };
  }

  redirect('/dashboard');
}
