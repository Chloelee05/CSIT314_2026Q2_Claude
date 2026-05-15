import { getSession } from '@/lib/auth';
import { ViewCompletedActivityController } from '@/lib/controllers/ViewCompletedActivityController';
import { SearchCompleteActivityController } from '@/lib/controllers/SearchCompleteActivityController';
import { redirect } from 'next/navigation';
import { ViewCompletedActivityBoundary } from '@/lib/boundaries/ViewCompletedActivityBoundary';
import { SearchCompleteActivityBoundary } from '@/lib/boundaries/SearchCompleteActivityBoundary';

/**
 * BCE page — User Story #35 (no query: ViewCompletedActivityBoundary)
 *                            + User Story #34 (with query: SearchCompleteActivityBoundary)
 */
export default async function CompletedActivitiesPage({
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

  if (q.trim()) {
    // US#34: SearchCompleteActivity
    const [activities, emptyStateMessage] =
      await SearchCompleteActivityController.SearchCompleteActivity(
        q,
        session.userId,
      );

    const rows = activities.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      goal_amount: a.goal_amount,
      end_date: a.end_date,
    }));

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <SearchCompleteActivityBoundary
          activities={rows}
          initialQuery={q}
          emptyStateMessage={emptyStateMessage}
        />
      </div>
    );
  }

  // US#35: ViewCompletedActivity
  const activities = await ViewCompletedActivityController.getCompletedActivity(
    session.userId,
  );

  const rows = activities.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    goal_amount: a.goal_amount,
    end_date: a.end_date,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewCompletedActivityBoundary activities={rows} />
    </div>
  );
}
