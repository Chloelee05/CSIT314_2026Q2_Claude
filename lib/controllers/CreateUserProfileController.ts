import { UserProfile } from '@/lib/entities/UserProfile';

/**
 * BCE Controller: CreateUserProfileController (User Story #11)
 *
 * Orchestrates creation of a user profile with personal details.
 */
export class CreateUserProfileController {
  /**
   * Create a user profile linked to an existing account.
   * Signature matches BCE diagram:
   * CreateUserProfile(UserProfile_id, Account_id, DOB, Address, PhoneNumber, Role): bool
   */
  static async CreateUserProfile(
    UserProfile_id: string,
    Account_id: string,
    DOB: string,
    Address: string,
    PhoneNumber: string,
  ): Promise<boolean> {
    if (!Account_id) {
      return false;
    }

    return UserProfile.CreateUserProfile(
      UserProfile_id,
      Account_id,
      DOB,
      Address,
      PhoneNumber,
    );
  }
}
