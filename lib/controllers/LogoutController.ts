import { UserAccount } from '@/lib/entities/UserAccount';

/**
 * BCE Controller: LogoutController (User Story #50)
 *
 * Handles the business logic for user logout.
 * Delegates session destruction to the UserAccount entity.
 */
export class LogoutController {
  /**
   * Process a user logout request.
   * Signature matches BCE diagram: logout(): boolean
   *
   * @returns true if session was cleared, false if already expired
   */
  static async logout(): Promise<boolean> {
    return await UserAccount.clearSession();
  }
}
