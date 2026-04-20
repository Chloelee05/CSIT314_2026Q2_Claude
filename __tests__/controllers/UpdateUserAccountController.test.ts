import { UpdateUserAccountController } from '@/lib/controllers/UpdateUserAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';

jest.mock('@/lib/entities/UserAccount');

describe('UpdateUserAccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #8 — Admin can update user account to modify
  // user info
  // ===========================================================
  describe('User Story #8: UpdatedUserAccount', () => {
    it('should update account successfully with valid inputs', async () => {
      (UserAccount.UpdatedUserAccount as jest.Mock).mockResolvedValue(true);

      const result = await UpdateUserAccountController.UpdatedUserAccount(
        'acc-1',
        'newUsername',
        'newPassword',
        'admin',
        'profile-1',
      );

      expect(result).toBe(true);
      expect(UserAccount.UpdatedUserAccount).toHaveBeenCalledWith(
        'acc-1',
        'newUsername',
        'newPassword',
        'admin',
        'profile-1',
      );
    });

    it('should fail when username is empty', async () => {
      const result = await UpdateUserAccountController.UpdatedUserAccount(
        'acc-1',
        '',
        'newPassword',
        'admin',
        'profile-1',
      );

      expect(result).toBe(false);
      expect(UserAccount.UpdatedUserAccount).not.toHaveBeenCalled();
    });

    it('should fail when username is only whitespace', async () => {
      const result = await UpdateUserAccountController.UpdatedUserAccount(
        'acc-1',
        '   ',
        'newPassword',
        'admin',
        'profile-1',
      );

      expect(result).toBe(false);
      expect(UserAccount.UpdatedUserAccount).not.toHaveBeenCalled();
    });

    it('should fail when role is empty', async () => {
      const result = await UpdateUserAccountController.UpdatedUserAccount(
        'acc-1',
        'newUsername',
        'newPassword',
        '',
        'profile-1',
      );

      expect(result).toBe(false);
      expect(UserAccount.UpdatedUserAccount).not.toHaveBeenCalled();
    });

    it('should return false when entity update fails', async () => {
      (UserAccount.UpdatedUserAccount as jest.Mock).mockResolvedValue(false);

      const result = await UpdateUserAccountController.UpdatedUserAccount(
        'acc-1',
        'newUsername',
        'newPassword',
        'admin',
        'profile-1',
      );

      expect(result).toBe(false);
    });
  });

  describe('User Story #8: Get_Updated', () => {
    it('should return updated account data', async () => {
      const mockUpdated = {
        id: 'acc-1',
        username: 'updatedUser',
        role: 'admin',
      };
      (UserAccount.Get_Updated as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await UpdateUserAccountController.Get_Updated('acc-1');

      expect(result).toEqual(mockUpdated);
      expect(UserAccount.Get_Updated).toHaveBeenCalledWith('acc-1');
    });

    it('should return null when account is not found', async () => {
      (UserAccount.Get_Updated as jest.Mock).mockResolvedValue(null);

      const result = await UpdateUserAccountController.Get_Updated('nonexistent');

      expect(result).toBeNull();
    });
  });
});
