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
   * Signature matches BCE diagram: CreateUserProfile(UserProfile_id, Account_id, DOB, Address, PhoneNumber, Role): bool
   *
   * @returns false if the profile already exists or on DB error
   */
  static async CreateUserProfile(
    UserProfile_id: string,
    Account_id: string,
    DOB: string,
    Address: string,
    PhoneNumber: string,
  ): Promise<boolean> {
    const supabase = createServerClient();

    const { data: existing } = await supabase
      .from('user_profile')
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
    };

    if (UserProfile_id) {
      insertData.id = UserProfile_id;
    }

    const { error } = await supabase.from('user_profile').insert(insertData);

    if (error) {
      return false;
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
      .from('user_account')
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

  /**
   * Fetch all profile credentials for the list view.
   */
  static async fetchAllProfiles() {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('user_account')
      .select('id, username, status')
      .order('username');

    if (error) {
      return [];
    }
    return data;
  }


  /**
   * Fetch profile personal particulars.
   * Matches View User Profile BCE sequence: fetchProfile(userId: str): dict
   */
  static async fetchProfile(accountId: string): Promise<Record<string, any> | null> {
    const supabase = createServerClient();
    
    // Fetching the personal particulars based on the system sketch
    const { data, error } = await supabase
      .from('user_profile')
      .select('account_id, dob, address, phone_number')
      .eq('account_id', accountId)
      .single();

    if (error || !data) {
      return null;
    }
    
    return data;
  }

  /**
   * BCE Method: UpdatedUserProfile
   * Updates both the user_profiles (credentials) and user_profile (particulars).
   */
  static async UpdatedUserProfile(
    _UserProfile_id: string,
    NewDOB: string,
    NewAddress: string,
    NewPhoneNumber: string,
    User_Account_id: string
  ): Promise<boolean> {
    const supabase = createServerClient();

    try {
      const detailsUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (NewDOB && NewDOB.trim() !== '') detailsUpdates.dob = NewDOB;
      if (NewAddress && NewAddress.trim() !== '') detailsUpdates.address = NewAddress;
      if (NewPhoneNumber && NewPhoneNumber.trim() !== '') detailsUpdates.phone_number = NewPhoneNumber;

      const { error } = await supabase
        .from('user_profile')
        .update(detailsUpdates)
        .eq('account_id', User_Account_id);

      if (error) return false;

      return true;
    } catch {
      return false;
    }
  }

  /**
   * BCE Method: Get_Updated
   * Retrieves the newly updated profile data as per the sequence diagram.
   */
  static async Get_Updated(UserProfile_id: string): Promise<Record<string, any> | null> {
    const supabase = createServerClient();
    
    // Fetching the joined data to populate the form
    const { data, error } = await supabase
      .from('user_account')
      .select(`
        id, 
        username,
        user_profile ( id, dob, address, phone_number )
      `)
      .eq('id', UserProfile_id)
      .single();

    if (error || !data) return null;
    return data;
  }

  /**
   * BCE Method: SuspendUserProfile
   * Updates the user's status to 'suspended' in the database.
   */
  static async SuspendUserProfile(userprofile_id: string): Promise<boolean> {
    const supabase = createServerClient();

    try {
      const { error } = await supabase
        .from('user_account')
        .update({ 
          status: 'suspended', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userprofile_id);

      if (error) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * BCE Method: SearchUserProfile
   * Searches user profiles based on a keyword and a specific column.
   */
  static async SearchUserProfile(Keyword: string, search_by: string = "FullName"): Promise<any[]> {
    const supabase = createServerClient();
    
    // Map the BCE diagram's "search_by" strings to actual database columns
    let dbColumn = "full_name";
    if (search_by === "FullName") dbColumn = "full_name";
    if (search_by === "ID") dbColumn = "id";
    if (search_by === "Role") dbColumn = "role";
    if (search_by === "Username") dbColumn = "username";

    let query = supabase.from('user_account').select('id, username, status');

    if (Keyword && Keyword.trim() !== '') {
      if (dbColumn === 'id') {
        // UUIDs require exact match
        query = query.eq('id', Keyword.trim());
      } else {
        // Text columns can use partial matching (ilike is case-insensitive)
        query = query.ilike(dbColumn, `%${Keyword.trim()}%`);
      }
    }

    const { data, error } = await query;
    
    if (error) {
      return [];
    }

    return data || [];
  }

}
