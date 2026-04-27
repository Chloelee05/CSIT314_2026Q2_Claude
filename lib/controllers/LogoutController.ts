import { UserAccount } from '@/lib/entities/UserAccount';
import { UserSession } from '@/lib/entities/UserSession';

/**
 * BCE Controller: LogoutController (User Story #50, #31)
 *
 * Handles the business logic for user logout.
 * - logout()            → US#50: delegates to UserAccount.clearSession()
 * - logout(sessionId)   → US#31: delegates to UserSession.invalidateSession()
 */
export class LogoutController {
  /**
   * US#50 — Admin/User logout.
   * Signature matches BCE diagram: logout(): boolean
   */
  static async logout(): Promise<boolean> {
    return await UserAccount.clearSession();
  }

  /**
   * US#31 — Donee logout.
   * Signature matches BCE diagram: logout(sessionId): boolean
   */
  static async logoutDonee(sessionId: string): Promise<boolean> {
    return await UserSession.invalidateSession(sessionId);
  }
}
