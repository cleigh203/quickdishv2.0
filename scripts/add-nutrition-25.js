const fs = require('fs');
const path = require('path');

function estimateNutrition(recipe) {
  const name = (recipe.name || '').toLowerCase();
  const tags = (recipe.tags || []).map(tag => tag.toLowerCase());
  const ingredientsText = recipe.ingredients.map(ing => ing.item.toLowerCase()).join(' ');
  
  // Base calories by dish type
  let calories = 350; // default
  if (tags.includes('breakfast')) calories = 280;
  else if (tags.includes('dessert')) calories = 350;
  else if (name.includes('soup')) calories = 200;
  else if (name.includes('salad')) calories = 250;
  else if (tags.includes('dinner')) calories = 420;
  
  // Add calories for main ingredients
  if (ingredientsText.includes('chicken')) calories += 120;
  if (ingredientsText.includes('beef')) calories += 150;
  if (ingredientsText.includes('pork')) calories += 140;
  if (ingredientsText.includes('fish')) calories += 110;
  if (ingredientsText.includes('cheese')) calories += 100;
  if (ingredientsText.includes('pasta')) calories += 130;
  if (ingredientsText.includes('rice')) calories += 110;
  if (ingredientsText.includes('bread')) calories += 80;
  if (ingredientsText.includes('butter')) calories += 100;
  if (ingredientsText.includes('oil')) calories += 120;
  
  // Dish modifiers
  if (name.includes('pasta')) calories *= 1.2;
  if (name.includes('pizza')) calories *= 1.3;
  if (name.includes('fried')) calories *= 1.4;
  if (name.includes('soup')) calories *= 0.8;
  
  // Adjust for servings
  const servings = recipe.servings || 4;
  calories = Math.round(calories / servings);
  
  // Estimate other macros
  let protein = 15;
  if (ingredientsText.includes('chicken')) protein += 25;
  if (ingredientsText.includes('beef')) protein += 26;
  if (ingredientsText.includes('fish')) protein += 22;
  if (ingredientsText.includes('cheese')) protein += 7;
  
  let carbs = 25;
  if (ingredientsText.includes('pasta')) carbs += 25;
  if (ingredientsText.includes('rice')) carbs += 23;
  if (ingredientsText.includes('bread')) carbs += 15;
  
  let fat = 12;
  if (ingredientsText.includes('cheese')) fat += 8;
  if (ingredientsText.includes('butter')) fat += 11;
  if (ingredientsText.includes('oil')) fat += 14;
  
  protein = Math.round(protein / servings);
  carbs = Math.round(carbs / servings);
  fat = Math.round(fat / servings);
  
  // Ensure reasonable bounds
  calories = Math.max(150, Math.min(800, calories));
  protein = Math.max(5, Math.min(60, protein));
  carbs = Math.max(5, Math.min(100, carbs));
  fat = Math.max(2, Math.min(50, fat));
  
  const fiber = Math.round(carbs * 0.1);
  const sugar = Math.round(carbs * 0.3);
  
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

function addNutritionToNext25() {
  const recipesPath = path.join(__dirname, '../src/data/recipes.ts');
  let content = fs.readFileSync(recipesPath, 'utf8');
  
  console.log('🥗 Adding nutrition to next 25 recipes...\n');
  
  // Simple regex to find recipes without nutrition
  const recipeRegex = /(\{\s*id:\s*"[^"]+"[\s\S]*?tags:\s*\[[^\]]*\][\s\S]*?)(\})(?=\s*,|\s*\])/g;
  
  let match;
  let updated = 0;
  let checked = 0;
  
  while ((match = recipeRegex.exec(content)) !== null && updated < 25) {
    checked++;
    const [fullMatch, recipeContent, closingBrace] = match;
    
    // Skip if nutrition already exists
    if (fullMatch.includes('nutrition:')) {
      continue;
    }
    
    // Extract recipe name for logging
    const nameMatch = fullMatch.match(/name:\s*"([^"]+)"/);
    const recipeName = nameMatch ? nameMatch[1] : 'Unknown Recipe';
    
    // Extract ingredients
    const ingredientsMatch = fullMatch.match(/ingredients:\s*\[([\s\S]*?)\]/);
    if (!ingredientsMatch) continue;
    
    const ingredientsText = ingredientsMatch[1];
    const ingredientItems = [];
    const itemRegex = /item:\s*"([^"]+)"/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(ingredientsText)) !== null) {
      ingredientItems.push({
        amount: '1',
        unit: 'cup',
        item: itemMatch[1]
      });
    }
    
    if (ingredientItems.length === 0) continue;
    
    // Extract tags
    const tagsMatch = fullMatch.match(/tags:\s*\[([\s\S]*?)\]/);
    const tags = tagsMatch ? 
      Array.from(tagsMatch[1].matchAll(/"([^"]+)"/g)).map(m => m[1]) : 
      [];
    
    // Create recipe object
    const recipe = {
      name: recipeName,
      ingredients: ingredientItems,
      tags,
      servings: 4
    };
    
    // Estimate nutrition
    const nutrition = estimateNutrition(recipe);
    
    // Insert nutrition data
    const nutritionData = `,\n    nutrition: { calories: ${nutrition.calories}, protein: ${nutrition.protein}, carbs: ${nutrition.carbs}, fat: ${nutrition.fat}, fiber: ${nutrition.fiber}, sugar: ${nutrition.sugar}, servingSize: "${nutrition.servingSize}" }`;
    
    const updatedRecipe = recipeContent + nutritionData + closingBrace;
    content = content.replace(fullMatch, updatedRecipe);
    updated++;
    
    console.log(`✅ ${updated}/25: ${recipeName} - ${nutrition.calories} cal, ${nutrition.protein}g protein`);
  }
  
  // Write updated content
  fs.writeFileSync(recipesPath, content, 'utf8');
  
  console.log(`\n🎉 Updated ${updated} recipes with nutrition data!`);
  console.log(`📁 File saved successfully`);
  
  if (updated === 25) {
    console.log(`\n🔄 Run this script again to process the next 25 recipes`);
  } else {
    console.log(`\n✨ All recipes now have nutrition data!`);
  }
}

// Run the script
addNutritionToNext25();
