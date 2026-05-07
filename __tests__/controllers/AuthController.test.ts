import { AuthController } from '@/lib/controllers/AuthController';
import { SessionData } from '@/lib/entities/SessionData';

jest.mock('@/lib/entities/SessionData');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
