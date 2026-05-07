import { deleteSession } from '@/lib/auth';

/**
 * BCE Entity: SessionData (User Story #44)
 * Owns session lifecycle for platform management logout.
 */
export class SessionData {
  static async invalidateSession(_sessionId: string): Promise<boolean> {
    await deleteSession();
    return true;
  }
}
