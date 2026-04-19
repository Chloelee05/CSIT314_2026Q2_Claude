import { UserProfile } from '@/lib/entities/UserProfile';

/**
 * BCE Controller: SuspendUserProfileController
 */
export class SuspendUserProfileController {
  
  static async SuspendUserProfile(userprofile_id: string): Promise<boolean> {
    // Passes the request down to the Entity layer
    return UserProfile.SuspendUserProfile(userprofile_id);
  }

}