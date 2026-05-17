'use client';

import Link from 'next/link';
import { PageTransition, AnimatedCard } from '@/lib/components/motion';

type ActivityRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  category: string;
  status: string;
  end_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type DoneeViewActivityBoundaryProps = {
  username: string;
  success: boolean;
  message: string;
  activity: ActivityRow | null;
};

/**
 * BCE «Boundary» for User Story #26 (Donee views campaign details).
 *
 * UML class name on diagram: `ViewActivityBoundary` — disambiguated in code as `DoneeViewActivityBoundary`
 * because `lib/boundaries/ViewActivityBoundary.tsx` implements the FR activity **list** (User Story #19).
 *
 * Diagram operations:
 * - process_view() — shell for the view request (navigation chrome, errors, status banners)
 * - show_activity_details() — detailed campaign presentation once data exists
 *
 * Flow: page resolves `activity_id` → ViewActivityController.ViewActivity(activity_id)
 *       → FundraisingActivity.get_activities_details(activity_id), then passes tuple into this boundary.
 */
export default function DoneeViewActivityBoundary({
  username,
  success,
  message,
  activity,
}: DoneeViewActivityBoundaryProps) {
  const backLink = (
    <Link
      href="/donee/activity/search"
      className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
    >
      Back to Campaigns
    </Link>
  );

  function process_view() {
    if (!activity) {
      return (
        <>
          <div className="flex justify-end mb-6">{backLink}</div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-10 text-center">
            <p className="text-red-800 font-semibold text-lg">Activity not found</p>
            <p className="text-red-600 text-sm mt-1">{message}</p>
          </div>
        </>
      );
    }

    const isClosed = !success;

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Campaign Details</h2>
          {backLink}
        </div>

        {isClosed && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 text-yellow-800 font-medium text-sm">
            This campaign is{' '}
            <span className="capitalize font-bold">{activity.status}</span> — {message}
          </div>
        )}
      </>
    );
  }

  function show_activity_details() {
    if (!activity) {
      return null;
    }

    const progressPct =
      activity.goal_amount > 0
        ? Math.min(100, (activity.raised_amount / activity.goal_amount) * 100)
        : 0;

    return (
      <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-900">{activity.title}</h3>
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              activity.status === 'active'
                ? 'bg-green-100 text-green-700'
                : activity.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {activity.status}
          </span>
        </div>

        {activity.description && (
          <p className="text-gray-600 leading-relaxed">{activity.description}</p>
        )}

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Amount Raised</span>
            <span className="font-semibold text-gray-900">
              ${activity.raised_amount.toLocaleString()} of ${activity.goal_amount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progressPct.toFixed(1)}% of goal reached</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          {activity.end_date && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">End Date</p>
              <p className="text-sm text-gray-900 mt-0.5">
                {new Date(activity.end_date).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Campaign ID</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{activity.id}</p>
          </div>
        </div>

        {success && (
          <div className="border-t border-gray-100 pt-4">
            <Link
              href={`/donee/activity/save?id=${activity.id}`}
              className="inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition"
            >
              Save this Campaign
            </Link>
          </div>
        )}
      </AnimatedCard>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header username={username} />
      <PageTransition className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {process_view()}
        {show_activity_details()}
      </PageTransition>
    </div>
  );
}

function Header({ username }: { username: string }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">
          FundRaise <span className="text-indigo-600">Donee</span>
        </h1>
        <span className="text-sm text-gray-600">
          Logged in as <span className="font-medium">{username}</span>
        </span>
      </div>
    </header>
  );
}
