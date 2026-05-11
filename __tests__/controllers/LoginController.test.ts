import { LoginController } from '@/lib/controllers/LoginController';
import { UserAccount } from '@/lib/entities/UserAccount';
import * as auth from '@/lib/auth';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/entities/UserAccount');
jest.mock('@/lib/auth');

describe('LoginController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #16 — Admin Login
  // LoginController.Login() → UserAccount.verify_credentials()
  // ===========================================================
  describe('User Story #16: Login (Admin)', () => {
    it('should return success when admin credentials are valid', async () => {
      const mockUser = { id: '1', username: 'admin1', role: 'admin' };
      (UserAccount.verify_credentials as jest.Mock).mockResolvedValue([
        true,
        'Credentials verified.',
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
      expect(UserAccount.verify_credentials).toHaveBeenCalledWith(
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

    it('should fail when admin credentials are invalid', async () => {
      (UserAccount.verify_credentials as jest.Mock).mockResolvedValue([
        false,
        'Invalid username or role.',
        null,
      ]);

      const [success, message] = await LoginController.Login(
        'wrong',
        'wrong',
        'admin',
      );

      expect(success).toBe(false);
      expect(message).toBe('Invalid username or role.');
      expect(auth.createSession).not.toHaveBeenCalled();
    });
  });

  // ===========================================================
  // User Story #23 — FR (Fundraiser) Login
  //
  // Regular Flow:
  //   1. FR selects "Fundraiser" role from dropdown
  //   2. FR enters username and password
  //   3. FR clicks "Log In"
  //   4. System validates credentials and role
  //   5. System redirects FR to their dashboard
  //   6. Success notification
  //
  // Exception Flow:
  //   4a. Validation error if credential is wrong
  //   4b. Suspended account → failed login message
  // ===========================================================
  describe('User Story #23: Login (Fundraiser)', () => {
    it('should return success when FR credentials are valid', async () => {
      const mockFR = { id: '10', username: 'fundraiser1', role: 'fund_raiser' };
      (UserAccount.verify_credentials as jest.Mock).mockResolvedValue([
        true,
        'Credentials verified.',
        mockFR,
      ]);
      (auth.createSession as jest.Mock).mockResolvedValue(undefined);

      const [success, message] = await LoginController.Login(
        'fundraiser1',
        'mypassword',
        'fund_raiser',
      );

      expect(success).toBe(true);
      expect(message).toBe('Successful Login.');
      expect(UserAccount.verify_credentials).toHaveBeenCalledWith(
        'fundraiser1',
        'mypassword',
        'fund_raiser',
      );
      expect(auth.createSession).toHaveBeenCalledWith({
        userId: '10',
        username: 'fundraiser1',
        role: 'fund_raiser',
      });
    });

    it('should fail when FR username or role is invalid (Exception 4a)', async () => {
      (UserAccount.verify_credentials as jest.Mock).mockResolvedValue([
        false,
        'Invalid username or role.',
        null,
      ]);

      const [success, message] = await LoginController.Login(
        'nonexistent',
        'password',
        'fund_raiser',
      );

      expect(success).toBe(false);
      expect(message).toBe('Invalid username or role.');
      expect(auth.createSession).not.toHaveBeenCalled();
    });

    it('should fail when FR password is wrong (Exception 4a)', async () => {
      (UserAccount.verify_credentials as jest.Mock).mockResolvedValue([
        false,
        'Invalid password.',
        null,
      ]);

      const [success, message] = await LoginController.Login(
        'fundraiser1',
        'wrongpassword',
        'fund_raiser',
      );

      expect(success).toBe(false);
      expect(message).toBe('Invalid password.');
      expect(auth.createSession).not.toHaveBeenCalled();
    });

    it('should fail when FR account is suspended (Exception 4b)', async () => {
      (UserAccount.verify_credentials as jest.Mock).mockResolvedValue([
        false,
        'Your account has been suspended. Please contact an administrator.',
        null,
      ]);

      const [success, message] = await LoginController.Login(
        'fundraiser1',
        'mypassword',
        'fund_raiser',
      );

      expect(success).toBe(false);
      expect(message).toBe(
        'Your account has been suspended. Please contact an administrator.',
      );
      expect(auth.createSession).not.toHaveBeenCalled();
    });
  });

  // ===========================================================
  // User Story #49 — User Login (via email)
  // ===========================================================
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
