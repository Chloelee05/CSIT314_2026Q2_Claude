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

  let getCompletedByKeywordSpy: jest.SpyInstance;
  let getCompletedByIdSpy: jest.SpyInstance;

  beforeAll(() => {
    getCompletedByKeywordSpy = jest.spyOn(
      FundraisingActivity,
      'getCompletedByKeyword',
    );
    getCompletedByIdSpy = jest.spyOn(FundraisingActivity, 'getCompletedById');
  });

  afterAll(() => {
    getCompletedByKeywordSpy.mockRestore();
    getCompletedByIdSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #35 — View completed fundraising activity details
  // ===========================================================
  describe('User Story #35: getCompletedActivities', () => {
    it('returns the user’s completed list from the entity (main list flow)', async () => {
      const list = [makeAct()];
      getCompletedByKeywordSpy.mockResolvedValue(list);

      const result = await ViewCompletedActivityController.getCompletedActivities(
        userId,
      );

      expect(result).toEqual(list);
      expect(getCompletedByKeywordSpy).toHaveBeenCalledWith('', userId);
    });
  });

  describe('User Story #35: getCompletedActivitiesWithMessage', () => {
    it('returns activities and null message when the list is non-empty', async () => {
      const list = [makeAct()];
      getCompletedByKeywordSpy.mockResolvedValue(list);

      const [rows, msg] =
        await ViewCompletedActivityController.getCompletedActivitiesWithMessage(
          userId,
          'run',
        );

      expect(rows).toEqual(list);
      expect(msg).toBeNull();
      expect(getCompletedByKeywordSpy).toHaveBeenCalledWith('run', userId);
    });

    it('returns empty list and the exact not-found message when there are no completed matches (alt. flow)', async () => {
      getCompletedByKeywordSpy.mockResolvedValue([]);

      const [rows, msg] =
        await ViewCompletedActivityController.getCompletedActivitiesWithMessage(
          userId,
          'nope',
        );

      expect(rows).toEqual([]);
      expect(msg).toBe('No completed fundraising activities found.');
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
