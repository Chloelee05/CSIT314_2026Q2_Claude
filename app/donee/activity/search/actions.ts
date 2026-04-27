'use server';

import { redirect } from 'next/navigation';

export async function process_search(formData: FormData) {
  const keyword = formData.get('keyword') as string;

  const params = new URLSearchParams();
  if (keyword && keyword.trim() !== '') {
    params.set('keyword', keyword.trim());
  }

  redirect(`/donee/activity/search?${params.toString()}`);
}
