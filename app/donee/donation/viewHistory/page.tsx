import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ViewDonationHistoryController } from '@/lib/controllers/ViewDonationHistoryController';
import { ViewDonationHistoryBoundary } from '@/lib/boundaries/ViewDonationHistoryBoundary';
import Link from 'next/link';

/**
 * BCE page: ViewDonationHistoryBoundary — User Story #37
 * process_view() → ViewDonationHistory() → displayDonationHistory(donations)
 */
export default async function ViewDonationHistoryPage() {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const [success, message, donations] =
    await ViewDonationHistoryController.ViewDonationHistory(session.userId);

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
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation History</h2>

        <ViewDonationHistoryBoundary
          success={success}
          message={message}
          donations={donations}
        />
      </main>
    </div>
  );
}
