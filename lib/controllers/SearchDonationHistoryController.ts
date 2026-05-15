import { Donation, type DonationWithActivity } from '@/lib/entities/Donation';

/**
 * BCE Controller: SearchDonationHistoryController (User Story #36)
 *
 * Coordinates donation history search for a Donee.
 */
export class SearchDonationHistoryController {
  /**
   * Retrieve donation history filtered by keyword.
   * Signature matches BCE diagram: getDonationHistory(): list
   * Delegates to Donation.getByKeyword(keyword, doneeId).
   *
   * @returns [success, message, donations]
   */
  static async getDonationHistory(
    keyword: string,
    doneeId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    return Donation.getByKeyword(keyword, doneeId);
  }
}
