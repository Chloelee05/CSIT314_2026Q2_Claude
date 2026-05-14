import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReportsController } from '@/lib/controllers/ReportsController';
import ReportsPageBoundary from './ReportsPageBoundary';

/**
 * BCE Boundary: ReportsPageBoundary page (User Story #46)
 * Precondition: Platform Manager must be logged in.
 *
 * select Weekly Report & week, click Generate → generateWeeklyReport(start_date, end_date) → showWeeklyReport()
 */
export default async function WeeklyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'platform_management') {
    redirect('/dashboard');
  }

  const { start = '', end = '' } = await searchParams;

  const [report, flash] =
    start && end
      ? await ReportsController.generateWeeklyReport(start, end)
      : [null, ''];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ReportsPageBoundary report={report} flash={flash} />
    </div>
  );
}
