import { createServerClient } from '@/lib/supabase/server';
import { deleteSession, getSession } from '@/lib/auth';

/**
 * BCE Entity: UserAccount (User Story #6, #49, #50)
 *
 * Represents a user account in the system.
 * Provides data-access methods, persistence, and session management.
 */
export class UserAccount {
  id: string;
  username: string;
  password_hash: string;
  email: string;
  role: string;
  status: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;

  constructor(data: Record<string, unknown>) {
    this.id = data.id as string;
    this.username = data.username as string;
    this.password_hash = data.password_hash as string;
    this.email = data.email as string;
    this.role = data.role as string;
    this.status = data.status as string;
    this.full_name = (data.full_name as string) ?? null;
    this.created_at = data.created_at as string;
    this.updated_at = data.updated_at as string;
  }

  /**
   * Retrieve a user account by email address.
   * Signature matches BCE diagram: getByEmail(email: String): UserAccount
   */
  static async getByEmail(email: string): Promise<UserAccount | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return new UserAccount(data);
  }

  /**
   * Persist a new user account to the database.
   * Signature matches BCE diagram: save(account: UserAccount): boolean
   */
  static async save(account: UserAccount): Promise<boolean> {
    const supabase = createServerClient();

    const { error } = await supabase.from('user_profiles').insert({
      username: account.username,
      password_hash: account.password_hash,
      email: account.email,
      role: account.role,
      status: account.status,
      full_name: account.full_name,
    });

    return !error;
  }

  /**
   * Destroy the current user session.
   * Signature matches BCE diagram: clearSession(): boolean
   *
   * @returns true if session was cleared, false if already expired
   */
  static async clearSession(): Promise<boolean> {
    const session = await getSession();

    if (!session) {
      return false;
    }

    await deleteSession();
    return true;
  }
}
