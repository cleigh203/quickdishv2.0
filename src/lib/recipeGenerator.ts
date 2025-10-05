import { supabase } from "@/integrations/supabase/client";

// CRITICAL: These are the ONLY valid categories
export const VALID_CATEGORIES = [
  'Halloween',
  'Fall Favorites',
  'Quick and Easy',
  'Restaurant Copycats',
  'Breakfast',
  'Lunch Ideas',
  'Dinner',
  'Desserts',
  'One Pot Wonders',
  'Healthy Bowls',
  'Leftover Magic',
  'Family Favorites',
] as const;

export type RecipeCategory = typeof VALID_CATEGORIES[number];

export interface RecipeGenerationOptions {
  cuisine?: string;
  dietary?: string;
  cookTime?: number;
  restaurantName?: string; // For Restaurant Copycats
  leftoverIngredient?: string; // For Leftover Magic
}

export interface GenerateRecipesParams {
  category: RecipeCategory;
  count: number;
  options?: RecipeGenerationOptions;
}

export interface GeneratedRecipe {
  id: string;
  recipe_id: string;
  name: string;
  description: string;
  cuisine: string;
  difficulty: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  ingredients: any[];
  instructions: string[];
  tags: string[];
  image_url: string;
  source: string;
  ai_generated: boolean;
  needs_validation: boolean;
  verified: boolean;
}

export interface BulkGenerationResult {
  success: boolean;
  generated: number;
  requested: number;
  recipes: GeneratedRecipe[];
  errors?: Array<{ recipe: number; error: string }>;
}

/**
 * Generate multiple recipes using AI
 * 
 * @param params - Generation parameters
 * @returns Promise with generation results
 * 
 * @example
 * ```typescript
 * const result = await generateRecipes({
 *   category: 'Dinner',
 *   count: 5,
 *   options: {
 *     cuisine: 'Italian',
 *     dietary: 'vegetarian'
 *   }
 * });
 * 
 * console.log(`Generated ${result.generated} recipes`);
 * ```
 */
export async function generateRecipes(
  params: GenerateRecipesParams
): Promise<BulkGenerationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-bulk-recipes', {
      body: params,
    });

    if (error) {
      console.error('Error calling generate-bulk-recipes:', error);
      throw new Error(error.message || 'Failed to generate recipes');
    }

    return data as BulkGenerationResult;
  } catch (error) {
    console.error('Error in generateRecipes:', error);
    throw error;
  }
}

/**
 * Generate a single recipe
 * 
 * @param category - Recipe category (one of the 12 valid categories)
 * @param options - Optional generation parameters
 * @returns Promise with the generated recipe or null if failed
 */
export async function generateSingleRecipe(
  category: RecipeCategory,
  options?: RecipeGenerationOptions
): Promise<GeneratedRecipe | null> {
  const result = await generateRecipes({
    category,
    count: 1,
    options,
  });

  if (result.recipes && result.recipes.length > 0) {
    return result.recipes[0];
  }

  return null;
}

/**
 * Validate that a category is one of the 12 valid categories
 */
export function isValidCategory(category: string): category is RecipeCategory {
  return VALID_CATEGORIES.includes(category as RecipeCategory);
}
