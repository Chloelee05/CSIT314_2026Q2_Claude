'use server';

import { redirect } from 'next/navigation';

export async function enterSearchKeyword(formData: FormData) {
  const keyword = formData.get('keyword') as string;

  const params = new URLSearchParams();
  if (keyword && keyword.trim() !== '') {
    params.set('keyword', keyword.trim());
  }

  redirect(`/donee/donation/history?${params.toString()}`);
}
