import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

describe('ViewActivityController', () => {
  let getByUserIdSpy: jest.SpyInstance;
  let getByIdSpy: jest.SpyInstance;
  let getDetailsSpy: jest.SpyInstance;

  const sample = (overrides: Partial<Record<string, unknown>> = {}) =>
    new FundraisingActivity({
      id: 'a1',
      user_id: 'u1',
      title: 'Run',
      description: 'Desc',
      goal_amount: 100,
      category: 'Health',
      end_date: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      ...overrides,
    });

  beforeAll(() => {
    getByUserIdSpy = jest.spyOn(FundraisingActivity, 'getByUserId');
    getByIdSpy = jest.spyOn(FundraisingActivity, 'getById');
    getDetailsSpy = jest.spyOn(FundraisingActivity, 'get_activities_details');
  });

  afterAll(() => {
    getByUserIdSpy.mockRestore();
    getByIdSpy.mockRestore();
    getDetailsSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #19 — View Fundraising Activity
  // ===========================================================
  describe('User Story #19: getActivities', () => {
    it('returns list from entity getByUserId (main flow steps 2–5)', async () => {
      const list = [sample()];
      getByUserIdSpy.mockResolvedValue(list);

      const result = await ViewActivityController.getActivities('u1');

      expect(result).toEqual(list);
      expect(getByUserIdSpy).toHaveBeenCalledWith('u1');
    });

    it('returns empty list when user has no activities (ALT: no activities)', async () => {
      getByUserIdSpy.mockResolvedValue([]);

      const result = await ViewActivityController.getActivities('u-empty');

      expect(result).toEqual([]);
    });
  });

  describe('User Story #19: getActivityForUser', () => {
    it('returns activity when id exists and belongs to user (steps 8–11)', async () => {
      const act = sample();
      getByIdSpy.mockResolvedValue(act);

      const result = await ViewActivityController.getActivityForUser('a1', 'u1');

      expect(result).toBe(act);
      expect(getByIdSpy).toHaveBeenCalledWith('a1');
    });

    it('returns null when activity does not exist', async () => {
      getByIdSpy.mockResolvedValue(null);

      const result = await ViewActivityController.getActivityForUser(
        'missing',
        'u1',
      );

      expect(result).toBeNull();
    });

    it('returns null when activity belongs to another user', async () => {
      getByIdSpy.mockResolvedValue(sample({ user_id: 'other' }));

      const result = await ViewActivityController.getActivityForUser('a1', 'u1');

      expect(result).toBeNull();
    });
  });

  // ===========================================================
  // User Story #26 — Donee views fundraising activity details
  // ViewActivityController.ViewActivity(activityId)
  //   → FundraisingActivity.get_activities_details(activityId)
  // ===========================================================
  describe('User Story #26: ViewActivity', () => {
    it('returns success tuple with activity when it is active', async () => {
      const activity = sample({ status: 'active' });
      getDetailsSpy.mockResolvedValue([true, 'Activity found.', activity]);

      const [success, message, result] =
        await ViewActivityController.ViewActivity('a1');

      expect(success).toBe(true);
      expect(message).toBe('Activity found.');
      expect(result).toBe(activity);
      expect(getDetailsSpy).toHaveBeenCalledWith('a1');
    });

    it('returns failure tuple when activity is not found', async () => {
      getDetailsSpy.mockResolvedValue([false, 'Activity not found.', null]);

      const [success, message, result] =
        await ViewActivityController.ViewActivity('nonexistent');

      expect(success).toBe(false);
      expect(message).toBe('Activity not found.');
      expect(result).toBeNull();
    });

    it('returns failure tuple when activity is completed', async () => {
      const activity = sample({ status: 'completed' });
      getDetailsSpy.mockResolvedValue([false, 'Activity is completed.', activity]);

      const [success, message, result] =
        await ViewActivityController.ViewActivity('a1');

      expect(success).toBe(false);
      expect(message).toBe('Activity is completed.');
      expect(result).toBe(activity);
    });

    it('returns failure tuple when activity is inactive', async () => {
      const activity = sample({ status: 'inactive' });
      getDetailsSpy.mockResolvedValue([false, 'Activity is inactive.', activity]);

      const [success, message, result] =
        await ViewActivityController.ViewActivity('a1');

      expect(success).toBe(false);
      expect(message).toBe('Activity is inactive.');
      expect(result).toBe(activity);
    });
  });
});
