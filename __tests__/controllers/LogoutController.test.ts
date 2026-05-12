import { LogoutController } from '@/lib/controllers/LogoutController';
import { UserAccount } from '@/lib/entities/UserAccount';
import { UserSession } from '@/lib/entities/UserSession';

jest.mock('@/lib/entities/UserAccount');
jest.mock('@/lib/entities/UserSession');

describe('LogoutController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #17 — Admin logout
  // User Story #50 — User logout
  // Both share the same logout() method via clearSession()
  // ===========================================================
  describe('User Story #17 / #50: logout', () => {
    it('should return true when session is active and cleared', async () => {
      (UserAccount.clearSession as jest.Mock).mockResolvedValue(true);

      const result = await LogoutController.logout();

      expect(result).toBe(true);
      expect(UserAccount.clearSession).toHaveBeenCalledTimes(1);
    });

    it('should return false when no active session exists', async () => {
      (UserAccount.clearSession as jest.Mock).mockResolvedValue(false);

      const result = await LogoutController.logout();

      expect(result).toBe(false);
      expect(UserAccount.clearSession).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================
  // User Story #31 — Donee Logout
  // LogoutController.logout(sessionId) → UserSession.invalidateSession(sessionId)
  // ===========================================================
  describe('User Story #31: logout(sessionId)', () => {
    it('should return true and call invalidateSession with the sessionId', async () => {
      (UserSession.invalidateSession as jest.Mock).mockResolvedValue(true);

      const result = await LogoutController.logout('session-abc');

      expect(result).toBe(true);
      expect(UserSession.invalidateSession).toHaveBeenCalledWith('session-abc');
      expect(UserSession.invalidateSession).toHaveBeenCalledTimes(1);
    });

    it('should return false when invalidateSession returns false', async () => {
      (UserSession.invalidateSession as jest.Mock).mockResolvedValue(false);

      const result = await LogoutController.logout('session-xyz');

      expect(result).toBe(false);
      expect(UserSession.invalidateSession).toHaveBeenCalledWith('session-xyz');
    });
  });
});
