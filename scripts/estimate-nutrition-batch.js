import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Same nutrition estimation rules (copied from the main script)
const NUTRITION_RULES = {
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

  ingredients: {
    'chicken': { calories: 120, protein: 25, carbs: 0, fat: 3 },
    'beef': { calories: 150, protein: 26, carbs: 0, fat: 5 },
    'pork': { calories: 140, protein: 25, carbs: 0, fat: 4 },
    'fish': { calories: 110, protein: 22, carbs: 0, fat: 2 },
    'shrimp': { calories: 85, protein: 18, carbs: 0, fat: 1 },
    'turkey': { calories: 125, protein: 24, carbs: 0, fat: 3 },
    'eggs': { calories: 70, protein: 6, carbs: 0, fat: 5 },
    'cheese': { calories: 100, protein: 7, carbs: 1, fat: 8 },
    'milk': { calories: 40, protein: 3, carbs: 5, fat: 2 },
    'cream': { calories: 80, protein: 2, carbs: 3, fat: 7 },
    'butter': { calories: 100, protein: 0, carbs: 0, fat: 11 },
    'pasta': { calories: 130, protein: 5, carbs: 25, fat: 1 },
    'rice': { calories: 110, protein: 2, carbs: 23, fat: 0 },
    'bread': { calories: 80, protein: 3, carbs: 15, fat: 1 },
    'potato': { calories: 90, protein: 2, carbs: 20, fat: 0 },
    'oil': { calories: 120, protein: 0, carbs: 0, fat: 14 },
    'sugar': { calories: 50, protein: 0, carbs: 12, fat: 0 }
  },

  dishModifiers: {
    'pasta': { calories: 1.2, protein: 1.1, carbs: 1.3, fat: 1.1 },
    'pizza': { calories: 1.3, protein: 1.2, carbs: 1.2, fat: 1.4 },
    'sandwich': { calories: 1.1, protein: 1.1, carbs: 1.2, fat: 1.2 },
    'soup': { calories: 0.8, protein: 1.0, carbs: 0.9, fat: 0.9 },
    'salad': { calories: 0.7, protein: 0.9, carbs: 0.8, fat: 1.2 },
    'fried': { calories: 1.4, protein: 1.0, carbs: 1.1, fat: 1.6 }
  }
};

function estimateNutrition(recipe) {
  const ingredients = recipe.ingredients || [];
  const name = (recipe.name || '').toLowerCase();
  const tags = (recipe.tags || []).map(tag => tag.toLowerCase());
  
  let dishType = 'dinner';
  if (tags.includes('breakfast')) dishType = 'breakfast';
  else if (tags.includes('dessert')) dishType = 'dessert';
  else if (name.includes('soup')) dishType = 'soup';
  else if (name.includes('salad')) dishType = 'salad';
  
  let calories = NUTRITION_RULES.baseCalories[dishType] || 350;
  let protein = 15;
  let carbs = 25;
  let fat = 12;
  
  const ingredientsText = ingredients.map(ing => ing.item.toLowerCase()).join(' ');
  
  for (const [ingredient, nutrition] of Object.entries(NUTRITION_RULES.ingredients)) {
    if (ingredientsText.includes(ingredient)) {
      calories += nutrition.calories;
      protein += nutrition.protein;
      carbs += nutrition.carbs;
      fat += nutrition.fat;
    }
  }
  
  for (const [dishType, modifier] of Object.entries(NUTRITION_RULES.dishModifiers)) {
    if (name.includes(dishType)) {
      calories *= modifier.calories;
      protein *= modifier.protein;
      carbs *= modifier.carbs;
      fat *= modifier.fat;
      break;
    }
  }
  
  const servings = recipe.servings || 4;
  calories = Math.round(calories / servings);
  protein = Math.round(protein / servings);
  carbs = Math.round(carbs / servings);
  fat = Math.round(fat / servings);
  
  const fiber = Math.round(carbs * 0.1);
  const sugar = Math.round(carbs * 0.3);
  
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

function processBatch(startIndex = 0, batchSize = 50) {
  const recipesPath = path.join(__dirname, '../src/data/recipes.ts');
  let content = fs.readFileSync(recipesPath, 'utf8');
  
  console.log(`🥗 Processing batch: recipes ${startIndex + 1} to ${startIndex + batchSize}`);
  
  // Find all recipe objects (even simpler pattern)
  const recipeRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?\}(?=\s*,|\s*\])/g;
  
  let match;
  let processed = 0;
  let updated = 0;
  let currentIndex = 0;
  
  while ((match = recipeRegex.exec(content)) !== null && processed < batchSize) {
    currentIndex++;
    
    // Skip if not in our batch range
    if (currentIndex < startIndex + 1) continue;
    if (currentIndex > startIndex + batchSize) break;
    
    processed++;
    const [fullMatch, id, name] = match;

    // Skip if nutrition already exists
    if (fullMatch.includes('nutrition:')) {
      console.log(`⏭️  Skipping ${name} (already has nutrition)`);
      continue;
    }

    // Extract basic recipe info for nutrition estimation
    const ingredients = [];
    const tags = [];

    // Try to extract ingredients - if parsing fails, use recipe name for estimation
    const ingredientsMatch = fullMatch.match(/ingredients:\s*\[([\s\S]*?)\]/);
    if (ingredientsMatch && ingredientsMatch[1].includes('item:')) {
      const ingredientMatches = ingredientsMatch[1].matchAll(/item:\s*"([^"]+)"/g);
      ingredients.push(...Array.from(ingredientMatches).map(m => ({
        amount: '1',
        unit: 'cup',
        item: m[1]
      })));
    }

    // Try to extract tags - if parsing fails, use recipe name for estimation
    const tagsMatch = fullMatch.match(/tags:\s*\[([\s\S]*?)\]/);
    if (tagsMatch && tagsMatch[1].includes('"')) {
      const tagMatches = tagsMatch[1].matchAll(/"([^"]+)"/g);
      tags.push(...Array.from(tagMatches).map(m => m[1]));
    }

    // If parsing failed, use recipe name to estimate nutrition type
    if (ingredients.length === 0 || tags.length === 0) {
      console.log(`⚠️  Parsing failed for ${name}, using name-based estimation`);
      // Add basic ingredients based on recipe name
      if (name.toLowerCase().includes('chicken')) {
        ingredients.push({ amount: '1', unit: 'lb', item: 'chicken' });
      } else if (name.toLowerCase().includes('beef')) {
        ingredients.push({ amount: '1', unit: 'lb', item: 'beef' });
      } else {
        ingredients.push({ amount: '1', unit: 'cup', item: 'mixed ingredients' });
      }

      // Add basic tags based on recipe name
      if (name.toLowerCase().includes('salad')) {
        tags.push('lunch', 'healthy');
      } else if (name.toLowerCase().includes('soup')) {
        tags.push('dinner', 'comfort');
      } else {
        tags.push('dinner');
      }
    }

    const recipe = {
      id,
      name,
      ingredients,
      tags,
      servings: 4
    };
    
    const nutrition = estimateNutrition(recipe);
    
    const nutritionInsertion = `,\n    nutrition: { calories: ${nutrition.calories}, protein: ${nutrition.protein}, carbs: ${nutrition.carbs}, fat: ${nutrition.fat}, fiber: ${nutrition.fiber}, sugar: ${nutrition.sugar}, servingSize: "${nutrition.servingSize}" }`;
    
    const recipeEndIndex = fullMatch.lastIndexOf('}');
    const beforeRecipeEnd = fullMatch.substring(0, recipeEndIndex);
    const afterRecipeEnd = fullMatch.substring(recipeEndIndex);
    
    const updatedRecipe = beforeRecipeEnd + nutritionInsertion + afterRecipeEnd;
    content = content.replace(fullMatch, updatedRecipe);
    updated++;
    
    console.log(`✅ ${name}: ${nutrition.calories} cal, ${nutrition.protein}g protein`);
  }
  
  // Write updated content
  fs.writeFileSync(recipesPath, content, 'utf8');
  
  console.log(`\n📊 Batch complete: Updated ${updated} recipes`);
  return { processed, updated, hasMore: processed === batchSize };
}

// Get command line arguments
const args = process.argv.slice(2);
const startIndex = parseInt(args[0]) || 0;
const batchSize = parseInt(args[1]) || 50;

console.log(`🚀 Starting nutrition estimation batch processing...`);
console.log(`📋 Batch size: ${batchSize} recipes`);
console.log(`📍 Starting from recipe: ${startIndex + 1}\n`);

const result = processBatch(startIndex, batchSize);

if (result.hasMore) {
  console.log(`\n🔄 Next batch command:`);
  console.log(`node scripts/estimate-nutrition-batch.js ${startIndex + batchSize} ${batchSize}`);
} else {
  console.log(`\n🎉 All recipes processed!`);
}

console.log(`\n✨ Batch ${Math.floor(startIndex / batchSize) + 1} complete!`);
