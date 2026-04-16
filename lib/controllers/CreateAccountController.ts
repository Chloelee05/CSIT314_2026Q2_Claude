import { UserAccount } from '@/lib/entities/UserAccount';
import bcrypt from 'bcryptjs';

/**
 * BCE Controller: CreateAccountController (User Story #6)
 *
 * Handles the business logic for creating new user accounts.
 * Checks email uniqueness, hashes the password, and delegates
 * persistence to the UserAccount entity.
 */
export class CreateAccountController {
  /**
   * Create a new user account.
   * Signature matches BCE diagram: createAccount(email: String, pw: String): boolean
   *
   * @returns [success, message]
   */
  static async createAccount(
    email: string,
    pw: string,
  ): Promise<[boolean, string]> {
    const existing = await UserAccount.getByEmail(email);
    if (existing) {
      return [false, 'An account with this email already exists.'];
    }

    const passwordHash = await bcrypt.hash(pw, 10);

    const account = new UserAccount({
      id: '',
      username: email.split('@')[0] + '_' + Date.now().toString(36),
      password_hash: passwordHash,
      email,
      role: 'fund_raiser',
      status: 'active',
      full_name: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const saved = await UserAccount.save(account);
    if (!saved) {
      return [false, 'Failed to create account.'];
    }

    return [true, 'Account created'];
  }
}
