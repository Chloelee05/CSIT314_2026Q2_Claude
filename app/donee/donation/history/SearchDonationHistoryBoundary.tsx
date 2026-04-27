'use client';

import { enterSearchKeyword } from './actions';
import Link from 'next/link';

export default function SearchDonationHistoryBoundary({
  currentKeyword = '',
}: {
  currentKeyword?: string;
}) {
  return (
    <form
      action={enterSearchKeyword}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-end"
    >
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search by Campaign Name
        </label>
        <input
          type="text"
          name="keyword"
          defaultValue={currentKeyword}
          placeholder="Enter campaign name..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition"
        >
          Search
        </button>
        {currentKeyword && (
          <Link
            href="/donee/donation/history"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
