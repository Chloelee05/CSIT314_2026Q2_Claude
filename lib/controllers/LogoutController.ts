import { UserAccount } from '@/lib/entities/UserAccount';
import { UserSession } from '@/lib/entities/UserSession';

/**
 * BCE Controller: LogoutController (User Story #50, #31)
 *
 * - logout()            → US#50: delegates to UserAccount.clearSession()
 * - logout(sessionId)   → US#31: delegates to UserSession.invalidateSession()
 */
export class LogoutController {
  /**
   * US#50 — Admin/User logout.
   * BCE: logout()
   */
  static async logout(): Promise<boolean>;
  /**
   * US#31 — Donee logout.
   * BCE: logout(sessionId)
   */
  static async logout(sessionId: string): Promise<boolean>;
  static async logout(sessionId?: string): Promise<boolean> {
    if (sessionId !== undefined) {
      return await UserSession.invalidateSession(sessionId);
    }
    return await UserAccount.clearSession();
  }
}
