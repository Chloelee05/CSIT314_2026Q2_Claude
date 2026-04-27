import { DeleteActivityController } from '@/lib/controllers/DeleteActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import * as auth from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

describe('DeleteActivityController', () => {
  const frSession = {
    userId: 'user-fr-1',
    username: 'fundraiser1',
    role: 'fund_raiser',
  };

  const activity = {
    id: 'act-1',
    user_id: 'user-fr-1',
    title: 'Camp',
    description: 'Desc',
    goal_amount: 100,
    category: 'Health',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  };

  let getByIdSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeAll(() => {
    getByIdSpy = jest.spyOn(FundraisingActivity, 'getById');
    removeSpy = jest.spyOn(FundraisingActivity, 'remove_activity');
  });

  afterAll(() => {
    getByIdSpy.mockRestore();
    removeSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #21 — Remove Fundraising Activity
  // ===========================================================
  describe('User Story #21: DeleteActivity', () => {
    it('returns success tuple when FR owns the activity and entity removes it (main flow)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      getByIdSpy.mockResolvedValue(new FundraisingActivity(activity));
      removeSpy.mockResolvedValue([true, 'Activity removed.']);

      const [ok, msg] = await DeleteActivityController.DeleteActivity('act-1');

      expect(ok).toBe(true);
      expect(msg).toBe('Activity removed.');
      expect(removeSpy).toHaveBeenCalledWith('act-1');
    });

    it('returns failure when session is missing', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(null);

      const [ok, msg] = await DeleteActivityController.DeleteActivity('act-1');

      expect(ok).toBe(false);
      expect(msg).toBe('You must be logged in.');
      expect(getByIdSpy).not.toHaveBeenCalled();
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('returns failure when role is not fund_raiser (exception 5a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue({
        userId: 'admin-1',
        username: 'admin',
        role: 'admin',
      });

      const [ok, msg] = await DeleteActivityController.DeleteActivity('act-1');

      expect(ok).toBe(false);
      expect(msg).toBe('You are not allowed to remove this activity.');
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('returns failure when activity does not exist', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      getByIdSpy.mockResolvedValue(null);

      const [ok, msg] = await DeleteActivityController.DeleteActivity('missing');

      expect(ok).toBe(false);
      expect(msg).toBe('Activity not found.');
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('returns failure when FR does not own the activity (exception 5a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      getByIdSpy.mockResolvedValue(
        new FundraisingActivity({ ...activity, user_id: 'other-user' }),
      );

      const [ok, msg] = await DeleteActivityController.DeleteActivity('act-1');

      expect(ok).toBe(false);
      expect(msg).toBe('You are not allowed to remove this activity.');
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('propagates entity failure tuple (exception 5b)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      getByIdSpy.mockResolvedValue(new FundraisingActivity(activity));
      removeSpy.mockResolvedValue([
        false,
        'Could not remove the activity. Please try again.',
      ]);

      const [ok, msg] = await DeleteActivityController.DeleteActivity('act-1');

      expect(ok).toBe(false);
      expect(msg).toBe('Could not remove the activity. Please try again.');
    });
  });
});
