import { DeleteCategoryController } from '@/lib/controllers/DeleteCategoryController';
import { FRACategory } from '@/lib/entities/FRACategory';
import * as auth from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock('@/lib/entities/FRACategory');

describe('DeleteCategoryController', () => {
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
  // User Story #41 — Delete FRA Category
  // DeleteCategoryController.deleteFRACategory(category_id) → FRACategory.deleteCategory()
  // ===========================================================
  describe('User Story #41: deleteFRACategory', () => {
    it('returns [true, success message] when category is not in use and delete succeeds (main flow)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.getById as jest.Mock).mockResolvedValue(makeCategory());
      (FRACategory.isInUseByActiveFRAs as jest.Mock).mockResolvedValue(false);
      (FRACategory.deleteCategory as jest.Mock).mockResolvedValue(true);

      const [success, message] = await DeleteCategoryController.deleteFRACategory('cat-1');

      expect(success).toBe(true);
      expect(message).toBe('Category deleted successfully.');
      expect(FRACategory.deleteCategory).toHaveBeenCalledWith('cat-1');
    });

    it('returns [false, in-use message] when category is used by active FRAs (exception flow 5a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.getById as jest.Mock).mockResolvedValue(makeCategory());
      (FRACategory.isInUseByActiveFRAs as jest.Mock).mockResolvedValue(true);

      const [success, message] = await DeleteCategoryController.deleteFRACategory('cat-1');

      expect(success).toBe(false);
      expect(message).toBe(
        'Cannot delete category. It is currently in use by active FRAs.',
      );
      expect(FRACategory.deleteCategory).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when category is not found', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.getById as jest.Mock).mockResolvedValue(null);

      const [success, message] = await DeleteCategoryController.deleteFRACategory('cat-999');

      expect(success).toBe(false);
      expect(message).toBe('Category not found.');
      expect(FRACategory.deleteCategory).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when categoryId is empty (validation)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);

      const [success, message] = await DeleteCategoryController.deleteFRACategory('');

      expect(success).toBe(false);
      expect(message).toBe('Invalid category.');
      expect(FRACategory.deleteCategory).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when session is missing (precondition)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(null);

      const [success, message] = await DeleteCategoryController.deleteFRACategory('cat-1');

      expect(success).toBe(false);
      expect(message).toBe('Unauthorised.');
      expect(FRACategory.deleteCategory).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when role is not platform_management', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue({
        userId: 'a1',
        username: 'admin',
        role: 'admin',
      });

      const [success, message] = await DeleteCategoryController.deleteFRACategory('cat-1');

      expect(success).toBe(false);
      expect(message).toBe('Unauthorised.');
      expect(FRACategory.deleteCategory).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when entity delete fails', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.getById as jest.Mock).mockResolvedValue(makeCategory());
      (FRACategory.isInUseByActiveFRAs as jest.Mock).mockResolvedValue(false);
      (FRACategory.deleteCategory as jest.Mock).mockResolvedValue(false);

      const [success, message] = await DeleteCategoryController.deleteFRACategory('cat-1');

      expect(success).toBe(false);
      expect(message).toBe('Failed to delete category. Please try again.');
    });
  });
});
