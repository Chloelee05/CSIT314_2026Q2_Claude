import { getSession } from '@/lib/auth';
import DoneeViewActivityBoundary from '@/lib/boundaries/DoneeViewActivityBoundary';
import { ViewActivityController } from '@/lib/controllers/ViewActivityController';
import { redirect } from 'next/navigation';

/**
 * User Story #26 — Donee view campaign details.
 * Boundary: DoneeViewActivityBoundary (UML: ViewActivityBoundary) — process_view + show_activity_details.
 * Controller: ViewActivityController.ViewActivity → Entity: FundraisingActivity.get_activities_details
 */
export default async function ViewActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const activity_id = resolvedParams.id ?? '';

  if (!activity_id) {
    redirect('/donee/activity/search');
  }

  const [success, message, activity] =
    await ViewActivityController.ViewActivity(activity_id);

  return (
    <DoneeViewActivityBoundary
      username={session.username}
      success={success}
      message={message}
      activity={activity}
    />
  );
}
