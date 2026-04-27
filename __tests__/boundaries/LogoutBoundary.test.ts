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
  // User Story #24 — FR logout (Boundary-only sequence)
  // ===========================================================
  describe('User Story #24', () => {
    it('process_logout clears the session then shows the login page', async () => {
      await LogoutBoundary.process_logout();

      expect(auth.deleteSession).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('Logged out successfully.'),
      );
    });

    it('show_login_page invokes redirect with the logged-out success message', () => {
      LogoutBoundary.show_login_page();

      expect(redirect).toHaveBeenCalledWith(
        '/login?message=' + encodeURIComponent('Logged out successfully.'),
      );
    });
  });
});
