import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SearchDonationHistoryController } from '@/lib/controllers/SearchDonationHistoryController';
import SearchDonationHistoryBoundary from './SearchDonationHistoryBoundary';
import Link from 'next/link';

/**
 * BCE Boundary: SearchDonationHistoryUI (User Story #36)
 * displaySearchResults(donations) — renders search form + donation history list.
 */
export default async function SearchDonationHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const keyword = resolvedParams.keyword ?? '';

  const [success, message, donations] = await SearchDonationHistoryController.searchDonations(
    keyword,
    session.userId,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            FundRaise <span className="text-indigo-600">Donee</span>
          </h1>
          <span className="text-sm text-gray-600">
            Logged in as <span className="font-medium">{session.username}</span>
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Donation History</h2>
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        <SearchDonationHistoryBoundary currentKeyword={keyword} />

        {/* displaySearchResults(donations) */}
        {!success && keyword ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 font-medium">No matching donations found.</p>
            <p className="text-yellow-600 text-sm mt-1">
              No donations match &quot;{keyword}&quot;. Try a different keyword.
            </p>
          </div>
        ) : !success && !keyword ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">{message === 'No matching donations found.' ? 'You have no donation history yet.' : 'Enter a keyword above to search your donation history.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {donations.map((donation) => (
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
        )}
      </main>
    </div>
  );
}
