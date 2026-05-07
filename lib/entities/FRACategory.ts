import { createServerClient } from '@/lib/supabase/server';

/**
 * BCE Entity: FRACategory (User Story #38, #39, #40)
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
