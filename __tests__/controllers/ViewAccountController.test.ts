import { ViewAccountController } from '@/lib/controllers/ViewAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';

jest.mock('@/lib/entities/UserAccount');

describe('ViewAccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #7 — Admin can view user account details so that
  // they can inspect account information
  // ===========================================================
  describe('User Story #7: getAccountDetails', () => {
    it('should return all accounts when userId is null', async () => {
      const mockAccounts = [
        { id: '1', username: 'user1', email: 'user1@test.com' },
        { id: '2', username: 'user2', email: 'user2@test.com' },
      ];
      (UserAccount.getAll as jest.Mock).mockResolvedValue(mockAccounts);

      const result = await ViewAccountController.getAccountDetails(null);

      expect(result).toEqual(mockAccounts);
      expect(UserAccount.getAll).toHaveBeenCalledTimes(1);
      expect(UserAccount.getById).not.toHaveBeenCalled();
    });

    it('should return a single account when userId is provided', async () => {
      const mockAccount = { id: '1', username: 'user1', email: 'user1@test.com' };
      (UserAccount.getById as jest.Mock).mockResolvedValue(mockAccount);

      const result = await ViewAccountController.getAccountDetails('1');

      expect(result).toEqual(mockAccount);
      expect(UserAccount.getById).toHaveBeenCalledWith('1');
      expect(UserAccount.getAll).not.toHaveBeenCalled();
    });

    it('should return null when userId does not exist', async () => {
      (UserAccount.getById as jest.Mock).mockResolvedValue(null);

      const result = await ViewAccountController.getAccountDetails('nonexistent');

      expect(result).toBeNull();
      expect(UserAccount.getById).toHaveBeenCalledWith('nonexistent');
    });
  });
});
