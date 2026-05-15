import { SearchCategoriesController } from '@/lib/controllers/SearchCategoriesController';
import { FRACategory } from '@/lib/entities/FRACategory';
import * as auth from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock('@/lib/entities/FRACategory');

describe('SearchCategoriesController', () => {
  const pmSession = {
    userId: 'pm-1',
    username: 'platformmgr',
    role: 'platform_management',
  };

  const makeCategory = (name = 'Health') =>
    Object.assign(new FRACategory({}), {
      id: 'cat-1',
      name,
      created_at: '2026-01-01T00:00:00Z',
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #42 — Search FRA Categories
  // ===========================================================
  describe('User Story #42: searchFRACategories', () => {
    it('returns matching categories and empty flash when keyword matches (main flow)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      const list = [makeCategory('Health'), makeCategory('Health & Wellness')];
      (FRACategory.getCategoriesByKeyword as jest.Mock).mockResolvedValue(list);

      const [categories, flash] = await SearchCategoriesController.searchFRACategories('health');

      expect(categories).toEqual(list);
      expect(flash).toBe('');
      expect(FRACategory.getCategoriesByKeyword).toHaveBeenCalledWith('health');
    });

    it('returns empty list and flash message when no categories match (exception flow 4a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.getCategoriesByKeyword as jest.Mock).mockResolvedValue([]);

      const [categories, flash] = await SearchCategoriesController.searchFRACategories('xyz');

      expect(categories).toEqual([]);
      expect(flash).toBe('No categories found matching your search.');
    });

    it('returns all categories when keyword is empty', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      const list = [makeCategory('Health'), makeCategory('Education')];
      (FRACategory.getCategoriesByKeyword as jest.Mock).mockResolvedValue(list);

      const [categories, flash] = await SearchCategoriesController.searchFRACategories('');

      expect(categories).toEqual(list);
      expect(flash).toBe('');
    });

    it('returns [[], "Unauthorised."] when session is missing', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(null);

      const [categories, flash] = await SearchCategoriesController.searchFRACategories('health');

      expect(categories).toEqual([]);
      expect(flash).toBe('Unauthorised.');
      expect(FRACategory.getCategoriesByKeyword).not.toHaveBeenCalled();
    });

    it('returns [[], "Unauthorised."] when role is not platform_management', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue({
        userId: 'a1',
        username: 'admin',
        role: 'admin',
      });

      const [categories, flash] = await SearchCategoriesController.searchFRACategories('health');

      expect(categories).toEqual([]);
      expect(flash).toBe('Unauthorised.');
    });
  });

});
