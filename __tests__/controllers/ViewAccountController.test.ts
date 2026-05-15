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
    it('returns success tuple with all accounts when accounts exist (main flow)', async () => {
      const mockAccounts = [
        { id: '1', username: 'user1', email: 'user1@test.com' },
        { id: '2', username: 'user2', email: 'user2@test.com' },
      ];
      (UserAccount.fetchAccountDetails as jest.Mock).mockResolvedValue([
        true,
        '',
        mockAccounts,
      ]);

      const [success, message, accounts] =
        await ViewAccountController.getAccountDetails();

      expect(success).toBe(true);
      expect(message).toBe('');
      expect(accounts).toEqual(mockAccounts);
      expect(UserAccount.fetchAccountDetails).toHaveBeenCalledTimes(1);
    });

    it('returns failure tuple with empty list when no accounts exist (alternate flow)', async () => {
      (UserAccount.fetchAccountDetails as jest.Mock).mockResolvedValue([
        false,
        'No accounts found',
        [],
      ]);

      const [success, message, accounts] =
        await ViewAccountController.getAccountDetails();

      expect(success).toBe(false);
      expect(message).toBe('No accounts found');
      expect(accounts).toEqual([]);
    });
  });
});
