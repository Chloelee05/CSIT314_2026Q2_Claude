import { deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * BCE Boundary: LogoutBoundary (User Story #24)
 *
 * Fund Raiser (FR) logout: terminate session and return to the login page.
 * Sequence diagram: process_logout() → show_login_page()
 *
 * Exception 2a: If the session is already expired, the user is still sent
 * to the login page (deleteSession is a no-op when no cookie).
 */
export class LogoutBoundary {
  /**
   * Terminate the active session and clear session-related data (HTTP-only cookie).
   */
  static async process_logout(): Promise<void> {
    await deleteSession();
    LogoutBoundary.show_login_page();
  }

  /**
   * Navigate the user to the login page with a success notification (use case step 5).
   */
  static show_login_page(): never {
    redirect(
      '/login?message=' +
        encodeURIComponent('Logged out successfully.'),
    );
  }
}
