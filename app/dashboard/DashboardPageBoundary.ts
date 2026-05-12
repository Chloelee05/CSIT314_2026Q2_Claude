'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LogoutController } from '@/lib/controllers/LogoutController';

/**
 * <<Boundary>> DashboardPageBoundary — User Story #31 (Donee logout).
 *
 * clickLogout() → LogoutController.logout(sessionId) → UserSession.invalidateSession(sessionId)
 * → redirectToLoginPage()
 */
export async function clickLogout(): Promise<void> {
  const session = await getSession();
  const sessionId = session?.userId ?? '';

  await LogoutController.logout(sessionId);

  await redirectToLoginPage();
}

export async function redirectToLoginPage(): Promise<never> {
  redirect('/login');
}
