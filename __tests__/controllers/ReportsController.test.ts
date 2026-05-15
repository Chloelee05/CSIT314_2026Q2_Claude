import { ReportsController } from '@/lib/controllers/ReportsController';
import { ActivityData } from '@/lib/entities/ActivityData';

jest.mock('@/lib/entities/ActivityData');

describe('ReportsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #45 — Generate Daily Report
  // ReportsController.generateDailyReport(date) → ActivityData.getDailyActivity(date)
  // ===========================================================
  describe('User Story #45: generateDailyReport', () => {
    const mockReport = {
      date: '2026-05-07',
      newActivities: 3,
      totalDonations: 5,
      totalDonationAmount: 250.0,
      newUsers: 2,
    };

    it('should return report data when activity exists for the date', async () => {
      (ActivityData.getDailyActivity as jest.Mock).mockResolvedValue(mockReport);

      const [report, flash] = await ReportsController.generateDailyReport('2026-05-07');

      expect(report).toEqual(mockReport);
      expect(flash).toBe('');
      expect(ActivityData.getDailyActivity).toHaveBeenCalledWith('2026-05-07');
    });

    it('should return null and flash when no data exists for the date (Exception 5a)', async () => {
      (ActivityData.getDailyActivity as jest.Mock).mockResolvedValue({
        date: '2026-01-01',
        newActivities: 0,
        totalDonations: 0,
        totalDonationAmount: 0,
        newUsers: 0,
      });

      const [report, flash] = await ReportsController.generateDailyReport('2026-01-01');

      expect(report).toBeNull();
      expect(flash).toBe('No activity data available for the selected date.');
    });

    it('should return null and flash when date is empty', async () => {
      const [report, flash] = await ReportsController.generateDailyReport('');

      expect(report).toBeNull();
      expect(flash).toBe('Please select a date.');
      expect(ActivityData.getDailyActivity).not.toHaveBeenCalled();
    });

    it('should return report when only donations exist (partial data)', async () => {
      (ActivityData.getDailyActivity as jest.Mock).mockResolvedValue({
        date: '2026-05-07',
        newActivities: 0,
        totalDonations: 2,
        totalDonationAmount: 100.0,
        newUsers: 0,
      });

      const [report, flash] = await ReportsController.generateDailyReport('2026-05-07');

      expect(report).not.toBeNull();
      expect(report?.totalDonations).toBe(2);
      expect(flash).toBe('');
    });

    it('should return report when only new users exist (partial data)', async () => {
      (ActivityData.getDailyActivity as jest.Mock).mockResolvedValue({
        date: '2026-05-07',
        newActivities: 0,
        totalDonations: 0,
        totalDonationAmount: 0,
        newUsers: 1,
      });

      const [report, flash] = await ReportsController.generateDailyReport('2026-05-07');

      expect(report).not.toBeNull();
      expect(report?.newUsers).toBe(1);
      expect(flash).toBe('');
    });
  });

  // ===========================================================
  // User Story #46 — Generate Weekly Report
  // ReportsController.generateWeeklyReport(start_date, end_date) → ActivityData.getWeeklyActivity()
  // ===========================================================
  describe('User Story #46: generateWeeklyReport', () => {
    const mockWeeklyReport = {
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      newActivities: 5,
      totalDonations: 12,
      totalDonationAmount: 680.0,
      newUsers: 4,
    };

    it('should return report data when activity exists for the week', async () => {
      (ActivityData.getWeeklyActivity as jest.Mock).mockResolvedValue(mockWeeklyReport);

      const [report, flash] = await ReportsController.generateWeeklyReport(
        '2026-05-01',
        '2026-05-07',
      );

      expect(report).toEqual(mockWeeklyReport);
      expect(flash).toBe('');
      expect(ActivityData.getWeeklyActivity).toHaveBeenCalledWith(
        '2026-05-01',
        '2026-05-07',
      );
    });

    it('should return null and flash when no data exists for the week (Exception 5a)', async () => {
      (ActivityData.getWeeklyActivity as jest.Mock).mockResolvedValue({
        startDate: '2026-01-01',
        endDate: '2026-01-07',
        newActivities: 0,
        totalDonations: 0,
        totalDonationAmount: 0,
        newUsers: 0,
      });

      const [report, flash] = await ReportsController.generateWeeklyReport(
        '2026-01-01',
        '2026-01-07',
      );

      expect(report).toBeNull();
      expect(flash).toBe('No activity data available for the selected week.');
    });

    it('should return null and flash when start date is empty', async () => {
      const [report, flash] = await ReportsController.generateWeeklyReport('', '2026-05-07');

      expect(report).toBeNull();
      expect(flash).toBe('Please select a start date.');
      expect(ActivityData.getWeeklyActivity).not.toHaveBeenCalled();
    });

    it('should return null and flash when end date is empty', async () => {
      const [report, flash] = await ReportsController.generateWeeklyReport('2026-05-01', '');

      expect(report).toBeNull();
      expect(flash).toBe('Please select a start date.');
      expect(ActivityData.getWeeklyActivity).not.toHaveBeenCalled();
    });

    it('should return report when only donations exist in the week (partial data)', async () => {
      (ActivityData.getWeeklyActivity as jest.Mock).mockResolvedValue({
        startDate: '2026-05-01',
        endDate: '2026-05-07',
        newActivities: 0,
        totalDonations: 3,
        totalDonationAmount: 150.0,
        newUsers: 0,
      });

      const [report, flash] = await ReportsController.generateWeeklyReport(
        '2026-05-01',
        '2026-05-07',
      );

      expect(report).not.toBeNull();
      expect(report?.totalDonations).toBe(3);
      expect(flash).toBe('');
    });
  });

  // ===========================================================
  // User Story #47 — Generate Monthly Report
  // ReportsController.generateMonthlyReport(month, year) → ActivityData.getMonthlyActivity()
  // ===========================================================
  describe('User Story #47: generateMonthlyReport', () => {
    const mockMonthlyReport = {
      month: 5,
      year: 2026,
      newActivities: 10,
      totalDonations: 30,
      totalDonationAmount: 1500.0,
      newUsers: 8,
    };

    it('should return report data when activity exists for the month', async () => {
      (ActivityData.getMonthlyActivity as jest.Mock).mockResolvedValue(mockMonthlyReport);

      const [report, flash] = await ReportsController.generateMonthlyReport(5, 2026);

      expect(report).toEqual(mockMonthlyReport);
      expect(flash).toBe('');
      expect(ActivityData.getMonthlyActivity).toHaveBeenCalledWith(5, 2026);
    });

    it('should return null and flash when no data exists for the month (Exception 5a)', async () => {
      (ActivityData.getMonthlyActivity as jest.Mock).mockResolvedValue({
        month: 1,
        year: 2020,
        newActivities: 0,
        totalDonations: 0,
        totalDonationAmount: 0,
        newUsers: 0,
      });

      const [report, flash] = await ReportsController.generateMonthlyReport(1, 2020);

      expect(report).toBeNull();
      expect(flash).toBe('No activity data available for the selected month.');
    });

    it('should return null and flash when month is 0 (invalid)', async () => {
      const [report, flash] = await ReportsController.generateMonthlyReport(0, 2026);

      expect(report).toBeNull();
      expect(flash).toBe('Please select a month and year.');
      expect(ActivityData.getMonthlyActivity).not.toHaveBeenCalled();
    });

    it('should return null and flash when year is 0 (invalid)', async () => {
      const [report, flash] = await ReportsController.generateMonthlyReport(5, 0);

      expect(report).toBeNull();
      expect(flash).toBe('Please select a month and year.');
      expect(ActivityData.getMonthlyActivity).not.toHaveBeenCalled();
    });

    it('should return report when only new activities exist (partial data)', async () => {
      (ActivityData.getMonthlyActivity as jest.Mock).mockResolvedValue({
        month: 3,
        year: 2026,
        newActivities: 2,
        totalDonations: 0,
        totalDonationAmount: 0,
        newUsers: 0,
      });

      const [report, flash] = await ReportsController.generateMonthlyReport(3, 2026);

      expect(report).not.toBeNull();
      expect(report?.newActivities).toBe(2);
      expect(flash).toBe('');
    });
  });
});
