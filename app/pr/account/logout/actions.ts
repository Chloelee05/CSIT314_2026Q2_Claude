'use server';

import { AuthController } from '@/lib/controllers/AuthController';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * BCE Boundary action: US#44 — Platform Manager Logout
 *
 * Sequence: clickLogOut() → AuthController.logout(session_id)
 *           → SessionData.invalidateSession(session_id) → redirect to login & show message
 */
export async function pmLogoutAction(): Promise<void> {
  const session = await getSession();
  const sessionId = session?.userId ?? '';

  await AuthController.logout(sessionId);

  redirect(
    '/login?message=' +
      encodeURIComponent('You have been logged out successfully.'),
  );
}
