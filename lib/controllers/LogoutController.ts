import { UserAccount } from '@/lib/entities/UserAccount';

/**
 * BCE Controller: LogoutController
 *
 * - logout()            → US#24 (FR 등 `/dashboard`의 userLogoutAction), US#17/#50: clearSession()
 * - logout(sessionId)   → US#31 (Donee): invalidateSession(sessionId)
 */
export class LogoutController {
  /**
   * FR dashboard User Story #24, admin #17, generic #50 — session cookie teardown.
   * BCE: logout()
   */
  static async logout(): Promise<boolean>;
  /**
   * Donee dashboard User Story #31.
   * BCE: logout(sessionId)
   */
  static async logout(sessionId: string): Promise<boolean>;
  static async logout(sessionId?: string): Promise<boolean> {
    if (sessionId !== undefined) {
      return await UserAccount.invalidateSession(sessionId);
    }
    return await UserAccount.clearSession();
  }
}
