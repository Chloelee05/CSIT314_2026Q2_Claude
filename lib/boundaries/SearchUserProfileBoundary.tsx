'use client';

import { searchProfilesAction } from '@/app/admin/profile/search/actions';
import Link from 'next/link';

interface Props {
  currentKeyword?: string;
  currentSearchBy?: string;
}

/**
 * BCE Boundary: SearchUserProfileBoundary (User Story #15)
 *
 * - SearchUserProfile() — form submission triggers
 *   SearchUserProfileController.SearchUserProfile(Keyword, search_by)
 */
export default function SearchUserProfileBoundary({
  currentKeyword = '',
  currentSearchBy = 'FullName',
}: Props) {
  function SearchUserProfile() {
    return (
      <form
        action={searchProfilesAction}
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-end"
      >
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Keyword</label>
          <input
            type="text"
            name="Keyword"
            defaultValue={currentKeyword}
            placeholder="Enter search term…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search By</label>
          <select
            name="search_by"
            defaultValue={currentSearchBy}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          >
            <option value="FullName">Full Name</option>
            <option value="Username">Username</option>
            <option value="Role">Role</option>
            <option value="ID">System ID</option>
          </select>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition cursor-pointer"
          >
            Search
          </button>
          {currentKeyword && (
            <Link
              href="/admin/profile"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition"
            >
              Clear
            </Link>
          )}
        </div>
      </form>
    );
  }

  return SearchUserProfile();
}
