import { deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * BCE Boundary: LogoutBoundary (User Story #31)
 *
 * - Logout()              — clears session
 * - DisplayMessage(msg)   — surfaces the logout confirmation message
 * - redirectToLoginPage() — navigates back to /login
 */
export class LogoutBoundary {
  static async Logout(): Promise<void> {
    await deleteSession();
    LogoutBoundary.redirectToLoginPage();
  }

  static DisplayMessage(msg: string): string {
    return msg;
  }

  static redirectToLoginPage(): never {
    redirect(
      '/login?message=' +
        encodeURIComponent('Logged out successfully.'),
    );
  }
}
