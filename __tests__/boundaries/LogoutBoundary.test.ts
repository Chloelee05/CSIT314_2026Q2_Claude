import { LogoutBoundary } from '@/lib/boundaries/LogoutBoundary';
import * as auth from '@/lib/auth';
import { redirect } from 'next/navigation';

jest.mock('@/lib/auth', () => ({
  deleteSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('LogoutBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #31 — Donee logout (Boundary-only sequence)
  // LogoutBoundary.Logout() → DisplayMessage(msg) → redirectToLoginPage()
  // ===========================================================
  describe('User Story #31', () => {
    it('Logout clears the session then redirects to login page', async () => {
      await LogoutBoundary.Logout();

      expect(auth.deleteSession).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('Logged out successfully.'),
      );
    });

    it('redirectToLoginPage invokes redirect with the logged-out success message', () => {
      LogoutBoundary.redirectToLoginPage();

      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('Logged out successfully.'),
      );
    });

    it('DisplayMessage returns the message string', () => {
      const msg = 'Logged out successfully.';
      expect(LogoutBoundary.DisplayMessage(msg)).toBe(msg);
    });
  });
});
