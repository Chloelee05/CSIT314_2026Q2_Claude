'use server';

import { CreateAccountController } from '@/lib/controllers/CreateAccountController';
import { createServerClient } from '@/lib/supabase/server';

export interface CreateAccountState {
  success: boolean;
  message: string;
}

/**
 * BCE Boundary action: submitDetails(email, pw)
 *
 * RegistrationUI → CreateAccountController: createAccount(email, pw)
 * Then sets additional account details (name, role) collected from the form.
 */
export async function createAccountAction(
  _prevState: CreateAccountState,
  formData: FormData,
): Promise<CreateAccountState> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!email || !password || !fullName || !role) {
    return { success: false, message: 'All fields are required.' };
  }

  // BCE: RegistrationUI → CreateAccountController: createAccount(email, pw)
  const [success, message] = await CreateAccountController.createAccount(
    email,
    password,
  );

  if (!success) {
    // displayResult("Email already exists")
    return { success: false, message };
  }

  // Set additional account details from the form (name, role)
  const supabase = createServerClient();
  await supabase
    .from('user_profiles')
    .update({ full_name: fullName, role })
    .eq('email', email);

  // displayResult("Account created")
  return { success: true, message: 'Account created' };
}
