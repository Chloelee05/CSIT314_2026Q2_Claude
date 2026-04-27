import { getSession } from '@/lib/auth';
import { ViewCompletedActivityController } from '@/lib/controllers/ViewCompletedActivityController';
import { redirect } from 'next/navigation';
import { SearchActivityUI } from './SearchActivityUI';

/**
 * BCE Boundary: completed list + search — User Story #34, #35
 * #35: getCompletedActivities / list + alt. empty message; open detail at completed/[id]
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
    await ViewCompletedActivityController.getCompletedActivitiesWithMessage(
      session.userId,
      q,
    );

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
