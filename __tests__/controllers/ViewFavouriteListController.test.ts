import { ViewFavouriteListController } from '@/lib/controllers/ViewFavouriteListController';
import { FRAData, type SavedFRAWithDetails } from '@/lib/entities/FRAData';

jest.mock('@/lib/entities/FRAData');

describe('ViewFavouriteListController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSaved: SavedFRAWithDetails = {
    savedId: 's1',
    savedAt: '2025-06-01T00:00:00Z',
    id: 'fra1',
    title: 'Plant Trees',
    description: 'Help plant trees',
    goal_amount: 1000,
    raised_amount: 200,
    status: 'active',
    end_date: null,
  };

  // ===========================================================
  // User Story #28 — Donee views saved/favourite activity list
  // ViewFavouriteListController.getFavouriteList(doneeId)
  //   → FRAData.fetchSavedFRAs(doneeId)
  // ===========================================================
  describe('User Story #28: getFavouriteList', () => {
    it('returns success tuple with saved list when donee has favourites', async () => {
      (FRAData.fetchSavedFRAs as jest.Mock).mockResolvedValue([
        true,
        'Favourites retrieved.',
        [mockSaved],
      ]);

      const [success, message, list] =
        await ViewFavouriteListController.getFavouriteList('donee1');

      expect(success).toBe(true);
      expect(message).toBe('Favourites retrieved.');
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe('fra1');
      expect(FRAData.fetchSavedFRAs).toHaveBeenCalledWith('donee1');
    });

    it('returns failure tuple with empty list when favourite list is empty', async () => {
      (FRAData.fetchSavedFRAs as jest.Mock).mockResolvedValue([
        false,
        'Your favourite list is empty.',
        [],
      ]);

      const [success, message, list] =
        await ViewFavouriteListController.getFavouriteList('donee1');

      expect(success).toBe(false);
      expect(message).toBe('Your favourite list is empty.');
      expect(list).toEqual([]);
    });

    it('returns failure tuple with empty list on DB error', async () => {
      (FRAData.fetchSavedFRAs as jest.Mock).mockResolvedValue([
        false,
        'Failed to retrieve your favourites. Please try again.',
        [],
      ]);

      const [success, message, list] =
        await ViewFavouriteListController.getFavouriteList('donee1');

      expect(success).toBe(false);
      expect(message).toBe('Failed to retrieve your favourites. Please try again.');
      expect(list).toEqual([]);
    });
  });
});
