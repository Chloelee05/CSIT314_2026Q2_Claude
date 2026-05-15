'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface CategoryRow {
  id: string;
  name: string;
  created_at: string;
}

interface Props {
  categories: CategoryRow[];
  flash: string;
}

/**
 * BCE Boundary: SearchCategoriesBoundary (User Story #42)
 *
 * - displaySearchBar() — keyword input + submit button
 * - showSearchResults() — filtered category list (main flow step 5)
 *                         or exception message (flow 4a: "No categories found matching your search.")
 */
export default function SearchCategoriesBoundary({ categories, flash }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentKeyword = searchParams.get('q') ?? '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const keyword = (
      e.currentTarget.elements.namedItem('q') as HTMLInputElement
    ).value;

    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);

    startTransition(() => {
      router.push(`/pr/FRA/searchCategories?${params.toString()}`);
    });
  }

  function displaySearchBar() {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          name="q"
          type="text"
          defaultValue={currentKeyword}
          placeholder="Enter keyword…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          {isPending ? 'Searching…' : 'Search'}
        </button>
      </form>
    );
  }

  function showSearchResults() {
    if (flash) {
      return (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {flash}
        </div>
      );
    }
    if (categories.length === 0) return null;
    return (
      <ul className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {categories.map((cat) => (
          <li
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
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <a
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to dashboard
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Search FRA Categories
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Filter categories by name keyword.
        </p>
      </div>

      {displaySearchBar()}
      {showSearchResults()}
    </div>
  );
}
