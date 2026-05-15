import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginPageBoundary from '@/lib/boundaries/LoginPageBoundary';

/**
 * BCE Boundary: LoginPageBoundary page (User Story #43)
 * Precondition: Platform Manager must have a valid registered account.
 */
export default async function PmLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  const { message } = await searchParams;

  return <LoginPageBoundary logoutMessage={message} />;
}
