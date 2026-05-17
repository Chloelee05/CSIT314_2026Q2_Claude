import { clickLogout } from '@/app/dashboard/DashboardPageBoundary';
import { LogoutBoundary } from '@/lib/boundaries/LogoutBoundary';

jest.mock('@/lib/boundaries/LogoutBoundary', () => ({
  LogoutBoundary: {
    Logout: jest.fn(),
  },
}));

/**
 * User Story #31 — Donee dashboard logout (boundary server action).
 * clickLogout() → LogoutBoundary.Logout() — no controller.
 */
describe('DashboardPageBoundary (User Story #31 — Donee logout)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clickLogout calls LogoutBoundary.Logout', async () => {
    (LogoutBoundary.Logout as jest.Mock).mockResolvedValue(undefined);

    await clickLogout();

    expect(LogoutBoundary.Logout).toHaveBeenCalled();
  });
});
