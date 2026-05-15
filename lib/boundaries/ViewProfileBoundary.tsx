import Link from 'next/link';

interface Profile {
  dob?: string | null;
  address?: string | null;
  phone_number?: string | null;
  [key: string]: unknown;
}

interface Props {
  profile?: Profile | null;
  error?: string | null;
}

/**
 * BCE Boundary: ViewProfileBoundary (User Story #12)
 *
 * - displayProfileDetails(profile: dict) — renders profile personal particulars
 * - displayErrorMessage(message: str)    — renders error when profile not found
 */
export default function ViewProfileBoundary({ profile, error }: Props) {
  /* displayErrorMessage(message) — alternate flow */
  if (error || !profile) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-sm rounded-r-md max-w-2xl">
        <p className="text-sm text-red-700 font-bold">Error retrieving profile</p>
        <p className="text-sm text-red-700 mt-1">
          {error ?? 'Profile not found or no personal particulars entered yet.'}
        </p>
      </div>
    );
  }

  /* displayProfileDetails(profile) — main flow */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-2">
      <h2 className="text-xl font-bold text-gray-900 mb-8">Personal Particulars</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        <div>
          <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
          <p className="text-base text-gray-900">{profile.dob ?? 'Not provided'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Address</p>
          <p className="text-base text-gray-900">{profile.address ?? 'Not provided'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Phone Number</p>
          <p className="text-base text-gray-900">{profile.phone_number ?? 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
}
