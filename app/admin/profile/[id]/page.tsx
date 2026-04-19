import { ProfileViewController } from '@/lib/controllers/ProfileViewController';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/app/login/actions';
import Link from 'next/link';

export default async function ViewProfileBoundary({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // Fetch session to keep the header bar looking exactly like the other pages
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }
  
  const result = await ProfileViewController.getProfileDetails(id);

  // Exception Flow: Styled to match the wide layout
  if (result.error || !result.profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">
              FundRaise <span className="text-indigo-600">Admin</span>
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/admin/profile" className="text-indigo-600 hover:text-indigo-800 text-sm mb-6 inline-block transition">
            &larr; Back to Profiles List
          </Link>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-sm rounded-r-md max-w-2xl">
            <p className="text-sm text-red-700 font-bold">Error retrieving profile</p>
            <p className="text-sm text-red-700 mt-1">{result.error || "Profile not found or no personal particulars entered yet."}</p>
          </div>
        </main>
      </div>
    );
  }

  const profile = result.profile;

  // Regular Flow: Matches your friend's 2-column wide card layout perfectly
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Header Navigation Bar */}
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

      {/* 2. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Link */}
        <Link 
          href="/admin/profile" 
          className="text-indigo-600 hover:text-indigo-800 text-sm mb-6 inline-block transition"
        >
          &larr; Back to Profiles List
        </Link>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-2">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Personal Particulars</h2>

          {/* 2-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
              <p className="text-base text-gray-900">{profile.dob || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-base text-gray-900">{profile.address || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="text-base text-gray-900">{profile.phone_number || 'Not provided'}</p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}