import { getSession } from '@/lib/auth';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { redirect } from 'next/navigation';
import ViewActivityUI from './ViewActivityUI';

/**
 * BCE Boundary: navigateToActivities / my activities page (User Story #19)
 * Precondition: Fund Raiser is logged in with an active session.
 */
export default async function ActivitiesListPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'fund_raiser') {
    redirect('/dashboard');
  }

  const activities = await ViewActivityController.getActivities(session.userId);

  const rows = activities.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    goal_amount: a.goal_amount,
    created_at: a.created_at,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewActivityUI activities={rows} />
    </div>
  );
}
