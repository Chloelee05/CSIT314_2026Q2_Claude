import { UpdateUserProfileController } from '@/lib/controllers/UpdateUserProfileController';
import UpdateUserProfileForm from './UpdateUserProfileForm';
import Link from 'next/link';

export default async function UpdateProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const id = resolvedParams.id;

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
        <div className="text-red-600 mb-4">No profile ID provided in the URL.</div>
        <Link href="/admin/profile" className="text-indigo-600 hover:underline">&larr; Back to Profiles List</Link>
      </div>
    );
  }
  
  const profileData = await UpdateUserProfileController.Get_Updated(id);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
        <div className="text-red-600 mb-4">Profile not found.</div>
        <Link href="/admin/profile" className="text-indigo-600 hover:underline">&larr; Back to Profiles List</Link>
      </div>
    );
  }

  const details = profileData.user_profile_details?.[0] || {};

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Update User Profile</h1>
          <Link href={`/admin/profile/${id}`} className="text-sm text-indigo-600 hover:underline">
            &larr; Back to Details
          </Link>
        </div>

        <UpdateUserProfileForm 
          userAccountId={profileData.id}
          userProfileId={details.id || ''}
          currentUsername={profileData.username}
          currentDob={details.dob || ''}
          currentAddress={details.address || ''}
          currentPhone={details.phone_number || ''}
        />

      </main>
    </div>
  );
}