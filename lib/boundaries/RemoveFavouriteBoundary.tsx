import Link from 'next/link';
import { removeFavouriteAction } from '@/app/donee/activity/removeSaved/actions';

/**
 * BCE Boundary: RemoveFavouriteBoundary (User Story #29)
 *
 * - process_removeFRA() — renders confirmation form; submits to RemoveFavouriteController
 */
export function RemoveFavouriteBoundary({
  fraId,
  activityTitle,
  hasError,
}: {
  fraId: string;
  activityTitle: string | null;
  hasError: boolean;
}) {
  function process_removeFRA() {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Remove from Favourites</h2>

        {hasError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
            Failed to remove the activity. Please try again.
          </div>
        )}

        {activityTitle ? (
          <>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to remove{' '}
              <span className="font-semibold text-gray-900">&quot;{activityTitle}&quot;</span>{' '}
              from your favourites? This action cannot be undone.
            </p>

            <form action={removeFavouriteAction} className="flex gap-3">
              <input type="hidden" name="fraId" value={fraId} />
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition cursor-pointer"
              >
                Yes, Remove
              </button>
              <Link
                href="/donee/activity/viewSaved"
                className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg text-sm transition"
              >
                Cancel
              </Link>
            </form>
          </>
        ) : (
          <p className="text-gray-500 text-sm mb-6">Activity not found.</p>
        )}
      </div>
    );
  }

  return process_removeFRA();
}
