import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateCategoryUI from './CreateCategoryUI';

/**
 * BCE Boundary: CreateCategoryUI page (User Story #38)
 * Precondition: Platform Manager must be logged in with an active session.
 */
export default async function CreateCategoriesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'platform_management') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <CreateCategoryUI />
    </div>
  );
}
