import { UpdateUserProfileController } from '@/lib/controllers/UpdateUserProfileController';
import { UserProfile } from '@/lib/entities/UserProfile';

jest.mock('@/lib/entities/UserProfile');

describe('UpdateUserProfileController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // User Story #13 — Admin Updates User Profile
  // ============================================================
  describe('User Story #13: UpdatedUserProfile', () => {
    const validArgs = ['profile-1', 'newusername', 'newpassword', '1995-05-15', '456 New Ave', '98765432', 'account-1'] as const;

    it('should return true when entity successfully updates the profile', async () => {
      (UserProfile.UpdatedUserProfile as jest.Mock).mockResolvedValue(true);

      const result = await UpdateUserProfileController.UpdatedUserProfile(...validArgs);

      expect(result).toBe(true);
      expect(UserProfile.UpdatedUserProfile).toHaveBeenCalledWith(...validArgs);
    });

    it('should return false when entity fails to update the profile', async () => {
      (UserProfile.UpdatedUserProfile as jest.Mock).mockResolvedValue(false);

      const result = await UpdateUserProfileController.UpdatedUserProfile(...validArgs);

      expect(result).toBe(false);
      expect(UserProfile.UpdatedUserProfile).toHaveBeenCalledWith(...validArgs);
    });
  });

  describe('User Story #13: Get_Updated', () => {
    const mockRecord = {
      id: 'account-1',
      username: 'newusername',
      user_profile_details: { id: 'profile-1', dob: '1995-05-15', address: '456 New Ave', phone_number: '98765432' },
    };

    it('should return the updated profile record when entity finds it', async () => {
      (UserProfile.Get_Updated as jest.Mock).mockResolvedValue(mockRecord);

      const result = await UpdateUserProfileController.Get_Updated('profile-1');

      expect(result).toEqual(mockRecord);
      expect(UserProfile.Get_Updated).toHaveBeenCalledWith('profile-1');
    });

    it('should return null when entity cannot find the record', async () => {
      (UserProfile.Get_Updated as jest.Mock).mockResolvedValue(null);

      const result = await UpdateUserProfileController.Get_Updated('nonexistent-id');

      expect(result).toBeNull();
    });
  });
});
