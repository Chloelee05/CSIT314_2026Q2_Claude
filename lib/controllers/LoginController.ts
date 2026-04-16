import { UserProfile } from '@/lib/entities/UserProfile';
import { UserAccount } from '@/lib/entities/UserAccount';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

/**
 * BCE Controller: LoginController
 *
 * Handles the business logic for user authentication.
 *
 * - Login()             → User Story #16 (Admin login via username + role)
 * - authenticateUser()  → User Story #49 (User login via email)
 */
export class LoginController {
  /**
   * User Story #16 — Admin login.
   * Signature matches BCE diagram: Login(username, password, role): tuple
   * Delegates credential verification to UserProfile entity.
   *
   * @returns [success, message]
   */
  static async Login(
    username: string,
    password: string,
    role: string,
  ): Promise<[boolean, string]> {
    const [success, message, user] = await UserProfile.verify_credentials(
      username,
      password,
      role,
    );

    if (!success || !user) {
      return [false, message];
    }

    await createSession({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return [true, 'Successful Login.'];
  }

  /**
   * User Story #49 — User login.
   * Signature matches BCE diagram: authenticateUser(email, pw): boolean
   * Retrieves account via UserAccount.getByEmail(), then verifies password.
   *
   * @returns [success, message]
   */
  static async authenticateUser(
    email: string,
    pw: string,
  ): Promise<[boolean, string]> {
    const user = await UserAccount.getByEmail(email);

    if (!user) {
      return [false, 'Invalid email or password.'];
    }

    if (user.status === 'suspended') {
      return [false, 'Your account has been suspended.'];
    }

    const passwordMatch = await bcrypt.compare(pw, user.password_hash);
    if (!passwordMatch) {
      return [false, 'Invalid email or password.'];
    }

    await createSession({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return [true, 'Successful Login.'];
  }
}
