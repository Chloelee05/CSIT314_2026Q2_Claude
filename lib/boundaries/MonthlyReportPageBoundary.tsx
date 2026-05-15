'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { MonthlyReport } from '@/lib/entities/ActivityData';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface Props {
  report: MonthlyReport | null;
  flash: string;
}

/**
 * BCE Boundary: ReportsPageBoundary (User Story #47)
 *
 * - displayReportOptions() — month/year picker + Generate Report button
 * - showMonthlyReport(report_data) — performance metrics for the selected month
 *                                     or exception message (flow 5a: no data)
 */
export default function ReportsPageBoundary({ report, flash }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPeriod = searchParams.get('period') ?? '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const period = (
      e.currentTarget.elements.namedItem('period') as HTMLInputElement
    ).value;

    startTransition(() => {
      router.push(`/pr/monthlyReport/create?period=${period}`);
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <a
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to dashboard
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Monthly Report
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a month and year to generate a performance report.
        </p>
      </div>

      {/* displayReportOptions() — month picker + submit */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          name="period"
          type="month"
          defaultValue={currentPeriod}
          required
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          {isPending ? 'Generating…' : 'Generate Report'}
        </button>
      </form>

      {/* Exception flow 5a — no data */}
      {flash && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {flash}
        </div>
      )}

      {/* showMonthlyReport(report_data) — performance metrics */}
      {report && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            <span className="text-indigo-600">
              {MONTH_NAMES[report.month - 1]} {report.year}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mb-4">Monthly performance summary</p>
          <dl className="divide-y divide-gray-100">
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-600">New Fundraising Activities</dt>
              <dd className="text-sm font-semibold text-gray-900">{report.newActivities}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-600">Donations Made</dt>
              <dd className="text-sm font-semibold text-gray-900">{report.totalDonations}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-600">Total Donation Amount</dt>
              <dd className="text-sm font-semibold text-gray-900">
                ${report.totalDonationAmount.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-600">New User Registrations</dt>
              <dd className="text-sm font-semibold text-gray-900">{report.newUsers}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
