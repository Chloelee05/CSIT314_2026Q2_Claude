'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const SEARCH_BY_OPTIONS = [
  { value: 'UserName', label: 'Username' },
  { value: 'Email', label: 'Email' },
  { value: 'FullName', label: 'Full Name' },
];

/**
 * BCE Boundary: SearchUserAccountBoundary — SearchUserAccount()
 *
 * Client-side search bar component. Navigates to the same route with
 * updated query params so the server component re-fetches results.
 */
export default function SearchUserAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentKeyword = searchParams.get('keyword') ?? '';
  const currentSearchBy = searchParams.get('search_by') ?? 'UserName';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const keyword = (form.elements.namedItem('keyword') as HTMLInputElement).value;
    const search_by = (form.elements.namedItem('search_by') as HTMLSelectElement).value;

    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    params.set('search_by', search_by);

    startTransition(() => {
      router.push(`/admin/accounts/search?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-1 max-w-xl">
      <select
        name="search_by"
        defaultValue={currentSearchBy}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      >
        {SEARCH_BY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        name="keyword"
        type="text"
        defaultValue={currentKeyword}
        placeholder="Enter keyword…"
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer"
      >
        {isPending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
