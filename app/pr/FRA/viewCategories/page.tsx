import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ViewCategoryController } from '@/lib/controllers/ViewCategoryController';
import ViewCategoryUI from './ViewCategoryUI';

/**
 * BCE Boundary: ViewCategoryUI page (User Story #39)
 * Precondition: Platform Manager must be logged in with an active session.
 *
 * navigateToCategories() → getCategories() → displayCategoryList()
 */
export default async function ViewCategoriesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'platform_management') {
    redirect('/dashboard');
  }

  const categories = await ViewCategoryController.getCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewCategoryUI categories={categories} />
    </div>
  );
}
