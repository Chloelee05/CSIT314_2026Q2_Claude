import { Donation, type DonationWithActivity } from '@/lib/entities/Donation';

/**
 * BCE Controller: SearchDonationHistoryController (User Story #36)
 */
export class SearchDonationHistoryController {
  /**
   * BCE Method: searchDonations
   * Delegates the search request to the Donation entity.
   * Returns a tuple: [success, message, donations]
   */
  static async searchDonations(
    keyword: string,
    doneeId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    return Donation.getByKeyword(keyword, doneeId);
  }
}
