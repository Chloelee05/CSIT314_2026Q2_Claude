import { deleteSession } from '@/lib/auth';

/**
 * BCE Entity: UserSession (User Story #31)
 * Owns session lifecycle — invalidation maps to cookie deletion in JWT auth.
 */
export class UserSession {
  static async invalidateSession(_sessionId: string): Promise<boolean> {
    await deleteSession();
    return true;
  }
}
