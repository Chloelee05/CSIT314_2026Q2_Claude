import { ActivityData, DailyReport } from '@/lib/entities/ActivityData';

/**
 * BCE Controller: ReportController (User Story #45)
 * Generates daily activity reports for Platform Managers.
 */
export class ReportController {
  /**
   * US#45 — Generate a daily report for the given date.
   * Signature matches BCE diagram: generateDailyReport(date)
   *
   * @returns [report | null, flash message]
   */
  static async generateDailyReport(
    date: string,
  ): Promise<[DailyReport | null, string]> {
    if (!date) {
      return [null, 'Please select a date.'];
    }

    const report = await ActivityData.getDailyActivity(date);

    if (
      report.newActivities === 0 &&
      report.totalDonations === 0 &&
      report.newUsers === 0
    ) {
      return [null, 'No activity data available for the selected date.'];
    }

    return [report, ''];
  }
}
