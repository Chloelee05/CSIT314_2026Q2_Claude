import { ProfileViewController } from '@/lib/controllers/ProfileViewController';
import { UserProfile } from '@/lib/entities/UserProfile';

jest.mock('@/lib/entities/UserProfile');

describe('ProfileViewController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // User Story #12 — View User Profile
  // ============================================================
  describe('User Story #12: getProfileDetails', () => {
    const mockProfile = { account_id: 'account-1', dob: '2000-01-01', address: '123 Main St', phone_number: '91234567' };

    it('should return profile when entity finds it', async () => {
      (UserProfile.fetchProfile as jest.Mock).mockResolvedValue(mockProfile);

      const result = await ProfileViewController.getProfileDetails('account-1');

      expect(result).toEqual({ profile: mockProfile });
      expect(UserProfile.fetchProfile).toHaveBeenCalledWith('account-1');
    });

    it('should return error when profile does not exist (null)', async () => {
      (UserProfile.fetchProfile as jest.Mock).mockResolvedValue(null);

      const result = await ProfileViewController.getProfileDetails('nonexistent-id');

      expect(result).toEqual({ error: 'Profile could not be loaded or no longer exists' });
    });

    it('should return error when entity throws an exception', async () => {
      (UserProfile.fetchProfile as jest.Mock).mockRejectedValue(new Error('DB connection failed'));

      const result = await ProfileViewController.getProfileDetails('account-1');

      expect(result).toEqual({ error: 'An unexpected system error occurred' });
    });
  });

  describe('User Story #12: getProfileList', () => {
    const mockProfiles = [
      { id: '1', username: 'donor1', status: 'active' },
      { id: '2', username: 'donee1', status: 'active' },
    ];

    it('should return list of profiles on success', async () => {
      (UserProfile.fetchAllProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const result = await ProfileViewController.getProfileList();

      expect(result).toEqual(mockProfiles);
      expect(UserProfile.fetchAllProfiles).toHaveBeenCalled();
    });

    it('should return empty array when entity throws an exception', async () => {
      (UserProfile.fetchAllProfiles as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await ProfileViewController.getProfileList();

      expect(result).toEqual([]);
    });
  });
});
