'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { DailyReport } from '@/lib/entities/ActivityData';

interface Props {
  report: DailyReport | null;
  flash: string;
}

/**
 * BCE Boundary: ReportsPageBoundary (User Story #45)
 *
 * - displayReportOptions() — date picker + Generate Report button
 * - showDailyReport(report_data) — key metrics for the selected date
 *                                   or exception message (flow 5a: no data)
 */
export default function ReportsPageBoundary({ report, flash }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentDate = searchParams.get('date') ?? '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const date = (
      e.currentTarget.elements.namedItem('date') as HTMLInputElement
    ).value;

    startTransition(() => {
      router.push(`/pr/dailyReport/create?date=${date}`);
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
          Daily Report
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a date to generate a daily activity report.
        </p>
      </div>

      {/* displayReportOptions() — date picker + submit */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          name="date"
          type="date"
          defaultValue={currentDate}
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

      {/* showDailyReport(report_data) — key metrics */}
      {report && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Report for{' '}
            <span className="text-indigo-600">
              {new Date(report.date + 'T12:00:00').toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </h2>
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
