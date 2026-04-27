import { SavedFRAData } from '@/lib/entities/SavedFRAData';

/**
 * BCE Controller: RemoveFavouriteController
 */
export class RemoveFavouriteController {
  /**
   * Delegates the delete request to SavedFRAData.
   * Returns [success, message]
   */
  static async removeFavourite(doneeId: string, fraId: string): Promise<[boolean, string]> {
    return SavedFRAData.delete(doneeId, fraId);
  }
}
