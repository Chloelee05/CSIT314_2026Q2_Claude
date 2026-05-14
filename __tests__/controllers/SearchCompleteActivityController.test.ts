import { SearchCompleteActivityController } from '@/lib/controllers/SearchCompleteActivityController';
import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

describe('SearchCompleteActivityController', () => {
  const mockActivity = (title: string) =>
    new FundraisingActivity({
      id: '1',
      user_id: 'u1',
      title,
      description: 'Desc',
      goal_amount: 100,
      category: 'Health',
      end_date: '2024-01-01',
      view_count: 0,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    });

  let getCompletedByKeywordSpy: jest.SpyInstance;

  beforeAll(() => {
    getCompletedByKeywordSpy = jest.spyOn(
      FundraisingActivity,
      'getCompletedByKeyword',
    );
  });

  afterAll(() => {
    getCompletedByKeywordSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #34 — Search completed fundraising activities
  // SearchCompleteActivityController.SearchCompleteActivity(keyword)
  //   → FundraisingActivity.getCompletedByKeyword(keyword, userId)
  // ===========================================================
  describe('User Story #34: SearchCompleteActivity', () => {
    it('returns list and null message when completed matches exist (main flow)', async () => {
      const list = [mockActivity('Past summer')];
      getCompletedByKeywordSpy.mockResolvedValue(list);

      const [activities, msg] =
        await SearchCompleteActivityController.SearchCompleteActivity(
          'summer',
          'u1',
        );

      expect(activities).toEqual(list);
      expect(msg).toBeNull();
      expect(getCompletedByKeywordSpy).toHaveBeenCalledWith('summer', 'u1');
    });

    it('returns all completed activities and null message when keyword is empty', async () => {
      const list = [mockActivity('Past A'), mockActivity('Past B')];
      getCompletedByKeywordSpy.mockResolvedValue(list);

      const [activities, msg] =
        await SearchCompleteActivityController.SearchCompleteActivity('', 'u1');

      expect(activities).toEqual(list);
      expect(msg).toBeNull();
    });

    it('returns empty list and flash message when keyword has no matches (alternate flow)', async () => {
      getCompletedByKeywordSpy.mockResolvedValue([]);

      const [activities, msg] =
        await SearchCompleteActivityController.SearchCompleteActivity(
          'nope',
          'u1',
        );

      expect(activities).toEqual([]);
      expect(msg).toBe('No completed fundraising activities found.');
    });

    it('returns empty list and null message when keyword is empty and there are no completed activities', async () => {
      getCompletedByKeywordSpy.mockResolvedValue([]);

      const [activities, msg] =
        await SearchCompleteActivityController.SearchCompleteActivity('', 'u1');

      expect(activities).toEqual([]);
      expect(msg).toBeNull();
    });
  });
});
