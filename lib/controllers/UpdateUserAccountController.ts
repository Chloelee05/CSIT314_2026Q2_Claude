import { UserAccount } from '@/lib/entities/UserAccount';

/**
 * BCE Controller: UpdateUserAccountController (User Story #8)
 *
 * Orchestrates validation and delegates to the UserAccount entity
 * to update an existing user account.
 */
export class UpdateUserAccountController {
  /**
   * Update a user account with new values.
   * Signature matches BCE diagram: UpdatedUserAccount(UserAccount_id, NewUserName, NewPassword, NewRole, User_Profile_id): bool
   */
  static async UpdatedUserAccount(
    UserAccount_id: string,
    NewUserName: string,
    NewPassword: string,
    NewRole: string,
    User_Profile_id: string,
  ): Promise<boolean> {
    if (!NewUserName.trim() || !NewRole.trim()) {
      return false;
    }

    return UserAccount.UpdatedUserAccount(
      UserAccount_id,
      NewUserName.trim(),
      NewPassword,
      NewRole.trim(),
      User_Profile_id,
    );
  }

  /**
   * Retrieve the updated user account record.
   * Signature matches BCE diagram: Get_Updated(userAccount_id): UserAccount
   */
  static async Get_Updated(userAccount_id: string): Promise<UserAccount | null> {
    return UserAccount.Get_Updated(userAccount_id);
  }
}
