import { SavedFRAData } from '@/lib/entities/SavedFRAData';

/**
 * BCE Controller: SaveFRAController
 */
export class SaveFRAController {
  /**
   * Delegates the save request to the SavedFRAData entity.
   * Returns [success, message].
   */
  static async saveFRA(doneeId: string, fraId: string): Promise<[boolean, string]> {
    return SavedFRAData.save(doneeId, fraId);
  }
}
