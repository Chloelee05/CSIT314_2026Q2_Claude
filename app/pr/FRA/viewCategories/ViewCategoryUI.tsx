import { FRACategory } from '@/lib/entities/FRACategory';

interface Props {
  categories: FRACategory[];
}

/**
 * BCE Boundary: ViewCategoryUI (User Story #39)
 *
 * - displayCategoryList(categories) — renders the full list (sequence step 6)
 * - displayMessage('No FRA categories found.') — alt flow when list is empty (step 7)
 */
export default function ViewCategoryUI({ categories }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
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

      {/* displayMessage — alt flow 2a: no categories found (sequence step 7) */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500 text-sm">
          No FRA categories found.
        </div>
      ) : (
        /* displayCategoryList — main flow (sequence step 6) */
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
      )}
    </div>
  );
}
