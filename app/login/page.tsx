import LoginBoundary from '@/lib/boundaries/LoginBoundary';

/**
 * Login page (server component).
 * Reads the logout success message from URL search params
 * and passes it to the LoginForm boundary component.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  return <LoginBoundary logoutMessage={params.message} />;
}
