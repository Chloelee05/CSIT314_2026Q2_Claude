import { getSession } from '@/lib/auth';
import { SearchActivityController } from '@/lib/controllers/SearchActivityController';
import { redirect } from 'next/navigation';
import { SearchActivityUI } from './SearchActivityUI';

/**
 * BCE Boundary: search page — User Story #34
 * Sequence: enterSearchKeyword → searchCompletedActivities → getCompletedByKeyword → displaySearchResults
 */
export default async function CompletedFundraisingSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'fund_raiser') {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const q = params.q ?? '';

  const [activities, emptyStateMessage] =
    await SearchActivityController.searchCompletedActivities(q, session.userId);

  const rows = activities.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    goal_amount: a.goal_amount,
    end_date: a.end_date,
    created_at: a.created_at,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <SearchActivityUI
        activities={rows}
        initialQuery={q}
        emptyStateMessage={emptyStateMessage}
      />
    </div>
  );
}
