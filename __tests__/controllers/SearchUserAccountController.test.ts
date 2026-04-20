import { SearchUserAccountController } from '@/lib/controllers/SearchUserAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';

jest.mock('@/lib/entities/UserAccount');

describe('SearchUserAccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #10 — Admin can search user account via username,
  // email, full name as keywords
  // ===========================================================
  describe('User Story #10: SearchUserAccount', () => {
    const mockResults = [
      { id: '1', username: 'john_doe', email: 'john@test.com', full_name: 'John Doe' },
      { id: '2', username: 'john_smith', email: 'jsmith@test.com', full_name: 'John Smith' },
    ];

    it('should return matching accounts when searching by username', async () => {
      (UserAccount.SearchUserAccount as jest.Mock).mockResolvedValue(mockResults);

      const result = await SearchUserAccountController.SearchUserAccount(
        'john',
        'UserName',
      );

      expect(result).toEqual(mockResults);
      expect(UserAccount.SearchUserAccount).toHaveBeenCalledWith('john', 'UserName');
    });

    it('should return matching accounts when searching by email', async () => {
      (UserAccount.SearchUserAccount as jest.Mock).mockResolvedValue(mockResults);

      const result = await SearchUserAccountController.SearchUserAccount(
        'john',
        'Email',
      );

      expect(result).toEqual(mockResults);
      expect(UserAccount.SearchUserAccount).toHaveBeenCalledWith('john', 'Email');
    });

    it('should return matching accounts when searching by full name', async () => {
      (UserAccount.SearchUserAccount as jest.Mock).mockResolvedValue(mockResults);

      const result = await SearchUserAccountController.SearchUserAccount(
        'John',
        'FullName',
      );

      expect(result).toEqual(mockResults);
      expect(UserAccount.SearchUserAccount).toHaveBeenCalledWith('John', 'FullName');
    });

    it('should default to UserName search when search_by is not provided', async () => {
      (UserAccount.SearchUserAccount as jest.Mock).mockResolvedValue(mockResults);

      const result = await SearchUserAccountController.SearchUserAccount('john');

      expect(result).toEqual(mockResults);
      expect(UserAccount.SearchUserAccount).toHaveBeenCalledWith('john', 'UserName');
    });

    it('should return empty array when no accounts match', async () => {
      (UserAccount.SearchUserAccount as jest.Mock).mockResolvedValue([]);

      const result = await SearchUserAccountController.SearchUserAccount(
        'zzz_no_match',
        'UserName',
      );

      expect(result).toEqual([]);
    });
  });
});
