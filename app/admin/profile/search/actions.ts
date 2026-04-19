'use server';

import { redirect } from 'next/navigation';

export async function searchProfilesAction(formData: FormData) {
  const keyword = formData.get('Keyword') as string;
  const search_by = formData.get('search_by') as string;
  
  const params = new URLSearchParams();
  if (keyword && keyword.trim() !== '') {
    params.set('keyword', keyword.trim());
  }
  if (search_by) {
    params.set('search_by', search_by);
  }

  // Still redirect back to the main profile page to display results
  redirect(`/admin/profile?${params.toString()}`);
}