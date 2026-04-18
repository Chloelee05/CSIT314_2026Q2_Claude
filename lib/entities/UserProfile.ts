import { createServerClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

/**
 * BCE Entity: UserProfile
 *
 * Represents a user in the system and handles all data-level
 * operations including credential verification against the database.
 */
export class UserProfile {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  status: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;

  constructor(data: Record<string, unknown>) {
    this.id = data.id as string;
    this.username = data.username as string;
    this.password_hash = data.password_hash as string;
    this.role = data.role as string;
    this.status = data.status as string;
    this.email = (data.email as string) ?? null;
    this.full_name = (data.full_name as string) ?? null;
    this.created_at = data.created_at as string;
    this.updated_at = data.updated_at as string;
  }

  /**
   * Create a new user profile with personal details.
   * Signature matches BCE diagram: CreateUserProfile(UserProfile_id, Account_id, Account_Password, DOB, Address, PhoneNumber, Role): bool
   *
   * @returns false if the profile already exists or on DB error
   */
  static async CreateUserProfile(
    UserProfile_id: string,
    Account_id: string,
    Account_Password: string,
    DOB: string,
    Address: string,
    PhoneNumber: string,
    Role: string,
  ): Promise<boolean> {
    const supabase = createServerClient();

    // Alternate flow: check if profile already exists for this account
    const { data: existing } = await supabase
      .from('user_profile_details')
      .select('id')
      .eq('account_id', Account_id)
      .maybeSingle();

    if (existing) {
      return false;
    }

    const insertData: Record<string, string> = {
      account_id: Account_id,
      dob: DOB,
      address: Address,
      phone_number: PhoneNumber,
      role: Role,
    };

    if (UserProfile_id) {
      insertData.id = UserProfile_id;
    }

    const { error } = await supabase.from('user_profile_details').insert(insertData);

    if (error) {
      return false;
    }

    if (Account_Password) {
      const passwordHash = await bcrypt.hash(Account_Password, 10);
      await supabase
        .from('user_profiles')
        .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
        .eq('id', Account_id);
    }

    return true;
  }

  /**
   * Verify user credentials against the database.
   * Signature matches BCE diagram: verify_credentials(username, password, role): tuple
   *
   * @returns [success, message, userProfile | null]
   */
  static async verify_credentials(
    username: string,
    password: string,
    role: string,
  ): Promise<[boolean, string, UserProfile | null]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .eq('role', role)
      .single();

    if (error || !data) {
      return [false, 'Invalid username or role.', null];
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
      return [false, 'Invalid password.', null];
    }

    return [true, 'Credentials verified.', new UserProfile(data)];
  }
}
