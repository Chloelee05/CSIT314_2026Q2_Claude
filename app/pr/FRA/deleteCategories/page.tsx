import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { FRACategory } from '@/lib/entities/FRACategory';
import ManageCategoriesBoundary from './ManageCategoriesBoundary';

/**
 * BCE Boundary: ManageCategoriesBoundary page (User Story #41)
 * Precondition: Platform Manager must be logged in and at least one category must exist.
 *
 * Reached via /pr/FRA/deleteCategories?id=<categoryId>
 * Loads category details and checks active FRA usage before rendering the confirm dialog.
 */
export default async function DeleteCategoriesPage({
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

  const isInUse = await FRACategory.isInUseByActiveFRAs(category.name);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ManageCategoriesBoundary
        categoryId={category.id}
        categoryName={category.name}
        isInUse={isInUse}
      />
    </div>
  );
}
