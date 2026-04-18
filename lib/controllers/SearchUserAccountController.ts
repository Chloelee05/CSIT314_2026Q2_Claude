import { UserAccount } from '@/lib/entities/UserAccount';

/**
 * BCE Controller: SearchUserAccountController (User Story #10)
 *
 * Orchestrates user account search by delegating to the UserAccount entity.
 */
export class SearchUserAccountController {
  /**
   * Search for user accounts matching the given keyword.
   * Signature matches BCE diagram: SearchUserAccount(Keyword: str, search_by: str = "UserName"): list
   */
  static async SearchUserAccount(
    Keyword: string,
    search_by: string = 'UserName',
  ): Promise<UserAccount[]> {
    return UserAccount.SearchUserAccount(Keyword, search_by);
  }
}
