import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReportsController } from '@/lib/controllers/ReportsController';
import ReportsPageBoundary from '@/lib/boundaries/DailyReportPageBoundary';

/**
 * BCE Boundary: ReportsPageBoundary page (User Story #45)
 * Precondition: Platform Manager must be logged in.
 *
 * select Daily Report & date, click Generate → generateDailyReport(date) → showDailyReport()
 */
export default async function DailyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'platform_management') {
    redirect('/dashboard');
  }

  const { date = '' } = await searchParams;

  const [report, flash] = date
    ? await ReportsController.generateDailyReport(date)
    : [null, ''];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ReportsPageBoundary report={report} flash={flash} />
    </div>
  );
}
