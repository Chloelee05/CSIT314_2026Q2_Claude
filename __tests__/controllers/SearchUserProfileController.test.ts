import { SearchUserProfileController } from '@/lib/controllers/SearchUserProfileController';
import { UserProfile } from '@/lib/entities/UserProfile';

jest.mock('@/lib/entities/UserProfile');

describe('SearchUserProfileController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // User Story #15 — Admin Searches User Profiles
  // ============================================================
  describe('User Story #15: SearchUserProfile', () => {
    const mockResults = [
      { id: '1', username: 'donor1', status: 'active' },
      { id: '2', username: 'donor2', status: 'active' },
    ];

    it('should return results using default search_by (FullName)', async () => {
      (UserProfile.SearchUserProfile as jest.Mock).mockResolvedValue(mockResults);

      const result = await SearchUserProfileController.SearchUserProfile('John');

      expect(result).toEqual(mockResults);
      expect(UserProfile.SearchUserProfile).toHaveBeenCalledWith('John', 'FullName');
    });

    it('should forward search_by "Username" to entity correctly', async () => {
      (UserProfile.SearchUserProfile as jest.Mock).mockResolvedValue(mockResults);

      const result = await SearchUserProfileController.SearchUserProfile('donor', 'Username');

      expect(result).toEqual(mockResults);
      expect(UserProfile.SearchUserProfile).toHaveBeenCalledWith('donor', 'Username');
    });

    it('should forward search_by "ID" to entity correctly', async () => {
      const singleResult = [{ id: 'abc-123', username: 'donor1', status: 'active' }];
      (UserProfile.SearchUserProfile as jest.Mock).mockResolvedValue(singleResult);

      const result = await SearchUserProfileController.SearchUserProfile('abc-123', 'ID');

      expect(result).toEqual(singleResult);
      expect(UserProfile.SearchUserProfile).toHaveBeenCalledWith('abc-123', 'ID');
    });

    it('should forward search_by "Role" to entity correctly', async () => {
      (UserProfile.SearchUserProfile as jest.Mock).mockResolvedValue(mockResults);

      const result = await SearchUserProfileController.SearchUserProfile('donor', 'Role');

      expect(result).toEqual(mockResults);
      expect(UserProfile.SearchUserProfile).toHaveBeenCalledWith('donor', 'Role');
    });

    it('should return empty array when entity finds no matches', async () => {
      (UserProfile.SearchUserProfile as jest.Mock).mockResolvedValue([]);

      const result = await SearchUserProfileController.SearchUserProfile('nonexistent');

      expect(result).toEqual([]);
    });
  });
});
