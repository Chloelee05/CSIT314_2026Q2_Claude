import { type DonationWithActivity } from '@/lib/entities/Donation';

/**
 * BCE Boundary: ViewDonationHistoryBoundary (User Story #37)
 *
 * - process_view()                          — renders the donation history page
 * - displayDonationHistory(donations: list) — shows list or alternate-flow flash
 */
export function ViewDonationHistoryBoundary({
  success,
  message,
  donations,
}: {
  success: boolean;
  message: string;
  donations: DonationWithActivity[];
}) {
  if (!success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
        <p className="text-gray-500 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {donations.map((donation) => (
        <div
          key={donation.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <h3 className="font-semibold text-gray-900">{donation.campaign_title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(donation.donated_at).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                donation.campaign_status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {donation.campaign_status.charAt(0).toUpperCase() +
                donation.campaign_status.slice(1)}
            </span>
            <span className="text-indigo-600 font-semibold text-base">
              ${Number(donation.amount).toLocaleString('en-AU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
