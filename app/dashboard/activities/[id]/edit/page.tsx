import { getSession } from '@/lib/auth';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { redirect } from 'next/navigation';
import UpdateActivityBoundary, {
  type EditActivityInitial,
} from '@/lib/boundaries/UpdateActivityBoundary';

/**
 * Route shell for User Story #20 — renders UpdateActivityBoundary (process_update → show_edit_form).
 */
export default async function EditActivityPage({
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

  const initial: EditActivityInitial = {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    goal_amount: activity.goal_amount,
    end_date: activity.end_date,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <UpdateActivityBoundary initial={initial} />
    </div>
  );
}
