import { FRAData } from '@/lib/entities/FRAData';

/**
 * BCE Controller: SaveFRAController
 */
export class SaveFRAController {
  /**
   * Delegates the save request to the FRAData entity.
   * Returns [success, message].
   */
  static async saveFRA(doneeId: string, fraId: string): Promise<[boolean, string]> {
    return FRAData.save(doneeId, fraId);
  }
}
