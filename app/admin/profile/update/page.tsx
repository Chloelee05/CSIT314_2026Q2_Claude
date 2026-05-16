import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import { UpdateUserProfileController } from '@/lib/controllers/UpdateUserProfileController';
import UpdateUserProfileBoundary from '@/lib/boundaries/UpdateUserProfileBoundary';
import Link from 'next/link';

/**
 * BCE page: UpdateUserProfileBoundary — User Story #13
 * Show_Update_Form(UserProfile_id) → Get_Updated(id) → render form
 * UpdatedUserProfile(...) → UpdateUserProfileController.UpdatedUserProfile(...)
 */
export default async function UpdateProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { id } = await searchParams;

  if (!id) {
    redirect('/admin/profile');
  }

  const profileData = await UpdateUserProfileController.Get_Updated(id);

  if (!profileData) {
    redirect('/admin/profile');
  }

  const details = profileData.user_profile?.[0] ?? {};

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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update User Profile</h2>
          <Link
            href={`/admin/profile/${id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Details
          </Link>
        </div>

        {/* UpdateUserProfileBoundary: Show_Update_Form() + UpdatedUserProfile() */}
        <UpdateUserProfileBoundary
          userAccountId={profileData.id}
          userProfileId={details.id ?? ''}
          currentDob={details.dob ?? ''}
          currentAddress={details.address ?? ''}
          currentPhone={details.phone_number ?? ''}
        />
      </main>
    </div>
  );
}
