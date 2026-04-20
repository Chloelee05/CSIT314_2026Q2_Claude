import { SuspendUserAccountController } from '@/lib/controllers/SuspendUserAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';

jest.mock('@/lib/entities/UserAccount');

describe('SuspendUserAccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #9 — Admin can suspend user account
  // ===========================================================
  describe('User Story #9: SuspendUserAccount', () => {
    it('should suspend account successfully with valid ID', async () => {
      (UserAccount.SuspendUserAccount as jest.Mock).mockResolvedValue(true);

      const result = await SuspendUserAccountController.SuspendUserAccount('acc-1');

      expect(result).toBe(true);
      expect(UserAccount.SuspendUserAccount).toHaveBeenCalledWith('acc-1');
    });

    it('should return false when entity suspension fails', async () => {
      (UserAccount.SuspendUserAccount as jest.Mock).mockResolvedValue(false);

      const result = await SuspendUserAccountController.SuspendUserAccount('acc-1');

      expect(result).toBe(false);
    });

    it('should return false when ID is empty', async () => {
      const result = await SuspendUserAccountController.SuspendUserAccount('');

      expect(result).toBe(false);
      expect(UserAccount.SuspendUserAccount).not.toHaveBeenCalled();
    });
  });
});
