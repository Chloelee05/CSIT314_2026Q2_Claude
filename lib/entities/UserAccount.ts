import { createServerClient } from '@/lib/supabase/server';
import { deleteSession, getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

/**
 * BCE Entity: UserAccount (User Story #6, #7, #49, #50)
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
   * Retrieve all user accounts.
   * Signature matches BCE diagram: getAll(): list
   */
  static async getAll(): Promise<UserAccount[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((d) => new UserAccount(d));
  }

  /**
   * Retrieve a user account by ID.
   * Signature matches BCE diagram: getById(userId: String): UserAccount
   */
  static async getById(userId: string): Promise<UserAccount | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
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
   * Suspend a user account by setting status to 'suspended'.
   * Signature matches BCE diagram: SuspendUserAccount(UserAccount_id): bool
   */
  static async SuspendUserAccount(UserAccount_id: string): Promise<boolean> {
    const supabase = createServerClient();

    const { error } = await supabase
      .from('user_profiles')
      .update({ status: 'suspended', updated_at: new Date().toISOString() })
      .eq('id', UserAccount_id);

    return !error;
  }

  /**
   * Update an existing user account.
   * Signature matches BCE diagram: UpdatedUserAccount(UserAccount_id, NewUserName, NewPassword, NewRole, User_Profile_id): bool
   */
  static async UpdatedUserAccount(
    UserAccount_id: string,
    NewUserName: string,
    NewPassword: string,
    NewRole: string,
    User_Profile_id: string,
  ): Promise<boolean> {
    const supabase = createServerClient();

    // Check username uniqueness, excluding the current user
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', NewUserName)
      .neq('id', UserAccount_id)
      .maybeSingle();

    if (existing) {
      return false;
    }

    const updateData: Record<string, string> = {
      username: NewUserName,
      role: NewRole,
      updated_at: new Date().toISOString(),
    };

    if (NewPassword) {
      updateData.password_hash = await bcrypt.hash(NewPassword, 10);
    }

    const { error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', User_Profile_id);

    return !error;
  }

  /**
   * Fetch the freshly updated user account record.
   * Signature matches BCE diagram: Get_Updated(userAccount_id): UserAccount
   */
  static async Get_Updated(userAccount_id: string): Promise<UserAccount | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userAccount_id)
      .single();

    if (error || !data) {
      return null;
    }

    return new UserAccount(data);
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
