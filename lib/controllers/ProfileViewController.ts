import { UserProfile } from '@/lib/entities/UserProfile';

/**
 * BCE Controller: ProfileViewController (User Story #12)
 * Orchestrates the retrieval of user profile credentials.
 */
export class ProfileViewController {
  static async getProfileDetails(userId: string) {
    try {
      const profile = await UserProfile.fetchProfile(userId);
      
      // Exception Flow (2a): System fails to retrieve
      if (!profile) {
        return { error: "Profile could not be loaded or no longer exists" };
      }
      
      // Regular Flow
      return { profile };
    } catch (error) {
      return { error: "An unexpected system error occurred" };
    }
  }

  /**
   * Orchestrates the retrieval of the profile list.
   */
  static async getProfileList() {
    try {
      const profiles = await UserProfile.fetchAllProfiles();
      return profiles;
    } catch (error) {
      return [];
    }
  }
}

