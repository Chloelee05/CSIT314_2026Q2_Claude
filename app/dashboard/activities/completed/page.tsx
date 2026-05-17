import { getSession } from '@/lib/auth';
import { ViewCompletedActivityController } from '@/lib/controllers/ViewCompletedActivityController';
import { SearchCompleteActivityController } from '@/lib/controllers/SearchCompleteActivityController';
import { redirect } from 'next/navigation';
import { SearchCompleteActivityBoundary } from '@/lib/boundaries/SearchCompleteActivityBoundary';

/**
 * BCE page — User Stories #34 + #35:
 * Same boundary always renders the completed-activity search bar (GET `q`).
 * No query uses ViewCompletedActivityController list; query uses SearchCompleteActivityController.
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

  let activities;
  let emptyStateMessage: string | null;

  if (q.trim()) {
    const result = await SearchCompleteActivityController.SearchCompleteActivity(
      q,
      session.userId,
    );
    activities = result[0];
    emptyStateMessage = result[1];
  } else {
    activities = await ViewCompletedActivityController.getCompletedActivity(
      session.userId,
    );
    emptyStateMessage = null;
  }

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
