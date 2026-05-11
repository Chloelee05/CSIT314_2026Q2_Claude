import { ViewCategoryController } from '@/lib/controllers/ViewCategoryController';
import { FRACategory } from '@/lib/entities/FRACategory';

jest.mock('@/lib/entities/FRACategory');

describe('ViewCategoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeCategory = (name: string): FRACategory =>
    Object.assign(new FRACategory({}), {
      id: `id-${name}`,
      name,
      created_at: '2026-01-01T00:00:00Z',
    });

  // ===========================================================
  // User Story #39 — View FRA Categories
  // ===========================================================
  describe('User Story #39: getCategories', () => {
    it('returns list of categories from entity getAll() (main flow steps 2–5)', async () => {
      const list = [makeCategory('Health'), makeCategory('Education')];
      (FRACategory.getAll as jest.Mock).mockResolvedValue(list);

      const result = await ViewCategoryController.getCategories();

      expect(result).toEqual(list);
      expect(FRACategory.getAll).toHaveBeenCalledTimes(1);
    });

    it('returns empty list when no categories exist (ALT 2a — no categories found)', async () => {
      (FRACategory.getAll as jest.Mock).mockResolvedValue([]);

      const result = await ViewCategoryController.getCategories();

      expect(result).toEqual([]);
      expect(FRACategory.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
