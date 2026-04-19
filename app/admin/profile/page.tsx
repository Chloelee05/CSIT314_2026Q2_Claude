import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { ProfileViewController } from '@/lib/controllers/ProfileViewController';
import SuspendUserProfileBoundary from './suspend/SuspendUserProfileBoundary';
import Link from 'next/link';

export default async function ProfileListPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  // Retrieve the list of profiles
  const profiles = await ProfileViewController.getProfileList();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            FundRaise <span className="text-indigo-600">Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{session.username}</span>
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            System Profiles
          </h2>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">No system profiles found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    System ID
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Username
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {profile.id}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {profile.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link 
                          href={`/admin/profile/${profile.id}`} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View profile
                        </Link>
                        <Link 
                          href={`/admin/profile/update?id=${profile.id}`} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Update profile
                        </Link>
                        
                        {/* Added a vertical divider for clean UI */}
                        <span className="text-gray-300">|</span>
                        
                        {/* The Suspend Button is now in the same action row! */}
                        <SuspendUserProfileBoundary 
                          userprofile_id={profile.id} 
                          currentStatus={profile.status || 'active'} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}