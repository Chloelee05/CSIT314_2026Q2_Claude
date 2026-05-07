import { SessionData } from '@/lib/entities/SessionData';

/**
 * BCE Controller: AuthController (User Story #44)
 * Handles Platform Manager logout.
 */
export class AuthController {
  /**
   * US#44 — Platform Manager logout.
   * Signature matches BCE diagram: logout(session_id): boolean
   */
  static async logout(sessionId: string): Promise<boolean> {
    return await SessionData.invalidateSession(sessionId);
  }
}
