import { SavedFRAData, type SavedFRAWithDetails } from '@/lib/entities/SavedFRAData';

/**
 * BCE Controller: ViewFavouriteListController
 */
export class ViewFavouriteListController {
  /**
   * Delegates to SavedFRAData to retrieve the donee's saved campaigns.
   * Returns [success, message, savedList]
   */
  static async getFavouriteList(
    doneeId: string,
  ): Promise<[boolean, string, SavedFRAWithDetails[]]> {
    return SavedFRAData.fetchSavedFRAs(doneeId);
  }
}
