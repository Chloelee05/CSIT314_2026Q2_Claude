import { Donation, type DonationWithActivity } from '@/lib/entities/Donation';

/**
 * BCE Controller: ViewDonationHistoryController (User Story #37)
 *
 * Coordinates full donation history retrieval for a Donee.
 */
export class ViewDonationHistoryController {
  /**
   * Retrieve all donations for the given donee.
   * Signature matches BCE diagram: ViewDonationHistory(): list
   * Delegates to Donation.fetchDonationHistory(userId).
   *
   * @returns [success, message, donations]
   */
  static async ViewDonationHistory(
    userId: string,
  ): Promise<[boolean, string, DonationWithActivity[]]> {
    return Donation.fetchDonationHistory(userId);
  }
}
