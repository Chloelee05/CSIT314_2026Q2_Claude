'use server';

import { LogoutController } from '@/lib/controllers/LogoutController';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * BCE Boundary action: US#31 — Donee Logout
 *
 * Sequence: clickLogout() → LogoutController.logout(sessionId)
 *           → UserSession.invalidateSession(sessionId) → displayLoginPage()
 */
export async function doneeLogoutAction(): Promise<void> {
  const session = await getSession();
  const sessionId = session?.userId ?? '';

  await LogoutController.logoutDonee(sessionId);

  redirect('/login');
}
