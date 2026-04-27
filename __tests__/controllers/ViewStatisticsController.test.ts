import { ViewStatisticsController } from '@/lib/controllers/ViewStatisticsController';
import { FRAData } from '@/lib/entities/FRAData';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import { SavedFRAData } from '@/lib/entities/SavedFRAData';

jest.mock('@/lib/entities/FRAData', () => ({
  FRAData: {
    fetchViewCount: jest.fn(),
  },
}));

jest.mock('@/lib/entities/SavedFRAData', () => ({
  SavedFRAData: {
    countShortlists: jest.fn(),
  },
}));

describe('ViewStatisticsController', () => {
  const fraId = 'fra-1';
  const userId = 'u1';
  const otherUserId = 'u2';

  const makeActivity = (uid: string) =>
    new FundraisingActivity({
      id: fraId,
      user_id: uid,
      title: 'T',
      description: 'D',
      goal_amount: 1,
      category: 'C',
      end_date: null,
      view_count: 0,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    });

  let getByIdSpy: jest.SpyInstance;

  beforeAll(() => {
    getByIdSpy = jest.spyOn(FundraisingActivity, 'getById');
  });

  afterAll(() => {
    getByIdSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #32 — View FRA view count
  // ===========================================================
  describe('User Story #32: getViewCount', () => {
    it('returns view count when user owns the activity and FRAData succeeds (main flow)', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(userId));
      (FRAData.fetchViewCount as jest.Mock).mockResolvedValue([true, 42, '']);

      const result = await ViewStatisticsController.getViewCount(fraId, userId);

      expect(result).toEqual([true, 42, '']);
      expect(FRAData.fetchViewCount).toHaveBeenCalledWith(fraId);
    });

    it('returns 0 and success when the activity has no views (exception 2a — zero views)', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(userId));
      (FRAData.fetchViewCount as jest.Mock).mockResolvedValue([true, 0, '']);

      const result = await ViewStatisticsController.getViewCount(fraId, userId);

      expect(result).toEqual([true, 0, '']);
    });

    it('returns failure when FRAData reports a system error (exception 2b)', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(userId));
      (FRAData.fetchViewCount as jest.Mock).mockResolvedValue([
        false,
        null,
        'Could not load view count. Please try again.',
      ]);

      const result = await ViewStatisticsController.getViewCount(fraId, userId);

      expect(result[0]).toBe(false);
      expect(result[1]).toBeNull();
      expect(String(result[2])).toMatch(/try again/i);
    });

    it('returns failure when the activity does not exist', async () => {
      getByIdSpy.mockResolvedValue(null);

      const result = await ViewStatisticsController.getViewCount(fraId, userId);

      expect(result).toEqual([false, null, 'Activity not found.']);
      expect(FRAData.fetchViewCount).not.toHaveBeenCalled();
    });

    it('returns failure when the user does not own the activity', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(otherUserId));

      const result = await ViewStatisticsController.getViewCount(fraId, userId);

      expect(result[0]).toBe(false);
      expect(result[1]).toBeNull();
      expect(String(result[2])).toMatch(/not allowed/i);
      expect(FRAData.fetchViewCount).not.toHaveBeenCalled();
    });
  });

  // ===========================================================
  // User Story #33 — View FRA shortlist count
  // ===========================================================
  describe('User Story #33: getShortlistCount', () => {
    it('returns shortlist count when user owns the activity and SavedFRAData succeeds (main flow)', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(userId));
      (SavedFRAData.countShortlists as jest.Mock).mockResolvedValue([true, 7, '']);

      const result = await ViewStatisticsController.getShortlistCount(
        fraId,
        userId,
      );

      expect(result).toEqual([true, 7, '']);
      expect(SavedFRAData.countShortlists).toHaveBeenCalledWith(fraId);
    });

    it('returns 0 and success when there are no shortlists (exception 2a — zero shortlists)', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(userId));
      (SavedFRAData.countShortlists as jest.Mock).mockResolvedValue([true, 0, '']);

      const result = await ViewStatisticsController.getShortlistCount(
        fraId,
        userId,
      );

      expect(result).toEqual([true, 0, '']);
    });

    it('returns failure when SavedFRAData reports a system error (exception 2b)', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(userId));
      (SavedFRAData.countShortlists as jest.Mock).mockResolvedValue([
        false,
        null,
        'Could not load shortlist count. Please try again.',
      ]);

      const result = await ViewStatisticsController.getShortlistCount(
        fraId,
        userId,
      );

      expect(result[0]).toBe(false);
      expect(result[1]).toBeNull();
      expect(String(result[2])).toMatch(/try again/i);
    });

    it('returns failure when the activity does not exist', async () => {
      getByIdSpy.mockResolvedValue(null);

      const result = await ViewStatisticsController.getShortlistCount(
        fraId,
        userId,
      );

      expect(result).toEqual([false, null, 'Activity not found.']);
      expect(SavedFRAData.countShortlists).not.toHaveBeenCalled();
    });

    it('returns failure when the user does not own the activity', async () => {
      getByIdSpy.mockResolvedValue(makeActivity(otherUserId));

      const result = await ViewStatisticsController.getShortlistCount(
        fraId,
        userId,
      );

      expect(result[0]).toBe(false);
      expect(result[1]).toBeNull();
      expect(String(result[2])).toMatch(/not allowed/i);
      expect(SavedFRAData.countShortlists).not.toHaveBeenCalled();
    });
  });
});
