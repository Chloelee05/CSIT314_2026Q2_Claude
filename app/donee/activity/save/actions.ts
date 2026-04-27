'use server';

import { getSession } from '@/lib/auth';
import { SaveFRAController } from '@/lib/controllers/SaveFRAController';

export type SaveFRAState = {
  success: boolean;
  message: string;
} | null;

export async function saveFRAAction(
  _prevState: SaveFRAState,
  formData: FormData,
): Promise<SaveFRAState> {
  const session = await getSession();
  if (!session || session.role !== 'donee') {
    return { success: false, message: 'Unauthorised. Please log in.' };
  }

  const fraId = formData.get('fraId') as string;
  if (!fraId) {
    return { success: false, message: 'Invalid activity.' };
  }

  const [success, message] = await SaveFRAController.saveFRA(session.userId, fraId);
  return { success, message };
}
