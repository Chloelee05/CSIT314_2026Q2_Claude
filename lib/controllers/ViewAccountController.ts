import { UserAccount } from '@/lib/entities/UserAccount';

/**
 * BCE Controller: ViewAccountController (User Story #7)
 *
 * Handles the business logic for viewing user account information.
 * Delegates to UserAccount entity to fetch all accounts.
 */
export class ViewAccountController {
  /**
   * Retrieve all user account details.
   * Signature matches BCE diagram: getAccountDetails(): tuple
   *
   * @returns [success, message, accounts]
   */
  static async getAccountDetails(): Promise<[boolean, string, UserAccount[]]> {
    return UserAccount.fetchAccountDetails();
  }
}
