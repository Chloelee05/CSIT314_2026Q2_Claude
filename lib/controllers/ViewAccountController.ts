import { UserAccount } from '@/lib/entities/UserAccount';

/**
 * BCE Controller: ViewAccountController (User Story #7)
 *
 * Handles the business logic for viewing user account information.
 * Routes to getAll() or getById() on the UserAccount entity
 * depending on whether a userId is provided.
 */
export class ViewAccountController {
  /**
   * Retrieve account details.
   * Signature matches BCE diagram: getAccountDetails(userId: String): UserAccount
   *
   * - userId is null → delegates to UserAccount.getAll(), returns list
   * - userId is provided → delegates to UserAccount.getById(userId), returns single account
   */
  static async getAccountDetails(
    userId: string | null,
  ): Promise<UserAccount[] | UserAccount | null> {
    if (!userId) {
      return await UserAccount.getAll();
    }
    return await UserAccount.getById(userId);
  }
}
