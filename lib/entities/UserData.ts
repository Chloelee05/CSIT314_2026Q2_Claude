import { createServerClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

export interface UserDataRecord {
  id: string;
  username: string;
  role: string;
}

/**
 * BCE Entity: UserData (User Story #43)
 * Validates Platform Manager credentials against the database.
 */
export class UserData {
  /**
   * US#43 — Verify platform_management credentials.
   * Signature matches BCE diagram: validateCredentials(username, password)
   *
   * @returns [success, message, user | null]
   */
  static async validateCredentials(
    username: string,
    password: string,
  ): Promise<[boolean, string, UserDataRecord | null]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, username, role, password_hash, status')
      .eq('username', username)
      .eq('role', 'platform_management')
      .single();

    if (error || !data) {
      return [false, 'Invalid username or password. Please try again.', null];
    }

    if (data.status === 'suspended') {
      return [
        false,
        'Your account has been suspended. Please contact an administrator.',
        null,
      ];
    }

    const passwordMatch = await bcrypt.compare(password, data.password_hash);
    if (!passwordMatch) {
      return [false, 'Invalid username or password. Please try again.', null];
    }

    return [true, 'Credentials validated.', { id: data.id, username: data.username, role: data.role }];
  }
}
