import Link from 'next/link';
import type { SavedFRAWithDetails } from '@/lib/entities/FRAData';

/**
 * BCE Boundary: ViewFavouriteListBoundary (User Story #28)
 *
 * - viewFavourite() — entry point; page navigates donee here
 * - displayFavouriteList(favList) — renders saved campaigns or flashes failure message
 */
export function ViewFavouriteListBoundary({
  success,
  message,
  favList,
}: {
  success: boolean;
  message: string;
  favList: SavedFRAWithDetails[];
}) {
  function viewFavourite() {
    // Donee navigates to the favourites list page via Next.js routing
    return null;
  }

  function displayFavouriteList(list: SavedFRAWithDetails[]) {
    if (!success) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <p className="text-gray-500">{message}</p>
          <Link
            href="/donee/activity/search"
            className="inline-block mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Browse campaigns →
          </Link>
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => {
          const progressPct =
            item.goal_amount > 0
              ? Math.min(100, (item.raised_amount / item.goal_amount) * 100)
              : 0;

          return (
            <div
              key={item.savedId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-base">{item.title}</h3>
                <span
                  className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                    item.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {item.description && (
                <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
              )}

              <div className="mt-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Raised</span>
                  <span className="font-medium text-gray-900">
                    ${item.raised_amount.toLocaleString()} / ${item.goal_amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Saved on {new Date(item.savedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={`/donee/activity/view?id=${item.id}`}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/donee/activity/removeSaved?fraId=${item.id}`}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                  >
                    Remove
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {viewFavourite()}
      {displayFavouriteList(favList)}
    </>
  );
}
