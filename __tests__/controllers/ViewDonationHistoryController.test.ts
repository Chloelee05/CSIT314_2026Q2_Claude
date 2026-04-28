import { ViewDonationHistoryController } from '@/lib/controllers/ViewDonationHistoryController';
import { Donation, type DonationWithActivity } from '@/lib/entities/Donation';

jest.mock('@/lib/entities/Donation');

describe('ViewDonationHistoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDonation: DonationWithActivity = {
    id: 'don1',
    donee_id: 'donee1',
    fra_id: 'fra1',
    amount: 100,
    donated_at: '2025-05-01T08:00:00Z',
    campaign_title: 'Feed the Hungry',
    campaign_status: 'completed',
  };

  // ===========================================================
  // User Story #37 — Donee views complete donation history
  // ViewDonationHistoryController.getDonationHistory(userId)
  //   → Donation.getByUserId(userId)
  // ===========================================================
  describe('User Story #37: getDonationHistory', () => {
    it('returns success tuple with all donations when history exists', async () => {
      (Donation.getByUserId as jest.Mock).mockResolvedValue([
        true,
        'Donation history found.',
        [mockDonation],
      ]);

      const [success, message, donations] =
        await ViewDonationHistoryController.getDonationHistory('donee1');

      expect(success).toBe(true);
      expect(message).toBe('Donation history found.');
      expect(donations).toHaveLength(1);
      expect(donations[0].campaign_title).toBe('Feed the Hungry');
      expect(Donation.getByUserId).toHaveBeenCalledWith('donee1');
    });

    it('returns failure tuple with empty list when no donation history exists', async () => {
      (Donation.getByUserId as jest.Mock).mockResolvedValue([
        false,
        'No donation history found.',
        [],
      ]);

      const [success, message, donations] =
        await ViewDonationHistoryController.getDonationHistory('donee1');

      expect(success).toBe(false);
      expect(message).toBe('No donation history found.');
      expect(donations).toEqual([]);
    });

    it('returns failure tuple on DB error', async () => {
      (Donation.getByUserId as jest.Mock).mockResolvedValue([
        false,
        'Failed to fetch donation history.',
        [],
      ]);

      const [success, message, donations] =
        await ViewDonationHistoryController.getDonationHistory('donee1');

      expect(success).toBe(false);
      expect(message).toBe('Failed to fetch donation history.');
      expect(donations).toEqual([]);
    });
  });
});
