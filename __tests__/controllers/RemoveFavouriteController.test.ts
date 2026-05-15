import { RemoveFavouriteController } from '@/lib/controllers/RemoveFavouriteController';
import { FRAData } from '@/lib/entities/FRAData';

jest.mock('@/lib/entities/FRAData');

describe('RemoveFavouriteController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #29 — Donee removes a saved/favourite activity
  // RemoveFavouriteController.removeFavourite(doneeId, fraId)
  //   → FRAData.delete(doneeId, fraId)
  // ===========================================================
  describe('User Story #29: removeFavourite', () => {
    it('returns success tuple when activity is removed successfully', async () => {
      (FRAData.delete as jest.Mock).mockResolvedValue([
        true,
        'Activity removed from favourites.',
      ]);

      const [success, message] = await RemoveFavouriteController.removeFavourite(
        'donee1',
        'fra1',
      );

      expect(success).toBe(true);
      expect(message).toBe('Activity removed from favourites.');
      expect(FRAData.delete).toHaveBeenCalledWith('donee1', 'fra1');
    });

    it('returns failure tuple on DB error', async () => {
      (FRAData.delete as jest.Mock).mockResolvedValue([
        false,
        'Failed to remove activity. Please try again.',
      ]);

      const [success, message] = await RemoveFavouriteController.removeFavourite(
        'donee1',
        'fra1',
      );

      expect(success).toBe(false);
      expect(message).toBe('Failed to remove activity. Please try again.');
      expect(FRAData.delete).toHaveBeenCalledWith('donee1', 'fra1');
    });
  });
});
