import { AuthController } from '@/lib/controllers/AuthController';
import { SessionData } from '@/lib/entities/SessionData';
import { UserData } from '@/lib/entities/UserData';
import * as auth from '@/lib/auth';

jest.mock('@/lib/entities/SessionData');
jest.mock('@/lib/entities/UserData');
jest.mock('@/lib/auth');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #43 — Platform Manager Login
  // AuthController.login(username, password) → UserData.validateCredentials()
  // ===========================================================
  describe('User Story #43: Platform Manager Login (login)', () => {
    const mockPM = { id: 'pm-1', username: 'pm_user', role: 'platform_management' };

    it('should return success and create session when credentials are valid', async () => {
      (UserData.validateCredentials as jest.Mock).mockResolvedValue([
        true,
        'Credentials validated.',
        mockPM,
      ]);
      (auth.createSession as jest.Mock).mockResolvedValue(undefined);

      const [success, message] = await AuthController.login('pm_user', 'password123');

      expect(success).toBe(true);
      expect(message).toBe('Successful Login.');
      expect(UserData.validateCredentials).toHaveBeenCalledWith('pm_user', 'password123');
      expect(auth.createSession).toHaveBeenCalledWith({
        userId: 'pm-1',
        username: 'pm_user',
        role: 'platform_management',
      });
    });

    it('should fail when credentials are invalid (Exception 4a)', async () => {
      (UserData.validateCredentials as jest.Mock).mockResolvedValue([
        false,
        'Invalid username or password. Please try again.',
        null,
      ]);

      const [success, message] = await AuthController.login('pm_user', 'wrongpass');

      expect(success).toBe(false);
      expect(message).toBe('Invalid username or password. Please try again.');
      expect(auth.createSession).not.toHaveBeenCalled();
    });

    it('should fail when account is suspended', async () => {
      (UserData.validateCredentials as jest.Mock).mockResolvedValue([
        false,
        'Your account has been suspended. Please contact an administrator.',
        null,
      ]);

      const [success, message] = await AuthController.login('pm_user', 'password123');

      expect(success).toBe(false);
      expect(message).toBe(
        'Your account has been suspended. Please contact an administrator.',
      );
      expect(auth.createSession).not.toHaveBeenCalled();
    });

    it('should fail when username does not exist', async () => {
      (UserData.validateCredentials as jest.Mock).mockResolvedValue([
        false,
        'Invalid username or password. Please try again.',
        null,
      ]);

      const [success, message] = await AuthController.login('nobody', 'password123');

      expect(success).toBe(false);
      expect(message).toBe('Invalid username or password. Please try again.');
      expect(auth.createSession).not.toHaveBeenCalled();
    });
  });

  // ===========================================================
  // User Story #44 — Platform Manager Logout
  // AuthController.logout(session_id) → SessionData.invalidateSession(session_id)
  // ===========================================================
  describe('User Story #44: Platform Manager Logout (logout)', () => {
    it('should return true when session is successfully invalidated', async () => {
      (SessionData.invalidateSession as jest.Mock).mockResolvedValue(true);

      const result = await AuthController.logout('session-abc');

      expect(result).toBe(true);
      expect(SessionData.invalidateSession).toHaveBeenCalledWith('session-abc');
    });

    it('should return false when session has already expired (Exception 2a)', async () => {
      (SessionData.invalidateSession as jest.Mock).mockResolvedValue(false);

      const result = await AuthController.logout('expired-session');

      expect(result).toBe(false);
      expect(SessionData.invalidateSession).toHaveBeenCalledWith('expired-session');
    });

    it('should pass an empty string when no session id is available', async () => {
      (SessionData.invalidateSession as jest.Mock).mockResolvedValue(true);

      const result = await AuthController.logout('');

      expect(result).toBe(true);
      expect(SessionData.invalidateSession).toHaveBeenCalledWith('');
    });
  });
});
