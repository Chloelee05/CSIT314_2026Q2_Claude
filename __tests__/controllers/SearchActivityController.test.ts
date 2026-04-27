import { SearchActivityController } from '@/lib/controllers/SearchActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

describe('SearchActivityController', () => {
  let findSpy: jest.SpyInstance;

  const mockActivity = (title: string) =>
    new FundraisingActivity({
      id: '1',
      user_id: 'u1',
      title,
      description: 'Desc',
      goal_amount: 100,
      category: 'Health',
      end_date: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    });

  beforeAll(() => {
    findSpy = jest.spyOn(FundraisingActivity, 'find_activities');
  });

  afterAll(() => {
    findSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #22 — Search Fundraising Activity
  // ===========================================================
  describe('User Story #22: SearchActivity', () => {
    it('returns tuple with activities and null message when matches exist', async () => {
      const list = [mockActivity('Summer Run')];
      findSpy.mockResolvedValue(list);

      const [activities, flash] = await SearchActivityController.SearchActivity(
        'summer',
        'u1',
      );

      expect(activities).toEqual(list);
      expect(flash).toBeNull();
      expect(findSpy).toHaveBeenCalledWith('summer', 'u1');
    });

    it('returns tuple with empty list and flash when keyword has no matches (exception flow)', async () => {
      findSpy.mockResolvedValue([]);

      const [activities, flash] = await SearchActivityController.SearchActivity(
        'nomatch',
        'u1',
      );

      expect(activities).toEqual([]);
      expect(flash).toBe('No activities found.');
    });

    it('returns tuple with no flash when keyword is empty and list is empty (4a / no rows)', async () => {
      findSpy.mockResolvedValue([]);

      const [activities, flash] = await SearchActivityController.SearchActivity(
        '   ',
        'u1',
      );

      expect(activities).toEqual([]);
      expect(flash).toBeNull();
    });

    it('returns tuple with no flash when keyword is empty and activities exist (4b: show all)', async () => {
      const list = [mockActivity('A')];
      findSpy.mockResolvedValue(list);

      const [activities, flash] = await SearchActivityController.SearchActivity(
        '',
        'u1',
      );

      expect(activities).toEqual(list);
      expect(flash).toBeNull();
    });
  });
});
