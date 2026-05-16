'use server';

import { LogoutBoundary } from '@/lib/boundaries/LogoutBoundary';

/**
 * <<Boundary>> DashboardPageBoundary — User Story #31 (Donee logout).
 *
 * clickLogout() → LogoutBoundary.Logout() → LogoutBoundary.DisplayMessage(msg)
 *              → LogoutBoundary.redirectToLoginPage()
 * No controller — all logic handled within LogoutBoundary.
 */
export async function clickLogout(): Promise<void> {
  await LogoutBoundary.Logout();
}
