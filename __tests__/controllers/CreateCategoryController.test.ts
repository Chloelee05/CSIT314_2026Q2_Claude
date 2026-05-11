import { CreateCategoryController } from '@/lib/controllers/CreateCategoryController';
import { FRACategory } from '@/lib/entities/FRACategory';
import * as auth from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock('@/lib/entities/FRACategory');

describe('CreateCategoryController', () => {
  const pmSession = {
    userId: 'pm-1',
    username: 'platformmgr',
    role: 'platform_management',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================
  // User Story #38 — Create FRA Category
  // ===========================================================
  describe('User Story #38: createCategory', () => {
    it('returns [true, success message] when category is new and save succeeds (main flow)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.existsByName as jest.Mock).mockResolvedValue(false);
      (FRACategory.save as jest.Mock).mockResolvedValue(true);

      const [success, message] = await CreateCategoryController.createCategory('Health');

      expect(success).toBe(true);
      expect(message).toBe('Category created successfully.');
      expect(FRACategory.existsByName).toHaveBeenCalledWith('Health');
      expect(FRACategory.save).toHaveBeenCalledWith('Health');
    });

    it('returns [false, "Category already exists."] when category name is duplicate (ALT 3a)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.existsByName as jest.Mock).mockResolvedValue(true);

      const [success, message] = await CreateCategoryController.createCategory('Health');

      expect(success).toBe(false);
      expect(message).toBe('Category already exists.');
      expect(FRACategory.save).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when category name is empty (validation)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);

      const [success, message] = await CreateCategoryController.createCategory('');

      expect(success).toBe(false);
      expect(message).toBe('Category name is required.');
      expect(FRACategory.existsByName).not.toHaveBeenCalled();
      expect(FRACategory.save).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when category name is whitespace only', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);

      const [success, message] = await CreateCategoryController.createCategory('   ');

      expect(success).toBe(false);
      expect(message).toBe('Category name is required.');
    });

    it('returns [false, error message] when session is missing (precondition)', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(null);

      const [success, message] = await CreateCategoryController.createCategory('Health');

      expect(success).toBe(false);
      expect(message).toBe('Unauthorised.');
      expect(FRACategory.existsByName).not.toHaveBeenCalled();
      expect(FRACategory.save).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when role is not platform_management', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue({
        userId: 'a1',
        username: 'admin',
        role: 'admin',
      });

      const [success, message] = await CreateCategoryController.createCategory('Health');

      expect(success).toBe(false);
      expect(message).toBe('Unauthorised.');
      expect(FRACategory.save).not.toHaveBeenCalled();
    });

    it('returns [false, error message] when entity save fails', async () => {
      (auth.getSession as jest.Mock).mockResolvedValue(pmSession);
      (FRACategory.existsByName as jest.Mock).mockResolvedValue(false);
      (FRACategory.save as jest.Mock).mockResolvedValue(false);

      const [success, message] = await CreateCategoryController.createCategory('Health');

      expect(success).toBe(false);
      expect(message).toBe('Failed to create category. Please try again.');
    });
  });
});
