'use server';

import { getSession } from '@/lib/auth';
import { RemoveFavouriteController } from '@/lib/controllers/RemoveFavouriteController';
import { redirect } from 'next/navigation';

export async function removeFavouriteAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    redirect('/login');
  }

  const fraId = formData.get('fraId') as string;
  if (!fraId) {
    redirect('/donee/activity/viewSaved');
  }

  const [success] = await RemoveFavouriteController.removeFavourite(session.userId, fraId);

  if (success) {
    redirect('/donee/activity/viewSaved?removed=1');
  } else {
    redirect(`/donee/activity/removeSaved?fraId=${fraId}&error=1`);
  }
}
