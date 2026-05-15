'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { UserAccount } from '@/lib/entities/UserAccount';
import Link from 'next/link';

const SEARCH_BY_OPTIONS = [
  { value: 'UserName', label: 'Username' },
  { value: 'Email', label: 'Email' },
  { value: 'FullName', label: 'Full Name' },
];

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  fund_raiser: 'Fund Raiser',
  donee: 'Donee',
  platform_management: 'Platform Management',
};

interface Props {
  accounts: UserAccount[];
  hasSearched: boolean;
  keyword: string;
}

/**
 * BCE Boundary: SearchUserAccountBoundary (User Story #10)
 *
 * - SearchUserAccount() — search bar submission triggers SearchUserAccountController.SearchUserAccount(Keyword, search_by)
 */
export default function SearchUserAccountBoundary({
  accounts,
  hasSearched,
  keyword,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentKeyword = searchParams.get('keyword') ?? '';
  const currentSearchBy = searchParams.get('search_by') ?? 'UserName';

  /* SearchUserAccount() — submit navigates with updated query params */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const kw = (form.elements.namedItem('keyword') as HTMLInputElement).value;
    const search_by = (form.elements.namedItem('search_by') as HTMLSelectElement).value;

    const params = new URLSearchParams();
    if (kw) params.set('keyword', kw);
    params.set('search_by', search_by);

    startTransition(() => {
      router.push(`/admin/accounts/search?${params.toString()}`);
    });
  }

  return (
    <>
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

      {/* return list — results display */}
      {!hasSearched ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <p className="text-gray-500">Enter a keyword above to search for user accounts.</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <p className="text-gray-500">
            No accounts found matching{' '}
            <span className="font-medium text-gray-700">&ldquo;{keyword}&rdquo;</span>.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-sm text-gray-500">
            {accounts.length} result{accounts.length !== 1 ? 's' : ''} for{' '}
            <span className="font-medium text-gray-700">&ldquo;{keyword}&rdquo;</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Username</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-900">{account.full_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-900">{account.username}</td>
                  <td className="px-4 py-3 text-gray-600">{account.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {ROLE_LABELS[account.role] ?? account.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        account.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/accounts/${account.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
