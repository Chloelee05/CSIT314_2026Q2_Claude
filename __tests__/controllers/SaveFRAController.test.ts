import { SaveFRAController } from '@/lib/controllers/SaveFRAController';
import { SavedFRAData } from '@/lib/entities/SavedFRAData';

jest.mock('@/lib/entities/SavedFRAData');

describe('SaveFRAController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #27 — Donee saves a fundraising activity
  // SaveFRAController.saveFRA(doneeId, fraId)
  //   → SavedFRAData.save(doneeId, fraId)
  // ===========================================================
  describe('User Story #27: saveFRA', () => {
    it('returns success tuple when activity is saved for the first time', async () => {
      (SavedFRAData.save as jest.Mock).mockResolvedValue([
        true,
        'Activity saved successfully.',
      ]);

      const [success, message] = await SaveFRAController.saveFRA('donee1', 'fra1');

      expect(success).toBe(true);
      expect(message).toBe('Activity saved successfully.');
      expect(SavedFRAData.save).toHaveBeenCalledWith('donee1', 'fra1');
    });

    it('returns failure tuple when activity is already saved', async () => {
      (SavedFRAData.save as jest.Mock).mockResolvedValue([false, 'Already saved']);

      const [success, message] = await SaveFRAController.saveFRA('donee1', 'fra1');

      expect(success).toBe(false);
      expect(message).toBe('Already saved');
      expect(SavedFRAData.save).toHaveBeenCalledWith('donee1', 'fra1');
    });

    it('returns failure tuple on DB error', async () => {
      (SavedFRAData.save as jest.Mock).mockResolvedValue([
        false,
        'Failed to save activity. Please try again.',
      ]);

      const [success, message] = await SaveFRAController.saveFRA('donee1', 'fra1');

      expect(success).toBe(false);
      expect(message).toBe('Failed to save activity. Please try again.');
    });
  });
});
