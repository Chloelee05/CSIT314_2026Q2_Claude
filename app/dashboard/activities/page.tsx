import { getSession } from '@/lib/auth';
import { SearchActivityController } from '@/lib/controllers/SearchActivityController';
import { redirect } from 'next/navigation';
import ViewActivityUI from './ViewActivityUI';

/**
 * BCE Boundary: activity list + search (User Story #19, #22)
 * Precondition: Fund Raiser is logged in (search applies to their activities only).
 */
export default async function ActivitiesListPage({
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

  const [activities, searchFlash] = await SearchActivityController.SearchActivity(
    q,
    session.userId,
  );

  const rows = activities.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    goal_amount: a.goal_amount,
    created_at: a.created_at,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewActivityUI
        activities={rows}
        initialQuery={q}
        searchEmptyFlash={searchFlash}
      />
    </div>
  );
}
