import { UserProfile } from '@/lib/entities/UserProfile';

/**
 * BCE Controller: UpdateUserProfileController
 */
export class UpdateUserProfileController {
  
  static async UpdatedUserProfile(
    UserProfile_id: string,
    NewUserName: string,
    NewPassword: string,
    NewDOB: string,
    NewAddress: string,
    NewPhoneNumber: string,
    User_Account_id: string
  ): Promise<boolean> {
    return UserProfile.UpdatedUserProfile(
      UserProfile_id,
      NewUserName,
      NewPassword,
      NewDOB,
      NewAddress,
      NewPhoneNumber,
      User_Account_id
    );
  }

  static async Get_Updated(UserProfile_id: string) {
    return UserProfile.Get_Updated(UserProfile_id);
  }
}