'use client';

import { FRACategory } from '@/lib/entities/FRACategory';
import { PageTransition, StaggerList, StaggerItem } from '@/lib/components/motion';

interface Props {
  categories: FRACategory[];
}

/**
 * BCE Boundary: ViewCategoryUI (User Story #39)
 *
 * - ViewCategory()                        — entry point; routing handled by Next.js
 * - displayCategoryList(categories: list) — renders list, or flashes
 *                                           "No FRA categories found." if empty (alt flow)
 */
export default function ViewCategoryUI({ categories }: Props) {
  function ViewCategory() {
    return null;
  }

  function displayCategoryList(categoryList: FRACategory[]) {
    if (categoryList.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500 text-sm">
          No FRA categories found.
        </div>
      );
    }
    return (
      <StaggerList className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {categoryList.map((cat) => (
          <StaggerItem
            key={cat.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <span className="text-sm font-medium text-gray-900">{cat.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">
                {new Date(cat.created_at).toLocaleDateString()}
              </span>
              <a
                href={`/pr/FRA/updateCategories?id=${cat.id}`}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </a>
              <a
                href={`/pr/FRA/deleteCategories?id=${cat.id}`}
                className="text-xs font-medium text-red-600 hover:text-red-800"
              >
                Delete
              </a>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
    );
  }

  return (
    <PageTransition className="max-w-2xl mx-auto">
      {ViewCategory()}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <a
            href="/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to dashboard
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            FRA Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            All categories available for fundraising campaigns.
          </p>
        </div>
        <a
          href="/pr/FRA/createCategories"
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition"
        >
          + New Category
        </a>
      </div>

      {displayCategoryList(categories)}
    </PageTransition>
  );
}
