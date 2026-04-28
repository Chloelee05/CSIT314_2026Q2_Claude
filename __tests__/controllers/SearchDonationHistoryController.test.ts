import { SearchDonationHistoryController } from '@/lib/controllers/SearchDonationHistoryController';
import { Donation, type DonationWithActivity } from '@/lib/entities/Donation';

jest.mock('@/lib/entities/Donation');

describe('SearchDonationHistoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDonation: DonationWithActivity = {
    id: 'don1',
    donee_id: 'donee1',
    fra_id: 'fra1',
    amount: 50,
    donated_at: '2025-06-01T10:00:00Z',
    campaign_title: 'Save the Forest',
    campaign_status: 'active',
  };

  // ===========================================================
  // User Story #36 — Donee searches donation history by keyword
  // SearchDonationHistoryController.searchDonations(keyword, doneeId)
  //   → Donation.getByKeyword(keyword, doneeId)
  // ===========================================================
  describe('User Story #36: searchDonations', () => {
    it('returns success tuple with matching donations when keyword matches', async () => {
      (Donation.getByKeyword as jest.Mock).mockResolvedValue([
        true,
        'Donations found.',
        [mockDonation],
      ]);

      const [success, message, donations] =
        await SearchDonationHistoryController.searchDonations('forest', 'donee1');

      expect(success).toBe(true);
      expect(message).toBe('Donations found.');
      expect(donations).toHaveLength(1);
      expect(donations[0].campaign_title).toBe('Save the Forest');
      expect(Donation.getByKeyword).toHaveBeenCalledWith('forest', 'donee1');
    });

    it('returns all donations when keyword is empty', async () => {
      const list = [mockDonation, { ...mockDonation, id: 'don2', campaign_title: 'Build School' }];
      (Donation.getByKeyword as jest.Mock).mockResolvedValue([
        true,
        'Donations found.',
        list,
      ]);

      const [success, message, donations] =
        await SearchDonationHistoryController.searchDonations('', 'donee1');

      expect(success).toBe(true);
      expect(donations).toHaveLength(2);
      expect(Donation.getByKeyword).toHaveBeenCalledWith('', 'donee1');
    });

    it('returns failure tuple when no donations match keyword (Exception 4a)', async () => {
      (Donation.getByKeyword as jest.Mock).mockResolvedValue([
        false,
        'No matching donations found.',
        [],
      ]);

      const [success, message, donations] =
        await SearchDonationHistoryController.searchDonations('nomatch', 'donee1');

      expect(success).toBe(false);
      expect(message).toBe('No matching donations found.');
      expect(donations).toEqual([]);
    });

    it('returns failure tuple on DB error', async () => {
      (Donation.getByKeyword as jest.Mock).mockResolvedValue([
        false,
        'Failed to fetch donation history.',
        [],
      ]);

      const [success, message, donations] =
        await SearchDonationHistoryController.searchDonations('anything', 'donee1');

      expect(success).toBe(false);
      expect(message).toBe('Failed to fetch donation history.');
      expect(donations).toEqual([]);
    });
  });
});
