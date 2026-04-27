import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateActivityForm from './CreateActivityForm';

/**
 * BCE Boundary: CreateActivityUI — navigatetoCreate() / displayForm()
 * Precondition (use case): Fund Raiser must be logged in with an active session.
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
      <CreateActivityForm />
    </div>
  );
}
