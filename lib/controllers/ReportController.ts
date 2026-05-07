import { ActivityData, DailyReport, MonthlyReport, WeeklyReport } from '@/lib/entities/ActivityData';

/**
 * BCE Controller: ReportController (User Story #45, #46, #47)
 * Generates activity reports for Platform Managers.
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

  /**
   * US#46 — Generate a weekly report for the given date range.
   * Signature matches BCE diagram: generateWeeklyReport(start_date, end_date)
   *
   * @returns [report | null, flash message]
   */
  static async generateWeeklyReport(
    start_date: string,
    end_date: string,
  ): Promise<[WeeklyReport | null, string]> {
    if (!start_date || !end_date) {
      return [null, 'Please select a start date.'];
    }

    const report = await ActivityData.getWeeklyActivity(start_date, end_date);

    if (
      report.newActivities === 0 &&
      report.totalDonations === 0 &&
      report.newUsers === 0
    ) {
      return [null, 'No activity data available for the selected week.'];
    }

    return [report, ''];
  }

  /**
   * US#47 — Generate a monthly report for the given month and year.
   * Signature matches BCE diagram: generateMonthlyReport(month, year)
   *
   * @returns [report | null, flash message]
   */
  static async generateMonthlyReport(
    month: number,
    year: number,
  ): Promise<[MonthlyReport | null, string]> {
    if (!month || !year) {
      return [null, 'Please select a month and year.'];
    }

    const report = await ActivityData.getMonthlyActivity(month, year);

    if (
      report.newActivities === 0 &&
      report.totalDonations === 0 &&
      report.newUsers === 0
    ) {
      return [null, 'No activity data available for the selected month.'];
    }

    return [report, ''];
  }
}
