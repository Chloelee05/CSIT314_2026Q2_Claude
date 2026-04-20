import { CreateAccountController } from '@/lib/controllers/CreateAccountController';
import { UserAccount } from '@/lib/entities/UserAccount';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/entities/UserAccount');

describe('CreateAccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #6 — Admin can create a user account so that
  // new users can access the system
  // ===========================================================
  describe('User Story #6: createAccount', () => {
    it('should create account successfully with a new email', async () => {
      (UserAccount.getByEmail as jest.Mock).mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_pw' as never);
      (UserAccount.save as jest.Mock).mockResolvedValue(true);

      const [success, message] = await CreateAccountController.createAccount(
        'newuser@test.com',
        'password123',
      );

      expect(success).toBe(true);
      expect(message).toBe('Account created');
      expect(UserAccount.getByEmail).toHaveBeenCalledWith('newuser@test.com');
      expect(UserAccount.save).toHaveBeenCalledTimes(1);
    });

    it('should fail when email already exists', async () => {
      const existingUser = {
        id: '1',
        username: 'existing',
        email: 'taken@test.com',
      };
      (UserAccount.getByEmail as jest.Mock).mockResolvedValue(existingUser);

      const [success, message] = await CreateAccountController.createAccount(
        'taken@test.com',
        'password123',
      );

      expect(success).toBe(false);
      expect(message).toBe('An account with this email already exists.');
      expect(UserAccount.save).not.toHaveBeenCalled();
    });

    it('should fail when database save fails', async () => {
      (UserAccount.getByEmail as jest.Mock).mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_pw' as never);
      (UserAccount.save as jest.Mock).mockResolvedValue(false);

      const [success, message] = await CreateAccountController.createAccount(
        'newuser@test.com',
        'password123',
      );

      expect(success).toBe(false);
      expect(message).toBe('Failed to create account.');
    });
  });
});
