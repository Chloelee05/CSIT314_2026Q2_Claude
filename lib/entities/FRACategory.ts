import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: FRACategory / CategoryData (User Story #38, #39, #40, #41)
 *
 * Represents a fundraising activity category managed by the Platform Manager.
 */
export class FRACategory {
  id: string;
  name: string;
  created_at: string;

  constructor(data: Record<string, unknown>) {
    this.id = data.id as string;
    this.name = data.name as string;
    this.created_at = data.created_at as string;
  }

  /**
   * Persist a new category.
   * Signature matches BCE diagram: save(categoryName: String): boolean
   */
  static async save(categoryName: string): Promise<boolean> {
    const supabase = createServerClient();

    const { error } = await supabase
      .from('fra_categories')
      .insert({ name: categoryName.trim() });

    return !error;
  }

  /**
   * Retrieve all categories ordered alphabetically.
   * Signature matches BCE diagram: getAll(): list
   */
  static async getAll(): Promise<FRACategory[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fra_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => new FRACategory(row));
  }

  /**
   * Load a single category by ID.
   */
  static async getById(categoryId: string): Promise<FRACategory | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('fra_categories')
      .select('*')
      .eq('id', categoryId)
      .maybeSingle();

    if (error || !data) return null;
    return new FRACategory(data);
  }

  /**
   * Update an existing category name.
   * Signature matches BCE diagram: update(categoryId: String, categoryName: String): boolean
   */
  static async update(categoryId: string, categoryName: string): Promise<boolean> {
    const supabase = createServerClient();

    const { error } = await supabase
      .from('fra_categories')
      .update({ name: categoryName.trim() })
      .eq('id', categoryId);

    return !error;
  }

  /**
   * Delete a category by ID.
   * Signature matches BCE diagram: deleteCategory(category_id): void
   */
  static async deleteCategory(categoryId: string): Promise<boolean> {
    const supabase = createServerClient();

    const { error } = await supabase
      .from('fra_categories')
      .delete()
      .eq('id', categoryId);

    return !error;
  }

  /**
   * Check whether the given category name is referenced by any active fundraising activity.
   * Used for exception flow 5a in US #41.
   */
  static async isInUseByActiveFRAs(categoryName: string): Promise<boolean> {
    const supabase = createServerClient();

    const { data } = await supabase
      .from('fundraising_activities')
      .select('id')
      .eq('category', categoryName)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    return data !== null;
  }

  /**
   * Check whether a category with the given name already exists (case-insensitive).
   */
  static async existsByName(categoryName: string): Promise<boolean> {
    const supabase = createServerClient();

    const { data } = await supabase
      .from('fra_categories')
      .select('id')
      .ilike('name', categoryName.trim())
      .maybeSingle();

    return data !== null;
  }
}
