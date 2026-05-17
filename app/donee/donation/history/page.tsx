import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SearchDonationHistoryController } from '@/lib/controllers/SearchDonationHistoryController';
import { SearchDonationHistoryBoundary } from '@/lib/boundaries/SearchDonationHistoryBoundary';
import Link from 'next/link';

/**
 * BCE page: SearchDonationHistoryBoundary — User Story #36
 * process_search() → getDonationHistory(keyword) → displaySearchResults(donations)
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

  const [success, message, donations] =
    await SearchDonationHistoryController.getDonationHistory(
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
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Donation History</h2>
        </div>

        <SearchDonationHistoryBoundary
          donations={donations}
          keyword={keyword}
          success={success}
          message={message}
        />
      </main>
    </div>
  );
}
