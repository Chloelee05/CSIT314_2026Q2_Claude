import { LoginController } from '@/lib/controllers/LoginController';
import { UserAccount } from '@/lib/entities/UserAccount';
import { UserProfile } from '@/lib/entities/UserProfile';
import * as auth from '@/lib/auth';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/entities/UserProfile');
jest.mock('@/lib/entities/UserAccount');
jest.mock('@/lib/auth');

describe('LoginController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // User Story #16 — Admin Login
  // ============================================================
  describe('User Story #16: Login (Admin)', () => {
    it('should return success when credentials are valid', async () => {
      const mockUser = { id: '1', username: 'admin1', role: 'admin' };
      (UserProfile.verify_credentials as jest.Mock).mockResolvedValue([
        true,
        'OK',
        mockUser,
      ]);
      (auth.createSession as jest.Mock).mockResolvedValue(undefined);

      const [success, message] = await LoginController.Login(
        'admin1',
        'password123',
        'admin',
      );

      expect(success).toBe(true);
      expect(message).toBe('Successful Login.');
      expect(UserProfile.verify_credentials).toHaveBeenCalledWith(
        'admin1',
        'password123',
        'admin',
      );
      expect(auth.createSession).toHaveBeenCalledWith({
        userId: '1',
        username: 'admin1',
        role: 'admin',
      });
    });

    it('should return failure when credentials are invalid', async () => {
      (UserProfile.verify_credentials as jest.Mock).mockResolvedValue([
        false,
        'Invalid credentials.',
        null,
      ]);

      const [success, message] = await LoginController.Login(
        'wrong',
        'wrong',
        'admin',
      );

      expect(success).toBe(false);
      expect(message).toBe('Invalid credentials.');
      expect(auth.createSession).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // User Story #49 — User Login
  // ============================================================
  describe('User Story #49: authenticateUser', () => {
    const mockActiveUser = {
      id: '2',
      username: 'donor1',
      password_hash: '$2a$10$hashedpassword',
      email: 'donor@test.com',
      role: 'donee',
      status: 'active',
      full_name: 'Donor One',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    };

    it('should return success with valid email and password', async () => {
      (UserAccount.getByEmail as jest.Mock).mockResolvedValue(mockActiveUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      (auth.createSession as jest.Mock).mockResolvedValue(undefined);

      const [success, message] = await LoginController.authenticateUser(
        'donor@test.com',
        'correctpw',
      );

      expect(success).toBe(true);
      expect(message).toBe('Successful Login.');
    });

    it('should fail when email does not exist', async () => {
      (UserAccount.getByEmail as jest.Mock).mockResolvedValue(null);

      const [success, message] = await LoginController.authenticateUser(
        'nobody@test.com',
        'any',
      );

      expect(success).toBe(false);
      expect(message).toBe('Invalid email or password.');
    });

    it('should fail when account is suspended', async () => {
      const mockSuspendedUser = { ...mockActiveUser, status: 'suspended' };
      (UserAccount.getByEmail as jest.Mock).mockResolvedValue(mockSuspendedUser);

      const [success, message] = await LoginController.authenticateUser(
        'donor@test.com',
        'correctpw',
      );

      expect(success).toBe(false);
      expect(message).toBe('Your account has been suspended.');
    });

    it('should fail when password is wrong', async () => {
      (UserAccount.getByEmail as jest.Mock).mockResolvedValue(mockActiveUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const [success, message] = await LoginController.authenticateUser(
        'donor@test.com',
        'wrongpw',
      );

      expect(success).toBe(false);
      expect(message).toBe('Invalid email or password.');
    });
  });
});
