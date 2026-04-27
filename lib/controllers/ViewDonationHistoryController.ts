import { Donation, type DonationWithActivity } from '@/lib/entities/Donation';

/**
 * BCE Controller: ViewDonationHistoryController (User Story #37)
 */
export class ViewDonationHistoryController {
  /**
   * BCE Method: getDonationHistory
   * Retrieves all donations for the given donee.
   * Returns a tuple: [success, message, donations]
   */
  static async getDonationHistory(
    userId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    return Donation.getByUserId(userId);
  }
}
