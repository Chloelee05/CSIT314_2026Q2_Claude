import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CategoryController } from '@/lib/controllers/CategoryController';
import SearchCategoriesBoundary from './SearchCategoriesBoundary';

/**
 * BCE Boundary: SearchCategoriesBoundary page (User Story #42)
 * Precondition: Platform Manager must be logged in and FRA categories must exist.
 *
 * enter keyword & submit → searchFRACategories(keyword) → showSearchResults()
 */
export default async function SearchCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'platform_management') {
    redirect('/dashboard');
  }

  const { q = '' } = await searchParams;

  const [categories, flash] = await CategoryController.searchFRACategories(q);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <SearchCategoriesBoundary categories={categories} flash={flash} />
    </div>
  );
}
