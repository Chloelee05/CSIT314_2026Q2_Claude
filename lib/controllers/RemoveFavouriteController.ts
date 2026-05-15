import { FRAData } from '@/lib/entities/FRAData';

/**
 * BCE Controller: RemoveFavouriteController (User Story #29)
 */
export class RemoveFavouriteController {
  /**
   * Delegates the delete request to FRAData.
   * Signature matches BCE diagram: removeFavourite(doneeId, fraId): tuple
   */
  static async removeFavourite(doneeId: string, fraId: string): Promise<[boolean, string]> {
    return FRAData.delete(doneeId, fraId);
  }
}
