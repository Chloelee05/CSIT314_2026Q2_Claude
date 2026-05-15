import { deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * BCE Boundary: LogoutBoundary (User Story #24, #44)
 *
 * US#24 — Fund Raiser logout: process_logout() → show_login_page()
 * US#44 — Platform Manager logout: Logout() → DisplayMessage(msg) → redirectToLoginPage()
 *
 * Exception: If the session is already expired, the user is still sent
 * to the login page (deleteSession is a no-op when no cookie).
 */
export class LogoutBoundary {
  // ----------------------------------------------------------
  // User Story #24 — Fund Raiser Logout
  // ----------------------------------------------------------

  static async process_logout(): Promise<void> {
    await deleteSession();
    LogoutBoundary.show_login_page();
  }

  static show_login_page(): never {
    redirect(
      '/login?message=' +
        encodeURIComponent('Logged out successfully.'),
    );
  }

  // ----------------------------------------------------------
  // User Story #44 — Platform Manager Logout
  // Sequence: Logout() → DisplayMessage(msg) → redirectToLoginPage()
  // ----------------------------------------------------------

  static async Logout(): Promise<void> {
    await deleteSession();
    LogoutBoundary.DisplayMessage('You have been logged out successfully.');
  }

  static DisplayMessage(msg: string): never {
    LogoutBoundary.redirectToLoginPage(msg);
  }

  static redirectToLoginPage(msg?: string): never {
    redirect(
      '/login' + (msg ? '?message=' + encodeURIComponent(msg) : ''),
    );
  }
}
