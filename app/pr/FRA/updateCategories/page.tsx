import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { FRACategory } from '@/lib/entities/FRACategory';
import UpdateCategoryUI from './UpdateCategoryUI';

/**
 * BCE Boundary: UpdateCategoryUI page (User Story #40)
 * Precondition: Platform Manager must be logged in with an active session.
 *
 * Reached via /pr/FRA/updateCategories?id=<categoryId>
 */
export default async function UpdateCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'platform_management') {
    redirect('/dashboard');
  }

  const { id } = await searchParams;
  if (!id) {
    redirect('/pr/FRA/viewCategories');
  }

  const category = await FRACategory.getById(id);
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <UpdateCategoryUI categoryId={category.id} currentName={category.name} />
    </div>
  );
}
