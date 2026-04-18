import { UserAccount } from '@/lib/entities/UserAccount';

/**
 * BCE Controller: SuspendUserAccountController (User Story #9)
 *
 * Orchestrates suspension of a user account.
 */
export class SuspendUserAccountController {
  /**
   * Suspend a user account by ID.
   * Signature matches BCE diagram: SuspendUserAccount(UserAccount_id: int): bool
   */
  static async SuspendUserAccount(UserAccount_id: string): Promise<boolean> {
    if (!UserAccount_id) {
      return false;
    }

    return UserAccount.SuspendUserAccount(UserAccount_id);
  }
}
