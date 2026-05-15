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
  // LogoutBoundary.process_logout() → show_login_page()
  // ===========================================================
  describe('User Story #31', () => {
    it('process_logout clears the session then redirects to login page', async () => {
      await LogoutBoundary.process_logout();

      expect(auth.deleteSession).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('Logged out successfully.'),
      );
    });

    it('show_login_page redirects to login with the logged-out success message', () => {
      LogoutBoundary.show_login_page();

      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('Logged out successfully.'),
      );
    });
  });

  // ===========================================================
  // User Story #44 — PM logout (Boundary-only sequence)
  // Logout() → DisplayMessage(msg) → redirectToLoginPage()
  // ===========================================================
  describe('User Story #44', () => {
    it('Logout clears the session then displays message and redirects', async () => {
      await LogoutBoundary.Logout();

      expect(auth.deleteSession).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('You have been logged out successfully.'),
      );
    });

    it('DisplayMessage redirects to login with the given message', () => {
      LogoutBoundary.DisplayMessage('You have been logged out successfully.');

      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('You have been logged out successfully.'),
      );
    });

    it('redirectToLoginPage redirects to login with message when provided', () => {
      LogoutBoundary.redirectToLoginPage('Goodbye!');

      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('Goodbye!'),
      );
    });

    it('redirectToLoginPage redirects to /login with no query string when no message', () => {
      LogoutBoundary.redirectToLoginPage();

      expect(redirect).toHaveBeenCalledWith('/login');
    });
  });
});
