import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { SearchUserAccountController } from '@/lib/controllers/SearchUserAccountController';
import type { ComponentProps } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import SearchUserAccountBoundary from '@/lib/boundaries/SearchUserAccountBoundary';

type AccountsProp = ComponentProps<typeof SearchUserAccountBoundary>['accounts'];

/**
 * BCE page: SearchUserAccountBoundary — User Story #10
 * SearchUserAccount() → SearchUserAccount(Keyword, search_by) → return list
 */
export default async function SearchUserAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; search_by?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { keyword = '', search_by = 'UserName' } = await searchParams;

  const accounts = await SearchUserAccountController.SearchUserAccount(
    keyword,
    search_by,
  );

  // RSC → Client: pass plain objects only (UserAccount class instances are not serializable).
  const clientAccounts = accounts.map((account) => ({
    id: account.id,
    username: account.username,
    email: account.email ?? '',
    role: account.role,
    status: account.status,
    full_name: account.full_name,
    created_at: account.created_at,
    updated_at: account.updated_at,
    password_hash: '',
  })) as AccountsProp;

  const hasSearched = keyword.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            FundRaise <span className="text-indigo-600">Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as{' '}
              <span className="font-medium">{session.username}</span>
            </span>
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            href="/admin/accounts"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Account List
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-xl font-semibold text-gray-900">Search User Accounts</h2>
          <Suspense>
            <SearchUserAccountBoundary
              accounts={clientAccounts}
              hasSearched={hasSearched}
              keyword={keyword}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
