'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { WeeklyReport } from '@/lib/entities/ActivityData';

interface Props {
  report: WeeklyReport | null;
  flash: string;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * BCE Boundary: ReportsPageBoundary (User Story #46)
 *
 * - displayReportOptions() — week start date picker + Generate Report button
 * - showWeeklyReport(report_data) — key metrics for the selected week
 *                                    or exception message (flow 5a: no data)
 */
export default function ReportsPageBoundary({ report, flash }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStart = searchParams.get('start') ?? '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const start = (
      e.currentTarget.elements.namedItem('start') as HTMLInputElement
    ).value;
    const end = addDays(start, 6);

    startTransition(() => {
      router.push(`/pr/weeklyReport/create?start=${start}&end=${end}`);
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
          Weekly Report
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a week start date to generate a 7-day activity report.
        </p>
      </div>

      {/* displayReportOptions() — date picker + submit */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          name="start"
          type="date"
          defaultValue={currentStart}
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

      {/* showWeeklyReport(report_data) — key metrics */}
      {report && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Week of{' '}
            <span className="text-indigo-600">
              {new Date(report.startDate + 'T12:00:00').toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {' '}–{' '}
            <span className="text-indigo-600">
              {new Date(report.endDate + 'T12:00:00').toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mb-4">7-day summary</p>
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
