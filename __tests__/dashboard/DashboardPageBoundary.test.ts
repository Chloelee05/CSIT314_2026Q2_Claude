import { clickLogout } from '@/app/dashboard/DashboardPageBoundary';
import * as auth from '@/lib/auth';
import { LogoutController } from '@/lib/controllers/LogoutController';
import { redirect } from 'next/navigation';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}));

jest.mock('@/lib/controllers/LogoutController', () => ({
  LogoutController: {
    logout: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

/**
 * User Story #31 — Donee dashboard logout (boundary server action).
 *
 * 보고서/Taiga: Boundary 레벨 증거는 이 스위트 실행 화면을 캡처.
 * 컨트롤러 증거는 LogoutController.test.ts 의 User Story #31.
 */
describe('DashboardPageBoundary (User Story #31 — Donee logout)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clickLogout loads session and calls LogoutController.logout with user id', async () => {
    (auth.getSession as jest.Mock).mockResolvedValue({
      userId: 'donee-user-1',
      username: 'donee1',
      role: 'donee',
    });
    (LogoutController.logout as jest.Mock).mockResolvedValue(true);

    await clickLogout();

    expect(LogoutController.logout).toHaveBeenCalledWith('donee-user-1');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('clickLogout passes empty string when session is missing', async () => {
    (auth.getSession as jest.Mock).mockResolvedValue(null);
    (LogoutController.logout as jest.Mock).mockResolvedValue(false);

    await clickLogout();

    expect(LogoutController.logout).toHaveBeenCalledWith('');
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
