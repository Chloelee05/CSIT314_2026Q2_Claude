/**
 * User Story #22 — search an FR's own (non-completed-focused) activities, and Donee browse helpers.
 * User Story #25 — Donee searches for active fundraising activities.
 * User Story #34 — FR searches completed fundraising activities (SearchCompleteActivityController).
 */
import { SearchActivityController } from '@/lib/controllers/SearchActivityController';
import { SearchCompleteActivityController } from '@/lib/controllers/SearchCompleteActivityController';
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
      view_count: 0,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    });

  let findActiveActivitiesSpy: jest.SpyInstance;

  beforeAll(() => {
    findSpy = jest.spyOn(FundraisingActivity, 'find_activities');
    findActiveActivitiesSpy = jest.spyOn(
      FundraisingActivity,
      'find_active_activities',
    );
  });

  afterAll(() => {
    findSpy.mockRestore();
    findActiveActivitiesSpy.mockRestore();
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

  // ===========================================================
  // User Story #25 — Donee searches for fundraising activities
  // SearchActivityController.searchActiveActivities(keyword)
  //   → FundraisingActivity.find_active_activities(keyword)
  // ===========================================================
  describe('User Story #25: searchActiveActivities', () => {
    it('returns success tuple with matching activities when keyword matches', async () => {
      const list = [mockActivity('Save the Reef')];
      findActiveActivitiesSpy.mockResolvedValue([true, 'Activities found.', list]);

      const [success, message, activities] =
        await SearchActivityController.searchActiveActivities('reef');

      expect(success).toBe(true);
      expect(message).toBe('Activities found.');
      expect(activities).toEqual(list);
      expect(findActiveActivitiesSpy).toHaveBeenCalledWith('reef');
    });

    it('returns all active activities when keyword is empty', async () => {
      const list = [mockActivity('A'), mockActivity('B')];
      findActiveActivitiesSpy.mockResolvedValue([true, 'Activities found.', list]);

      const [success, message, activities] =
        await SearchActivityController.searchActiveActivities('');

      expect(success).toBe(true);
      expect(activities).toHaveLength(2);
      expect(findActiveActivitiesSpy).toHaveBeenCalledWith('');
    });

    it('returns failure tuple when keyword has no matches (Exception 3a)', async () => {
      findActiveActivitiesSpy.mockResolvedValue([false, 'No activities found.', []]);

      const [success, message, activities] =
        await SearchActivityController.searchActiveActivities('nomatch');

      expect(success).toBe(false);
      expect(message).toBe('No activities found.');
      expect(activities).toEqual([]);
    });

    it('returns failure tuple on DB error', async () => {
      findActiveActivitiesSpy.mockResolvedValue([false, 'Failed to fetch activities.', []]);

      const [success, message, activities] =
        await SearchActivityController.searchActiveActivities('anything');

      expect(success).toBe(false);
      expect(message).toBe('Failed to fetch activities.');
      expect(activities).toEqual([]);
    });
  });

  // ===========================================================
  // User Story #34 — FR searches completed fundraising activities
  // SearchCompleteActivityController.SearchCompleteActivity(keyword, userId)
  //   → FundraisingActivity.getCompletedByKeyword(keyword, userId)
  // ===========================================================
  describe('User Story #34: SearchCompleteActivity', () => {
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

    it('returns list and null message when completed matches exist (main flow)', async () => {
      const list = [mockActivity('Past summer')];
      getCompletedByKeywordSpy.mockResolvedValue(list);

      const [activities, msg] =
        await SearchCompleteActivityController.SearchCompleteActivity('summer', 'u1');

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
        await SearchCompleteActivityController.SearchCompleteActivity('nope', 'u1');

      expect(activities).toEqual([]);
      expect(msg).toBe('No completed fundraising activities found.');
    });

    it('returns empty list and null message when keyword is empty and no completed activities exist', async () => {
      getCompletedByKeywordSpy.mockResolvedValue([]);

      const [activities, msg] =
        await SearchCompleteActivityController.SearchCompleteActivity('', 'u1');

      expect(activities).toEqual([]);
      expect(msg).toBeNull();
    });
  });
});
