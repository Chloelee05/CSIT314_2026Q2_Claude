import { FRAData, type SavedFRAWithDetails } from '@/lib/entities/FRAData';

/**
 * BCE Controller: ViewFavouriteListController (User Story #28)
 */
export class ViewFavouriteListController {
  /**
   * Delegates to FRAData to retrieve the donee's saved campaigns.
   * Signature matches BCE diagram: getFavouriteList(doneeId): list
   */
  static async getFavouriteList(
    doneeId: string,
  ): Promise<[boolean, string, SavedFRAWithDetails[]]> {
    return FRAData.fetchSavedFRAs(doneeId);
  }
}
