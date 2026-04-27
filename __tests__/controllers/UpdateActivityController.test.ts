import { UpdateActivityController } from '@/lib/controllers/UpdateActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import * as auth from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

describe('UpdateActivityController', () => {
  const frSession = {
    userId: 'user-fr-1',
    username: 'fundraiser1',
    role: 'fund_raiser',
  };

  const owned = new FundraisingActivity({
    id: 'act-1',
    user_id: 'user-fr-1',
    title: 'Old',
    description: 'Old desc',
    goal_amount: 100,
    category: 'Health',
    end_date: null,
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  });

  let getByIdSpy: jest.SpyInstance;
  let saveActivitySpy: jest.SpyInstance;

  beforeAll(() => {
    getByIdSpy = jest.spyOn(FundraisingActivity, 'getById');
    saveActivitySpy = jest.spyOn(FundraisingActivity, 'save_activity');
  });

  afterAll(() => {
    getByIdSpy.mockRestore();
    saveActivitySpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #20 — Update Fundraising Activity
  // ===========================================================
  describe('User Story #20: UpdateActivity', () => {
    it('returns success tuple when FR owns the activity and save succeeds (main flow)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      getByIdSpy.mockResolvedValue(owned);
      saveActivitySpy.mockResolvedValue([true, 'Activity updated.']);

      const [ok, msg] = await UpdateActivityController.UpdateActivity(
        'act-1',
        'New title',
        'New description',
        250.5,
        '2026-12-31',
      );

      expect(ok).toBe(true);
      expect(msg).toBe('Activity updated.');
      expect(saveActivitySpy).toHaveBeenCalledWith(
        'act-1',
        'New title',
        'New description',
        250.5,
        '2026-12-31',
      );
    });

    it('fails with validation when title is empty (exception 6a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);

      const [ok, msg] = await UpdateActivityController.UpdateActivity(
        'act-1',
        '   ',
        'Description',
        10,
        null,
      );

      expect(ok).toBe(false);
      expect(msg).toBe('Please fill in all required fields.');
      expect(getByIdSpy).not.toHaveBeenCalled();
    });

    it('fails with validation when goal is not a positive number (exception 6b)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);

      const [ok, msg] = await UpdateActivityController.UpdateActivity(
        'act-1',
        'Title',
        'Description',
        0,
        null,
      );

      expect(ok).toBe(false);
      expect(msg).toBe('Goal amount must be a valid positive number.');
    });

    it('fails when session is missing', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(null);

      const [ok, msg] = await UpdateActivityController.UpdateActivity(
        'act-1',
        'T',
        'D',
        10,
        null,
      );

      expect(ok).toBe(false);
      expect(msg).toBe('You must be logged in.');
    });

    it('fails with authorization when role is not fund_raiser (exception 6c)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue({
        userId: 'admin-1',
        username: 'a',
        role: 'admin',
      });

      const [ok, msg] = await UpdateActivityController.UpdateActivity(
        'act-1',
        'T',
        'D',
        10,
        null,
      );

      expect(ok).toBe(false);
      expect(msg).toBe('You are not allowed to update this activity.');
    });

    it('fails with authorization when activity is owned by another user (exception 6c)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      getByIdSpy.mockResolvedValue(
        new FundraisingActivity({
          id: 'act-1',
          user_id: 'other-user',
          title: 'Old',
          description: 'Old desc',
          goal_amount: 100,
          category: 'Health',
          end_date: null,
          created_at: '2025-01-01',
          updated_at: '2025-01-01',
        }),
      );

      const [ok, msg] = await UpdateActivityController.UpdateActivity(
        'act-1',
        'T',
        'D',
        10,
        null,
      );

      expect(ok).toBe(false);
      expect(msg).toBe('You are not allowed to update this activity.');
      expect(saveActivitySpy).not.toHaveBeenCalled();
    });

    it('propagates entity failure (exception: save error)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      getByIdSpy.mockResolvedValue(owned);
      saveActivitySpy.mockResolvedValue([
        false,
        'Could not update the activity. Please try again.',
      ]);

      const [ok, msg] = await UpdateActivityController.UpdateActivity(
        'act-1',
        'T',
        'D',
        10,
        null,
      );

      expect(ok).toBe(false);
      expect(msg).toBe('Could not update the activity. Please try again.');
    });
  });
});
