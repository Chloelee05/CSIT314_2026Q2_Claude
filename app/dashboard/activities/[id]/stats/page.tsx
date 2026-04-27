import { getSession } from '@/lib/auth';
import { ViewStatisticsController } from '@/lib/controllers/ViewStatisticsController';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { redirect } from 'next/navigation';
import { ViewFRAStatisticsBoundary } from './ViewFRAStatisticsBoundary';

/**
 * BCE Boundary: statistics page — User Story #32
 * Sequence: clickViewStatistics → getViewCount(fraId) → fetchViewCount(fraId) → displayViewCount
 */
export default async function ActivityStatisticsPage({
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

  const [ok, count, errorMessage] = await ViewStatisticsController.getViewCount(
    activityId,
    session.userId,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewFRAStatisticsBoundary
        activityId={activityId}
        activityTitle={activity.title}
        success={ok}
        viewCount={count}
        errorMessage={ok ? null : errorMessage}
      />
    </div>
  );
}
