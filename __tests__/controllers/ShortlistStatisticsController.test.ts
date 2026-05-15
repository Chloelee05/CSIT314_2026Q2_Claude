import { ShortlistStatisticsController } from '@/lib/controllers/ShortlistStatisticsController';
import { FRAData } from '@/lib/entities/FRAData';

jest.mock('@/lib/entities/FRAData', () => ({
  FRAData: {
    fetchShortlistCount: jest.fn(),
  },
}));

describe('ShortlistStatisticsController', () => {
  const fraId = 'fra-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #33 — View FRA shortlist count
  // ShortlistStatisticsController.getShortlistCount(fraId) → FRAData.fetchShortlistCount(fraId)
  // ===========================================================
  describe('User Story #33: getShortlistCount', () => {
    it('returns shortlist count when FRAData succeeds (main flow)', async () => {
      (FRAData.fetchShortlistCount as jest.Mock).mockResolvedValue([true, 7, '']);

      const result = await ShortlistStatisticsController.getShortlistCount(fraId);

      expect(result).toEqual([true, 7, '']);
      expect(FRAData.fetchShortlistCount).toHaveBeenCalledWith(fraId);
    });

    it('returns 0 and success when there are no shortlists (exception 2a — zero shortlists)', async () => {
      (FRAData.fetchShortlistCount as jest.Mock).mockResolvedValue([true, 0, '']);

      const result = await ShortlistStatisticsController.getShortlistCount(fraId);

      expect(result).toEqual([true, 0, '']);
    });

    it('returns failure when FRAData reports a system error (exception 2b)', async () => {
      (FRAData.fetchShortlistCount as jest.Mock).mockResolvedValue([
        false,
        null,
        'Could not load shortlist count. Please try again.',
      ]);

      const result = await ShortlistStatisticsController.getShortlistCount(fraId);

      expect(result[0]).toBe(false);
      expect(result[1]).toBeNull();
      expect(String(result[2])).toMatch(/try again/i);
    });
  });
});
