import { UserProfile } from '@/lib/entities/UserProfile';

/**
 * BCE Controller: SearchUserProfileController
 */
export class SearchUserProfileController {
  
  static async SearchUserProfile(Keyword: string, search_by: string = "FullName"): Promise<any[]> {
    // Passes the request down to the Entity layer
    return UserProfile.SearchUserProfile(Keyword, search_by);
  }

}