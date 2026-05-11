import { SessionData } from '@/lib/entities/SessionData';
import { UserData } from '@/lib/entities/UserData';
import { createSession } from '@/lib/auth';

/**
 * BCE Controller: AuthController (User Story #43, #44)
 * Handles Platform Manager authentication and session management.
 */
export class AuthController {
  /**
   * US#43 — Platform Manager login.
   * Signature matches BCE diagram: login(username, password)
   *
   * @returns [success, message]
   */
  static async login(
    username: string,
    password: string,
  ): Promise<[boolean, string]> {
    const [success, message, user] = await UserData.validateCredentials(
      username,
      password,
    );

    if (!success || !user) {
      return [false, message];
    }

    await createSession({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return [true, 'Successful Login.'];
  }

  /**
   * US#44 — Platform Manager logout.
   * Signature matches BCE diagram: logout(session_id): boolean
   */
  static async logout(sessionId: string): Promise<boolean> {
    return await SessionData.invalidateSession(sessionId);
  }
}
