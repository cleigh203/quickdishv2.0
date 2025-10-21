const fs = require('fs');
const path = require('path');

// Nutrition estimation rules based on ingredient analysis
const NUTRITION_RULES = {
  // Base calories per serving by dish type
  baseCalories: {
    'dessert': 350,
    'breakfast': 280,
    'lunch': 320,
    'dinner': 420,
    'side': 180,
    'snack': 150,
    'soup': 200,
    'salad': 250,
    'drink': 120
  },

  // Ingredient multipliers (calories per typical amount)
  ingredients: {
    // Proteins
    'chicken': { calories: 120, protein: 25, carbs: 0, fat: 3 },
    'beef': { calories: 150, protein: 26, carbs: 0, fat: 5 },
    'pork': { calories: 140, protein: 25, carbs: 0, fat: 4 },
    'fish': { calories: 110, protein: 22, carbs: 0, fat: 2 },
    'shrimp': { calories: 85, protein: 18, carbs: 0, fat: 1 },
    'turkey': { calories: 125, protein: 24, carbs: 0, fat: 3 },
    'lamb': { calories: 160, protein: 25, carbs: 0, fat: 6 },
    'eggs': { calories: 70, protein: 6, carbs: 0, fat: 5 },
    
    // Dairy
    'cheese': { calories: 100, protein: 7, carbs: 1, fat: 8 },
    'milk': { calories: 40, protein: 3, carbs: 5, fat: 2 },
    'cream': { calories: 80, protein: 2, carbs: 3, fat: 7 },
    'butter': { calories: 100, protein: 0, carbs: 0, fat: 11 },
    'yogurt': { calories: 60, protein: 10, carbs: 6, fat: 2 },
    
    // Carbs
    'pasta': { calories: 130, protein: 5, carbs: 25, fat: 1 },
    'rice': { calories: 110, protein: 2, carbs: 23, fat: 0 },
    'bread': { calories: 80, protein: 3, carbs: 15, fat: 1 },
    'potato': { calories: 90, protein: 2, carbs: 20, fat: 0 },
    'tortilla': { calories: 60, protein: 2, carbs: 12, fat: 1 },
    'flour': { calories: 100, protein: 3, carbs: 20, fat: 0 },
    
    // Vegetables
    'tomato': { calories: 15, protein: 1, carbs: 3, fat: 0 },
    'onion': { calories: 20, protein: 1, carbs: 5, fat: 0 },
    'pepper': { calories: 15, protein: 1, carbs: 3, fat: 0 },
    'broccoli': { calories: 10, protein: 1, carbs: 2, fat: 0 },
    'carrot': { calories: 20, protein: 0, carbs: 5, fat: 0 },
    'lettuce': { calories: 5, protein: 0, carbs: 1, fat: 0 },
    'spinach': { calories: 5, protein: 1, carbs: 1, fat: 0 },
    
    // Fats/Oils
    'oil': { calories: 120, protein: 0, carbs: 0, fat: 14 },
    'olive oil': { calories: 120, protein: 0, carbs: 0, fat: 14 },
    'vegetable oil': { calories: 120, protein: 0, carbs: 0, fat: 14 },
    
    // Nuts/Seeds
    'almond': { calories: 160, protein: 6, carbs: 6, fat: 14 },
    'walnut': { calories: 180, protein: 4, carbs: 4, fat: 18 },
    'peanut': { calories: 160, protein: 7, carbs: 6, fat: 14 },
    
    // Sweeteners
    'sugar': { calories: 50, protein: 0, carbs: 12, fat: 0 },
    'honey': { calories: 60, protein: 0, carbs: 17, fat: 0 },
    'maple syrup': { calories: 50, protein: 0, carbs: 12, fat: 0 },
    
    // Spices (minimal impact)
    'salt': { calories: 0, protein: 0, carbs: 0, fat: 0 },
    'pepper': { calories: 0, protein: 0, carbs: 0, fat: 0 },
    'garlic': { calories: 5, protein: 0, carbs: 1, fat: 0 },
    'ginger': { calories: 5, protein: 0, carbs: 1, fat: 0 },
    'herbs': { calories: 0, protein: 0, carbs: 0, fat: 0 }
  },

  // Dish type modifiers
  dishModifiers: {
    'pasta': { calories: 1.2, protein: 1.1, carbs: 1.3, fat: 1.1 },
    'pizza': { calories: 1.3, protein: 1.2, carbs: 1.2, fat: 1.4 },
    'sandwich': { calories: 1.1, protein: 1.1, carbs: 1.2, fat: 1.2 },
    'soup': { calories: 0.8, protein: 1.0, carbs: 0.9, fat: 0.9 },
    'salad': { calories: 0.7, protein: 0.9, carbs: 0.8, fat: 1.2 },
    'stir-fry': { calories: 1.1, protein: 1.0, carbs: 0.9, fat: 1.3 },
    'curry': { calories: 1.2, protein: 1.1, carbs: 1.1, fat: 1.3 },
    'casserole': { calories: 1.3, protein: 1.2, carbs: 1.2, fat: 1.4 },
    'grilled': { calories: 0.9, protein: 1.2, carbs: 0.8, fat: 0.8 },
    'baked': { calories: 1.1, protein: 1.1, carbs: 1.1, fat: 1.2 },
    'fried': { calories: 1.4, protein: 1.0, carbs: 1.1, fat: 1.6 }
  }
};

function estimateNutrition(recipe) {
  const ingredients = recipe.ingredients || [];
  const name = (recipe.name || '').toLowerCase();
  const description = (recipe.description || '').toLowerCase();
  const tags = (recipe.tags || []).map(tag => tag.toLowerCase());
  
  // Determine dish type
  let dishType = 'dinner'; // default
  if (tags.includes('breakfast')) dishType = 'breakfast';
  else if (tags.includes('lunch')) dishType = 'lunch';
  else if (tags.includes('dessert')) dishType = 'dessert';
  else if (tags.includes('side')) dishType = 'side';
  else if (tags.includes('snack')) dishType = 'snack';
  else if (name.includes('soup')) dishType = 'soup';
  else if (name.includes('salad')) dishType = 'salad';
  else if (name.includes('drink') || name.includes('smoothie')) dishType = 'drink';
  
  // Get base calories
  let calories = NUTRITION_RULES.baseCalories[dishType] || 350;
  let protein = 15; // base protein
  let carbs = 25;   // base carbs
  let fat = 12;     // base fat
  
  // Analyze ingredients
  const ingredientsText = ingredients.map(ing => ing.item.toLowerCase()).join(' ');
  
  for (const [ingredient, nutrition] of Object.entries(NUTRITION_RULES.ingredients)) {
    if (ingredientsText.includes(ingredient)) {
      // Estimate amount based on typical usage
      let multiplier = 1;
      if (ingredientsText.includes(`1 lb ${ingredient}`) || ingredientsText.includes(`${ingredient} (1 lb)`)) {
        multiplier = 2;
      } else if (ingredientsText.includes(`2 cups ${ingredient}`) || ingredientsText.includes(`${ingredient} (2 cups)`)) {
        multiplier = 1.5;
      } else if (ingredientsText.includes(`1/2 cup ${ingredient}`) || ingredientsText.includes(`${ingredient} (1/2 cup)`)) {
        multiplier = 0.5;
      } else if (ingredientsText.includes(`1/4 cup ${ingredient}`) || ingredientsText.includes(`${ingredient} (1/4 cup)`)) {
        multiplier = 0.25;
      }
      
      calories += nutrition.calories * multiplier;
      protein += nutrition.protein * multiplier;
      carbs += nutrition.carbs * multiplier;
      fat += nutrition.fat * multiplier;
    }
  }
  
  // Apply dish type modifiers
  for (const [dishType, modifier] of Object.entries(NUTRITION_RULES.dishModifiers)) {
    if (name.includes(dishType) || description.includes(dishType)) {
      calories *= modifier.calories;
      protein *= modifier.protein;
      carbs *= modifier.carbs;
      fat *= modifier.fat;
      break;
    }
  }
  
  // Adjust for servings
  const servings = recipe.servings || 4;
  calories = Math.round(calories / servings);
  protein = Math.round(protein / servings);
  carbs = Math.round(carbs / servings);
  fat = Math.round(fat / servings);
  
  // Calculate fiber and sugar estimates
  const fiber = Math.round(carbs * 0.1); // Rough estimate: 10% of carbs is fiber
  const sugar = Math.round(carbs * 0.3); // Rough estimate: 30% of carbs is sugar
  
  // Ensure reasonable bounds
  calories = Math.max(150, Math.min(800, calories));
  protein = Math.max(5, Math.min(60, protein));
  carbs = Math.max(5, Math.min(100, carbs));
  fat = Math.max(2, Math.min(50, fat));
  
  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    servingSize: `1 serving (serves ${servings})`
  };
}

function addNutritionToRecipes() {
  const recipesPath = path.join(__dirname, '../src/data/recipes.ts');
  let content = fs.readFileSync(recipesPath, 'utf8');
  
  // Find all recipe objects
  const recipeRegex = /\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?ingredients:\s*\[([\s\S]*?)\][\s\S]*?tags:\s*\[([\s\S]*?)\][\s\S]*?\}(?=\s*,|\s*\])/g;
  
  let match;
  let updatedCount = 0;
  let totalCount = 0;
  
  while ((match = recipeRegex.exec(content)) !== null) {
    totalCount++;
    const [fullMatch, id, name, ingredientsStr, tagsStr] = match;
    
    // Check if nutrition already exists
    if (fullMatch.includes('nutrition:')) {
      continue; // Skip recipes that already have nutrition
    }
    
    // Parse ingredients
    const ingredientMatches = ingredientsStr.matchAll(/item:\s*"([^"]+)"/g);
    const ingredients = Array.from(ingredientMatches).map(m => ({
      amount: '1', // Default amount for estimation
      unit: 'cup',
      item: m[1]
    }));
    
    // Parse tags
    const tagMatches = tagsStr.matchAll(/"([^"]+)"/g);
    const tags = Array.from(tagMatches).map(m => m[1]);
    
    // Create recipe object for estimation
    const recipe = {
      id,
      name,
      ingredients,
      tags,
      servings: 4 // Default servings
    };
    
    // Estimate nutrition
    const nutrition = estimateNutrition(recipe);
    
    // Insert nutrition data before the closing brace
    const nutritionInsertion = `,\n    nutrition: { calories: ${nutrition.calories}, protein: ${nutrition.protein}, carbs: ${nutrition.carbs}, fat: ${nutrition.fat}, fiber: ${nutrition.fiber}, sugar: ${nutrition.sugar}, servingSize: "${nutrition.servingSize}" }`;
    
    // Find the position to insert (before the last closing brace of the recipe object)
    const recipeEndIndex = fullMatch.lastIndexOf('}');
    const beforeRecipeEnd = fullMatch.substring(0, recipeEndIndex);
    const afterRecipeEnd = fullMatch.substring(recipeEndIndex);
    
    const updatedRecipe = beforeRecipeEnd + nutritionInsertion + afterRecipeEnd;
    
    // Replace in content
    content = content.replace(fullMatch, updatedRecipe);
    updatedCount++;
    
    console.log(`✅ Added nutrition to: ${name} (${nutrition.calories} cal, ${nutrition.protein}g protein)`);
  }
  
  // Write updated content
  fs.writeFileSync(recipesPath, content, 'utf8');
  
  console.log(`\n🎉 Nutrition estimation complete!`);
  console.log(`📊 Updated ${updatedCount} out of ${totalCount} recipes`);
  console.log(`📁 File saved: ${recipesPath}`);
  
  return { updatedCount, totalCount };
}

// Run the script
if (require.main === module) {
  console.log('🥗 Starting nutrition estimation...\n');
  const result = addNutritionToRecipes();
  console.log(`\n✨ All done! Added nutrition data to ${result.updatedCount} recipes.`);
}

module.exports = { estimateNutrition, addNutritionToRecipes };
