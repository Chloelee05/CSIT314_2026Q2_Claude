'use client';

import Link from 'next/link';
import { type DonationWithActivity } from '@/lib/entities/Donation';

/**
 * BCE Boundary: SearchDonationHistoryBoundary (User Story #36)
 *
 * - process_search()              — GET form for keyword search
 * - displaySearchResults(donations: list) — list or alternate-flow flash
 */
export function SearchDonationHistoryBoundary({
  donations,
  keyword,
  success,
  message,
}: {
  donations: DonationWithActivity[];
  keyword: string;
  success: boolean;
  message: string;
}) {
  function process_search(kw: string) {
    return (
      <form
        method="GET"
        action="/donee/donation/history"
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-end"
      >
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Campaign Name
          </label>
          <input
            type="text"
            name="keyword"
            defaultValue={kw}
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
          {kw && (
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

  function displaySearchResults(donationList: DonationWithActivity[]) {
    if (!success && keyword) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800 font-medium">No donation history found.</p>
          <p className="text-yellow-600 text-sm mt-1">
            No donations match &quot;{keyword}&quot;. Try a different keyword.
          </p>
        </div>
      );
    }
    if (!success) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <p className="text-gray-500">
            {message === 'No matching donations found.'
              ? 'You have no donation history yet.'
              : 'Enter a keyword above to search your donation history.'}
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        {donationList.map((donation) => (
          <div
            key={donation.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <h3 className="font-semibold text-gray-900">{donation.campaign_title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date(donation.donated_at).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  donation.campaign_status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {donation.campaign_status.charAt(0).toUpperCase() +
                  donation.campaign_status.slice(1)}
              </span>
              <span className="text-indigo-600 font-semibold text-base">
                ${Number(donation.amount).toLocaleString('en-AU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {process_search(keyword)}
      {displaySearchResults(donations)}
    </>
  );
}
