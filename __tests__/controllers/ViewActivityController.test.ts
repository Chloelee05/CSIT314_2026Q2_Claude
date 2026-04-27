import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

describe('ViewActivityController', () => {
  let getByUserIdSpy: jest.SpyInstance;
  let getByIdSpy: jest.SpyInstance;

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
  });

  afterAll(() => {
    getByUserIdSpy.mockRestore();
    getByIdSpy.mockRestore();
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
});
