import { FundraisingActivity } from '@/lib/entities/FundraisingActivity';

/**
 * User Story #34 — FundraisingActivity.getCompletedByKeyword
 */
describe('FundraisingActivity.getCompletedByKeyword (User Story #34)', () => {
  let getByUserIdSpy: jest.SpyInstance;

  const act = (overrides: Partial<Record<string, unknown>> = {}) =>
    new FundraisingActivity({
      id: '1',
      user_id: 'u1',
      title: 'Camp',
      description: 'Desc',
      goal_amount: 100,
      category: 'Health',
      end_date: '2025-06-01',
      view_count: 0,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      ...overrides,
    });

  beforeAll(() => {
    getByUserIdSpy = jest.spyOn(FundraisingActivity, 'getByUserId');
  });

  afterAll(() => {
    getByUserIdSpy.mockRestore();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15T12:00:00.000Z'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns only activities whose end_date is on or before today (UTC day)', async () => {
    getByUserIdSpy.mockResolvedValue([
      act({ id: 'a', end_date: '2025-12-01', title: 'Past' }),
      act({ id: 'b', end_date: '2027-01-01', title: 'Future' }),
      act({ id: 'c', end_date: null, title: 'No end' }),
    ]);

    const r = await FundraisingActivity.getCompletedByKeyword('', 'u1');

    expect(r.map((x) => x.id)).toEqual(['a']);
  });

  it('treats end_date on today as completed', async () => {
    getByUserIdSpy.mockResolvedValue([
      act({ id: 't', end_date: '2026-01-15', title: 'Ends today' }),
    ]);

    const r = await FundraisingActivity.getCompletedByKeyword('', 'u1');

    expect(r).toHaveLength(1);
    expect(r[0].id).toBe('t');
  });

  it('filters by keyword in title, description, or category', async () => {
    getByUserIdSpy.mockResolvedValue([
      act({
        id: 'a',
        end_date: '2025-01-01',
        title: 'Summer run',
        description: 'X',
        category: 'Health',
      }),
      act({
        id: 'b',
        end_date: '2025-02-01',
        title: 'Other',
        description: 'X',
        category: 'Health',
      }),
    ]);

    const r = await FundraisingActivity.getCompletedByKeyword('summer', 'u1');

    expect(r).toHaveLength(1);
    expect(r[0].id).toBe('a');
  });
});
