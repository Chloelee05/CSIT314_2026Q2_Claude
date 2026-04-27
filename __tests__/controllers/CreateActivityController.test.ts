import { CreateActivityController } from '@/lib/controllers/CreateActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';
import * as auth from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

describe('CreateActivityController', () => {
  const frSession = {
    userId: 'user-1',
    username: 'fundraiser1',
    role: 'fund_raiser',
  };

  let saveSpy: jest.SpyInstance;

  beforeAll(() => {
    saveSpy = jest
      .spyOn(FundraisingActivity, 'save')
      .mockImplementation(() => Promise.resolve(true));
  });

  afterAll(() => {
    saveSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    saveSpy.mockResolvedValue(true);
  });

  // ===========================================================
  // User Story #18 — Create Fundraising Activity
  // ===========================================================
  describe('User Story #18: createActivity', () => {
    it('returns true when FR is logged in and save succeeds (main flow)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);

      const result = await CreateActivityController.createActivity(
        'Summer Run',
        'Raise funds for local schools.',
        5000,
        'Education',
      );

      expect(result).toBe(true);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      const saved = saveSpy.mock.calls[0][0] as InstanceType<
        typeof FundraisingActivity
      >;
      expect(saved.title).toBe('Summer Run');
      expect(saved.description).toBe('Raise funds for local schools.');
      expect(saved.goal_amount).toBe(5000);
      expect(saved.category).toBe('Education');
      expect(saved.user_id).toBe('user-1');
    });

    it('returns false when required title is missing (ALT 4a — validation fails)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);

      const result = await CreateActivityController.createActivity(
        '',
        'Description',
        100,
        'Health',
      );

      expect(result).toBe(false);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('returns false when goal amount is invalid (ALT 4a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);

      const result = await CreateActivityController.createActivity(
        'Title',
        'Description',
        NaN,
        'Health',
      );

      expect(result).toBe(false);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('returns false when goal amount is zero or negative (ALT 4a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);

      await expect(
        CreateActivityController.createActivity('T', 'D', 0, 'C'),
      ).resolves.toBe(false);
      await expect(
        CreateActivityController.createActivity('T', 'D', -10, 'C'),
      ).resolves.toBe(false);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('returns false when session is missing (precondition)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(null);

      const result = await CreateActivityController.createActivity(
        'Title',
        'Description',
        100,
        'Health',
      );

      expect(result).toBe(false);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('returns false when role is not fund_raiser', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue({
        userId: 'a1',
        username: 'admin',
        role: 'admin',
      });

      const result = await CreateActivityController.createActivity(
        'Title',
        'Description',
        100,
        'Health',
      );

      expect(result).toBe(false);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('returns false when entity save fails', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(frSession);
      saveSpy.mockResolvedValueOnce(false);

      const result = await CreateActivityController.createActivity(
        'Title',
        'Description',
        100,
        'Health',
      );

      expect(result).toBe(false);
    });
  });

  describe('isValidInput', () => {
    it('returns true for valid inputs', () => {
      expect(
        CreateActivityController.isValidInput('A', 'B', 1, 'Cat'),
      ).toBe(true);
    });

    it('returns false when any string field is blank', () => {
      expect(
        CreateActivityController.isValidInput('', 'B', 1, 'C'),
      ).toBe(false);
    });
  });
});
