import { CreateUserProfileController } from '@/lib/controllers/CreateUserProfileController';
import { UserProfile } from '@/lib/entities/UserProfile';

jest.mock('@/lib/entities/UserProfile');

describe('CreateUserProfileController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // User Story #11 — Admin Creates User Profile
  // ============================================================
  describe('User Story #11: CreateUserProfile', () => {
    const validArgs = ['profile-1', 'account-1', 'password123', '2000-01-01', '123 Main St', '91234567', 'donor'] as const;

    it('should return false when Account_id is empty', async () => {
      const result = await CreateUserProfileController.CreateUserProfile(
        'profile-1', '', 'password123', '2000-01-01', '123 Main St', '91234567', 'donor',
      );
      expect(result).toBe(false);
      expect(UserProfile.CreateUserProfile).not.toHaveBeenCalled();
    });

    it('should return false when Role is empty', async () => {
      const result = await CreateUserProfileController.CreateUserProfile(
        'profile-1', 'account-1', 'password123', '2000-01-01', '123 Main St', '91234567', '',
      );
      expect(result).toBe(false);
      expect(UserProfile.CreateUserProfile).not.toHaveBeenCalled();
    });

    it('should return false when both Account_id and Role are empty', async () => {
      const result = await CreateUserProfileController.CreateUserProfile(
        'profile-1', '', 'password123', '2000-01-01', '123 Main St', '91234567', '',
      );
      expect(result).toBe(false);
      expect(UserProfile.CreateUserProfile).not.toHaveBeenCalled();
    });

    it('should return true when entity successfully creates the profile', async () => {
      (UserProfile.CreateUserProfile as jest.Mock).mockResolvedValue(true);

      const result = await CreateUserProfileController.CreateUserProfile(...validArgs);

      expect(result).toBe(true);
      expect(UserProfile.CreateUserProfile).toHaveBeenCalledWith(...validArgs);
    });

    it('should return false when entity fails to create the profile', async () => {
      (UserProfile.CreateUserProfile as jest.Mock).mockResolvedValue(false);

      const result = await CreateUserProfileController.CreateUserProfile(...validArgs);

      expect(result).toBe(false);
      expect(UserProfile.CreateUserProfile).toHaveBeenCalledWith(...validArgs);
    });
  });
});
