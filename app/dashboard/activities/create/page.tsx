import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateActivityBoundary from '@/lib/boundaries/CreateActivityBoundary';

/**
 * Route shell for User Story #18: renders CreateActivityBoundary (create_activity → create_activity_form).
 * Precondition: Fund Raiser session (role fund_raiser).
 */
export default async function CreateActivityPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'fund_raiser') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <CreateActivityBoundary />
    </div>
  );
}
