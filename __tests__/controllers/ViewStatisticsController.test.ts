/**
 * User Story #32 — BCE Controller tests for ViewStatisticsController (view count).
 *
 * For User Story #33 (shortlist / favourite count), see ShortlistStatisticsController.test.ts
 * (diagram: ShortlistStatisticsController / FRAData.fetchShortlistCount — not ViewStatisticsController).
 */
import { ViewStatisticsController } from '@/lib/controllers/ViewStatisticsController';
import { FRAData } from '@/lib/entities/FRAData';

jest.mock('@/lib/entities/FRAData', () => ({
  FRAData: {
    fetchViewCount: jest.fn(),
  },
}));

describe('ViewStatisticsController', () => {
  const fraId = 'fra-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #32 — View FRA view count
  // ViewStatisticsController.getViewCount(fraId) → FRAData.fetchViewCount(fraId)
  // ===========================================================
  describe('User Story #32: getViewCount', () => {
    it('returns view count when FRAData succeeds (main flow)', async () => {
      (FRAData.fetchViewCount as jest.Mock).mockResolvedValue([true, 42, '']);

      const result = await ViewStatisticsController.getViewCount(fraId);

      expect(result).toEqual([true, 42, '']);
      expect(FRAData.fetchViewCount).toHaveBeenCalledWith(fraId);
    });

    it('returns 0 and success when the activity has no views (exception 2a — zero views)', async () => {
      (FRAData.fetchViewCount as jest.Mock).mockResolvedValue([true, 0, '']);

      const result = await ViewStatisticsController.getViewCount(fraId);

      expect(result).toEqual([true, 0, '']);
    });

    it('returns failure when FRAData reports a system error (exception 2b)', async () => {
      (FRAData.fetchViewCount as jest.Mock).mockResolvedValue([
        false,
        null,
        'Could not load view count. Please try again.',
      ]);

      const result = await ViewStatisticsController.getViewCount(fraId);

      expect(result[0]).toBe(false);
      expect(result[1]).toBeNull();
      expect(String(result[2])).toMatch(/try again/i);
    });
  });
});
