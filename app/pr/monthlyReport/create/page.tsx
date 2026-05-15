import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReportsController } from '@/lib/controllers/ReportsController';
import ReportsPageBoundary from '@/lib/boundaries/MonthlyReportPageBoundary';

/**
 * BCE Boundary: ReportsPageBoundary page (User Story #47)
 * Precondition: Platform Manager must be logged in.
 *
 * select Monthly Report & month/year, click Generate
 *   → generateMonthlyReport(month, year) → showMonthlyReport()
 */
export default async function MonthlyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'platform_management') {
    redirect('/dashboard');
  }

  const { period = '' } = await searchParams;

  let report = null;
  let flash = '';

  if (period) {
    const [yearStr, monthStr] = period.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    [report, flash] = await ReportsController.generateMonthlyReport(month, year);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ReportsPageBoundary report={report} flash={flash} />
    </div>
  );
}
