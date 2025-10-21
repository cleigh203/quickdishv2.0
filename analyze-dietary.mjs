import { readFileSync, writeFileSync } from 'fs';

// Define what makes a recipe qualify for each tag
const MEAT_KEYWORDS = [
  'chicken', 'beef', 'pork', 'turkey', 'lamb', 'duck', 'bacon', 'sausage',
  'ham', 'prosciutto', 'salami', 'pepperoni', 'meatball', 'ground meat',
  'steak', 'roast', 'ribs', 'brisket', 'pulled pork', 'rotisserie',
  'fish', 'salmon', 'tuna', 'tilapia', 'cod', 'shrimp', 'prawns', 'scallops',
  'crab', 'lobster', 'seafood', 'anchovies', 'sardines', 'clams', 'mussels',
  'chorizo', 'venison', 'veal', 'goose', 'pheasant', 'quail', 'rabbit',
  'mahi mahi', 'halibut', 'trout', 'catfish', 'sea bass'
];

const DAIRY_KEYWORDS = [
  'milk', 'cream', 'butter', 'cheese', 'yogurt', 'sour cream', 'cheddar',
  'mozzarella', 'parmesan', 'feta', 'brie', 'gouda', 'ricotta', 'mascarpone',
  'cream cheese', 'whipped cream', 'heavy cream', 'half and half', 'buttermilk',
  'monterey jack', 'swiss cheese', 'provolone', 'gruyere', 'blue cheese',
  'burrata', 'cottage cheese', 'queso', 'ghee'
];

const EGG_KEYWORDS = ['egg', 'eggs', 'egg white', 'egg yolk', 'mayonnaise', 'mayo'];

const HONEY_KEYWORDS = ['honey'];

const GLUTEN_KEYWORDS = [
  'flour', 'bread', 'pasta', 'noodles', 'spaghetti', 'penne', 'fettuccine',
  'tortilla', 'wrap', 'pita', 'bun', 'roll', 'biscuit', 'cracker', 'croutons',
  'panko', 'breadcrumb', 'wheat', 'barley', 'rye', 'soy sauce', 'teriyaki sauce',
  'pizza dough', 'pie crust', 'pastry', 'croissant', 'bagel', 'english muffin',
  'waffle', 'pancake', 'cereal', 'couscous', 'orzo', 'ravioli', 'tortellini',
  'gnocchi', 'dumpling', 'wonton', 'phyllo', 'puff pastry', 'breadstick',
  'linguine', 'rigatoni', 'macaroni', 'angel hair', 'lasagna', 'cannelloni'
];

// Exception keywords that allow the item even if it contains gluten keywords
const GLUTEN_FREE_EXCEPTIONS = [
  'gluten-free', 'gluten free', 'gf bread', 'gf flour', 'gf pasta',
  'rice noodles', 'rice flour', 'almond flour', 'coconut flour',
  'corn tortilla', 'tamari', 'coconut aminos', 'rice paper'
];

function containsKeyword(text, keywords) {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => {
    const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
    return pattern.test(lowerText);
  });
}

function hasGlutenFreeException(text) {
  const lowerText = text.toLowerCase();
  return GLUTEN_FREE_EXCEPTIONS.some(exception => lowerText.includes(exception));
}

// Read and parse recipes from the TypeScript file
const content = readFileSync('src/data/recipes.ts', 'utf8');

// Extract the recipes array
const recipesMatch = content.match(/export const recipes: Recipe\[\] = \[([\s\S]*?)\n\];/);
if (!recipesMatch) {
  console.error('❌ Could not find recipes array');
  process.exit(1);
}

console.log('🔍 Analyzing recipes for dietary tags...\n');

// Count recipes
const recipeIds = content.match(/id:\s*"[^"]+"/g);
console.log(`📊 Found ${recipeIds ? recipeIds.length : 0} recipes to analyze\n`);

// Parse individual recipes and suggest tags
const updates = [];
let vegetarianCount = 0;
let veganCount = 0;
let glutenFreeCount = 0;

// Simple regex to match recipe objects
const recipeRegex = /\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?ingredients:\s*\[([\s\S]*?)\][\s\S]*?tags:\s*\[([\s\S]*?)\][\s\S]*?\}(?=\s*,|\s*\])/g;

let match;
while ((match = recipeRegex.exec(content)) !== null) {
  const [fullMatch, id, name, ingredientsStr, tagsStr] = match;
  
  // Parse ingredients
  const ingredientMatches = ingredientsStr.matchAll(/item:\s*"([^"]+)"/g);
  const ingredients = Array.from(ingredientMatches).map(m => m[1]);
  
  // Parse existing tags
  const tagMatches = tagsStr.matchAll(/"([^"]+)"/g);
  const existingTags = Array.from(tagMatches).map(m => m[1]);
  
  if (ingredients.length === 0) continue;
  
  const ingredientsText = ingredients.join(' ');
  
  const hasMeat = containsKeyword(ingredientsText, MEAT_KEYWORDS);
  const hasDairy = containsKeyword(ingredientsText, DAIRY_KEYWORDS);
  const hasEggs = containsKeyword(ingredientsText, EGG_KEYWORDS);
  const hasHoney = containsKeyword(ingredientsText, HONEY_KEYWORDS);
  const hasGluten = containsKeyword(ingredientsText, GLUTEN_KEYWORDS);
  const hasGlutenException = hasGlutenFreeException(ingredientsText);
  
  const suggestedTags = [];
  
  // Vegetarian: no meat
  if (!hasMeat && !existingTags.includes('vegetarian')) {
    suggestedTags.push('vegetarian');
    vegetarianCount++;
  }
  
  // Vegan: no meat, dairy, eggs, or honey
  if (!hasMeat && !hasDairy && !hasEggs && !hasHoney && !existingTags.includes('vegan')) {
    suggestedTags.push('vegan');
    veganCount++;
  }
  
  // Gluten-free: no gluten OR has gluten-free exceptions
  if ((!hasGluten || hasGlutenException) && !existingTags.includes('gluten-free')) {
    suggestedTags.push('gluten-free');
    glutenFreeCount++;
  }
  
  if (suggestedTags.length > 0) {
    updates.push({
      id,
      name,
      existingTags,
      suggestedTags,
      ingredients: ingredients.slice(0, 3) // First 3 for verification
    });
  }
}

console.log('📋 DIETARY TAGS TO ADD:\n');
console.log(`🌱 Vegetarian: ${vegetarianCount} recipes`);
console.log(`🌿 Vegan: ${veganCount} recipes`);
console.log(`🌾 Gluten-Free: ${glutenFreeCount} recipes`);
console.log(`\n📝 Total recipes to update: ${updates.length}\n`);

// Show first 10 examples
console.log('📑 Sample recipes to be tagged (first 10):\n');
updates.slice(0, 10).forEach(({ name, suggestedTags, ingredients }) => {
  console.log(`✓ ${name}`);
  console.log(`  Tags to add: ${suggestedTags.join(', ')}`);
  console.log(`  Sample ingredients: ${ingredients.join(', ')}...`);
  console.log('');
});

// Save full report to file
writeFileSync('dietary-tags-report.json', JSON.stringify(updates, null, 2));
console.log('💾 Full report saved to: dietary-tags-report.json');
console.log('\n✅ Analysis complete! Ready to apply tags.');

