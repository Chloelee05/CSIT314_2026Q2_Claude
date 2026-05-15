import { ViewCompletedActivityController } from '@/lib/controllers/ViewCompletedActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

describe('ViewCompletedActivityController', () => {
  const userId = 'u1';
  const otherId = 'u2';
  const actId = 'act-1';

  const makeAct = (overrides: Partial<Record<string, unknown>> = {}) =>
    new FundraisingActivity({
      id: actId,
      user_id: userId,
      title: 'T',
      description: 'D',
      goal_amount: 1,
      category: 'C',
      end_date: '2025-01-01',
      view_count: 0,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      ...overrides,
    });

  let fetchCompletedActivitySpy: jest.SpyInstance;
  let getCompletedByIdSpy: jest.SpyInstance;

  beforeAll(() => {
    fetchCompletedActivitySpy = jest.spyOn(
      FundraisingActivity,
      'fetchCompletedActivity',
    );
    getCompletedByIdSpy = jest.spyOn(FundraisingActivity, 'getCompletedById');
  });

  afterAll(() => {
    fetchCompletedActivitySpy.mockRestore();
    getCompletedByIdSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #35 — View completed fundraising activity list
  // ViewCompletedActivityController.getCompletedActivity(userId)
  //   → FundraisingActivity.fetchCompletedActivity(userId)
  // ===========================================================
  describe('User Story #35: getCompletedActivity', () => {
    it('returns the completed activity list from the entity (main flow)', async () => {
      const list = [makeAct()];
      fetchCompletedActivitySpy.mockResolvedValue(list);

      const result = await ViewCompletedActivityController.getCompletedActivity(
        userId,
      );

      expect(result).toEqual(list);
      expect(fetchCompletedActivitySpy).toHaveBeenCalledWith(userId);
    });

    it('returns empty list when the user has no completed activities (alternate flow)', async () => {
      fetchCompletedActivitySpy.mockResolvedValue([]);

      const result = await ViewCompletedActivityController.getCompletedActivity(
        userId,
      );

      expect(result).toEqual([]);
    });
  });

  describe('User Story #35: getCompletedActivityForUser', () => {
    it('returns the activity when getCompletedById finds it and it belongs to the user', async () => {
      const a = makeAct();
      getCompletedByIdSpy.mockResolvedValue(a);

      const result =
        await ViewCompletedActivityController.getCompletedActivityForUser(
          actId,
          userId,
        );

      expect(result).toBe(a);
      expect(getCompletedByIdSpy).toHaveBeenCalledWith(actId);
    });

    it('returns null when the activity is not returned as completed or missing', async () => {
      getCompletedByIdSpy.mockResolvedValue(null);

      const result =
        await ViewCompletedActivityController.getCompletedActivityForUser(
          actId,
          userId,
        );

      expect(result).toBeNull();
    });

    it('returns null when the completed activity belongs to another user', async () => {
      getCompletedByIdSpy.mockResolvedValue(makeAct({ user_id: otherId }));

      const result =
        await ViewCompletedActivityController.getCompletedActivityForUser(
          actId,
          userId,
        );

      expect(result).toBeNull();
    });
  });
});
