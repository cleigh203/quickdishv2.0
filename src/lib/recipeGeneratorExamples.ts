/**
 * Recipe Generator Usage Examples
 * 
 * This file demonstrates how to use the category-specific recipe generation
 */

import { generateRecipes, VALID_CATEGORIES } from './recipeGenerator';

/**
 * Example 1: Generate Restaurant Copycat Recipes
 */
export async function generateRestaurantCopycats() {
  const result = await generateRecipes({
    category: 'Restaurant Copycats',
    count: 5,
    options: {
      restaurantName: 'Chipotle', // Optional: specify specific restaurant
      dietary: 'none'
    }
  });
  
  console.log(`Generated ${result.generated} restaurant copycat recipes`);
  return result;
}

/**
 * Example 2: Generate Leftover Magic Recipes
 */
export async function generateLeftoverRecipes() {
  const result = await generateRecipes({
    category: 'Leftover Magic',
    count: 3,
    options: {
      leftoverIngredient: 'chicken', // Specify what leftover to use
    }
  });
  
  console.log(`Generated ${result.generated} leftover recipes`);
  return result;
}

/**
 * Example 3: Generate Healthy Bowl Recipes
 */
export async function generateHealthyBowls() {
  const result = await generateRecipes({
    category: 'Healthy Bowls',
    count: 4,
    options: {
      cuisine: 'Mediterranean',
      dietary: 'vegetarian'
    }
  });
  
  console.log(`Generated ${result.generated} healthy bowl recipes`);
  return result;
}

/**
 * Example 4: Generate Quick and Easy Recipes
 */
export async function generateQuickRecipes() {
  const result = await generateRecipes({
    category: 'Quick and Easy',
    count: 10,
    options: {
      cookTime: 20, // Under 20 minutes
      cuisine: 'Italian'
    }
  });
  
  console.log(`Generated ${result.generated} quick recipes`);
  return result;
}

/**
 * Example 5: Generate One Pot Wonders
 */
export async function generateOnePotRecipes() {
  const result = await generateRecipes({
    category: 'One Pot Wonders',
    count: 5,
    options: {
      dietary: 'none'
    }
  });
  
  console.log(`Generated ${result.generated} one-pot recipes`);
  return result;
}

/**
 * Example 6: Generate Halloween Recipes
 */
export async function generateHalloweenRecipes() {
  const result = await generateRecipes({
    category: 'Halloween',
    count: 8,
    options: {
      dietary: 'none'
    }
  });
  
  console.log(`Generated ${result.generated} Halloween recipes`);
  return result;
}

/**
 * Example 7: Bulk Generate All Categories
 */
export async function generateAllCategories() {
  const results = [];
  
  for (const category of VALID_CATEGORIES) {
    console.log(`\n--- Generating ${category} recipes ---`);
    
    try {
      const result = await generateRecipes({
        category,
        count: 5,
        options: getDefaultOptionsForCategory(category)
      });
      
      results.push({
        category,
        success: true,
        generated: result.generated,
        errors: result.errors
      });
      
      console.log(`✓ Generated ${result.generated} ${category} recipes`);
      
      // Wait 2 seconds between categories to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`✗ Failed to generate ${category}:`, error);
      results.push({
        category,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

/**
 * Helper: Get default options for each category
 */
function getDefaultOptionsForCategory(category: string) {
  switch (category) {
    case 'Restaurant Copycats':
      return { restaurantName: 'popular restaurants' };
    case 'Leftover Magic':
      return { leftoverIngredient: 'chicken' };
    case 'Quick and Easy':
      return { cookTime: 25 };
    case 'Healthy Bowls':
      return { cuisine: 'Various' };
    case 'Halloween':
      return { dietary: 'none' };
    case 'Fall Favorites':
      return { cuisine: 'American' };
    default:
      return {};
  }
}

/**
 * Example 8: Generate with Error Handling
 */
export async function generateWithErrorHandling(category: any, count: number) {
  try {
    // Validate category before making the call
    if (!VALID_CATEGORIES.includes(category as any)) {
      throw new Error(`Invalid category: ${category}. Valid categories are: ${VALID_CATEGORIES.join(', ')}`);
    }
    
    const result = await generateRecipes({
      category,
      count,
    });
    
    // Check for partial failures
    if (result.errors && result.errors.length > 0) {
      console.warn('Some recipes failed to generate:', result.errors);
    }
    
    // Check success rate
    const successRate = (result.generated / result.requested) * 100;
    if (successRate < 80) {
      console.warn(`Low success rate: ${successRate.toFixed(1)}% (${result.generated}/${result.requested})`);
    }
    
    return result;
    
  } catch (error) {
    console.error('Recipe generation error:', error);
    throw error;
  }
}
