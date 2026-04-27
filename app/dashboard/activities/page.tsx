import { getSession } from '@/lib/auth';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import { redirect } from 'next/navigation';
import ActivitiesListClient from './ActivitiesListClient';

/**
 * BCE Boundary: list view — use case step 1 (navigate to activity list)
 * Precondition: FR is logged in and has session (at least one activity optional)
 */
export default async function ActivitiesListPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'fund_raiser') {
    redirect('/dashboard');
  }

  const activities = await FundraisingActivity.listByUserId(session.userId);

  const rows = activities.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    goal_amount: a.goal_amount,
    created_at: a.created_at,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ActivitiesListClient activities={rows} />
    </div>
  );
}
