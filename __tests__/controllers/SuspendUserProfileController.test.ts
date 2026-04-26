import { SuspendUserProfileController } from '@/lib/controllers/SuspendUserProfileController';
import { UserProfile } from '@/lib/entities/UserProfile';

jest.mock('@/lib/entities/UserProfile');

describe('SuspendUserProfileController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // User Story #14 — Admin Suspends User Profile
  // ============================================================
  describe('User Story #14: SuspendUserProfile', () => {
    it('should return true when entity successfully suspends the profile', async () => {
      (UserProfile.SuspendUserProfile as jest.Mock).mockResolvedValue(true);

      const result = await SuspendUserProfileController.SuspendUserProfile('profile-1');

      expect(result).toBe(true);
      expect(UserProfile.SuspendUserProfile).toHaveBeenCalledWith('profile-1');
    });

    it('should return false when entity fails to suspend the profile', async () => {
      (UserProfile.SuspendUserProfile as jest.Mock).mockResolvedValue(false);

      const result = await SuspendUserProfileController.SuspendUserProfile('profile-1');

      expect(result).toBe(false);
      expect(UserProfile.SuspendUserProfile).toHaveBeenCalledWith('profile-1');
    });
  });
});
