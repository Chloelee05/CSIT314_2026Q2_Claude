import { UpdateCategoryController } from '@/lib/controllers/UpdateCategoryController';
import { FRACategory } from '@/lib/entities/FRACategory';
import * as auth from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock('@/lib/entities/FRACategory');

describe('UpdateCategoryController', () => {
  const pmSession = {
    userId: 'pm-1',
    username: 'platformmgr',
    role: 'platform_management',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #40 — Update FRA Category
  // ===========================================================
  describe('User Story #40: updateCategory', () => {
    it('returns [true, success message] when name is unique and update succeeds (main flow)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.existsByName as jest.Mock).mockResolvedValue(false);
      (FRACategory.update as jest.Mock).mockResolvedValue(true);

      const [success, message] = await UpdateCategoryController.updateCategory(
        'cat-1',
        'Health & Wellness',
      );

      expect(success).toBe(true);
      expect(message).toBe('Category updated successfully.');
      expect(FRACategory.existsByName).toHaveBeenCalledWith('Health & Wellness');
      expect(FRACategory.update).toHaveBeenCalledWith('cat-1', 'Health & Wellness');
    });

    it('returns [false, "Category name already exists."] when name is a duplicate (ALT 3a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.existsByName as jest.Mock).mockResolvedValue(true);

      const [success, message] = await UpdateCategoryController.updateCategory(
        'cat-1',
        'Health',
      );

      expect(success).toBe(false);
      expect(message).toBe('Category name already exists.');
      expect(FRACategory.update).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when category name is empty (validation)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);

      const [success, message] = await UpdateCategoryController.updateCategory(
        'cat-1',
        '',
      );

      expect(success).toBe(false);
      expect(message).toBe('Category name is required.');
      expect(FRACategory.existsByName).not.toHaveBeenCalled();
      expect(FRACategory.update).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when categoryId is empty (validation)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);

      const [success, message] = await UpdateCategoryController.updateCategory(
        '',
        'Health',
      );

      expect(success).toBe(false);
      expect(message).toBe('Category name is required.');
      expect(FRACategory.update).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when session is missing (precondition)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(null);

      const [success, message] = await UpdateCategoryController.updateCategory(
        'cat-1',
        'Health',
      );

      expect(success).toBe(false);
      expect(message).toBe('Unauthorised.');
      expect(FRACategory.update).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when role is not platform_management', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue({
        userId: 'a1',
        username: 'admin',
        role: 'admin',
      });

      const [success, message] = await UpdateCategoryController.updateCategory(
        'cat-1',
        'Health',
      );

      expect(success).toBe(false);
      expect(message).toBe('Unauthorised.');
      expect(FRACategory.update).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when entity update fails', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.existsByName as jest.Mock).mockResolvedValue(false);
      (FRACategory.update as jest.Mock).mockResolvedValue(false);

      const [success, message] = await UpdateCategoryController.updateCategory(
        'cat-1',
        'Health',
      );

      expect(success).toBe(false);
      expect(message).toBe('Failed to update category. Please try again.');
    });
  });
});
