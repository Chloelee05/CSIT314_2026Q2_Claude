import { getSession } from '@/lib/auth';
import { ViewStatisticsController } from '@/lib/controllers/ViewStatisticsController';
import { ShortlistStatisticsController } from '@/lib/controllers/ShortlistStatisticsController';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { redirect } from 'next/navigation';
import { ViewStatisticsBoundary } from '@/lib/boundaries/ViewStatisticsBoundary';
import { ShortlistStatisticsBoundary } from '@/lib/boundaries/ShortlistStatisticsBoundary';

/**
 * Stats page for US#32 (view count) and US#33 (shortlist count).
 * Renders ViewStatisticsBoundary and ShortlistStatisticsBoundary side by side.
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

  const [viewOk, viewCount, viewError] = await ViewStatisticsController.getViewCount(
    activityId,
  );
  const [slOk, shortlistCount, shortlistError] =
    await ShortlistStatisticsController.getShortlistCount(activityId);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ViewStatisticsBoundary
        activityId={activityId}
        activityTitle={activity.title}
        viewSuccess={viewOk}
        viewCount={viewCount}
        viewErrorMessage={viewOk ? null : viewError}
      />
      <div className="max-w-2xl mx-auto mt-6">
        <ShortlistStatisticsBoundary
          activityId={activityId}
          shortlistSuccess={slOk}
          shortlistCount={shortlistCount}
          shortlistErrorMessage={slOk ? null : shortlistError}
        />
      </div>
    </div>
  );
}
