import { getSession } from '@/lib/auth';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { redirect } from 'next/navigation';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import { ViewActivityDetailsUI } from './ViewActivityDetailsUI';

/**
 * BCE Boundary: displayActivityDetails (User Story #19)
 * Sequence: selectActivity → ViewActivityController → getById → displayActivityDetails
 */
export default async function ViewActivityDetailsPage({
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

  const activity = await ViewActivityController.getActivityForUser(
    activityId,
    session.userId,
  );
  if (!activity) {
    redirect('/dashboard/activities');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewActivityDetailsUI
        activity={serializeActivity(activity)}
      />
    </div>
  );
}

function serializeActivity(a: FundraisingActivity) {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    goal_amount: a.goal_amount,
    category: a.category,
    end_date: a.end_date,
    created_at: a.created_at,
    updated_at: a.updated_at,
  };
}
