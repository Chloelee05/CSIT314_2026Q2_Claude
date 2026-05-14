'use server';

import { LogoutBoundary } from '@/lib/boundaries/LogoutBoundary';

/**
 * BCE Boundary action: US#44 — Platform Manager Logout
 *
 * Sequence: Logout() → DisplayMessage(msg) → redirectToLoginPage()
 * No controller or entity — all logic handled within LogoutBoundary.
 */
export async function pmLogoutAction(): Promise<void> {
  await LogoutBoundary.Logout();
}
