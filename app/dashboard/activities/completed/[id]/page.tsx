import { getSession } from '@/lib/auth';
import { ViewCompletedActivityController } from '@/lib/controllers/ViewCompletedActivityController';
import { redirect } from 'next/navigation';
import { ViewCompletedActivityUI } from '../ViewCompletedActivityUI';

/**
 * BCE Boundary: completed activity details — User Story #35
 * getCompletedById (entity) + ownership via ViewCompletedActivityController
 */
export default async function CompletedActivityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: activityId } = await params;
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'fund_raiser') {
    redirect('/dashboard');
  }

  const activity = await ViewCompletedActivityController.getCompletedActivityForUser(
    activityId,
    session.userId,
  );
  if (!activity) {
    redirect('/dashboard/activities/completed');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewCompletedActivityUI
        activity={{
          id: activity.id,
          title: activity.title,
          description: activity.description,
          goal_amount: activity.goal_amount,
          category: activity.category,
          end_date: activity.end_date,
          view_count: activity.view_count,
          created_at: activity.created_at,
          updated_at: activity.updated_at,
        }}
      />
    </div>
  );
}
