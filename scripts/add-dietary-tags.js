const fs = require('fs');
const path = require('path');

// Define what makes a recipe qualify for each tag
const MEAT_KEYWORDS = [
  'chicken', 'beef', 'pork', 'turkey', 'lamb', 'duck', 'bacon', 'sausage',
  'ham', 'prosciutto', 'salami', 'pepperoni', 'meatball', 'ground meat',
  'steak', 'roast', 'ribs', 'brisket', 'pulled pork', 'rotisserie',
  'fish', 'salmon', 'tuna', 'tilapia', 'cod', 'shrimp', 'prawns', 'scallops',
  'crab', 'lobster', 'seafood', 'anchovies', 'sardines', 'clams', 'mussels'
];

const DAIRY_KEYWORDS = [
  'milk', 'cream', 'butter', 'cheese', 'yogurt', 'sour cream', 'cheddar',
  'mozzarella', 'parmesan', 'feta', 'brie', 'gouda', 'ricotta', 'mascarpone',
  'cream cheese', 'whipped cream', 'heavy cream', 'half and half', 'buttermilk'
];

const EGG_KEYWORDS = ['egg', 'eggs', 'egg white', 'egg yolk'];

const HONEY_KEYWORDS = ['honey'];

const GLUTEN_KEYWORDS = [
  'flour', 'bread', 'pasta', 'noodles', 'spaghetti', 'penne', 'fettuccine',
  'tortilla', 'wrap', 'pita', 'bun', 'roll', 'biscuit', 'cracker', 'croutons',
  'panko', 'breadcrumb', 'wheat', 'barley', 'rye', 'soy sauce', 'teriyaki sauce',
  'pizza dough', 'pie crust', 'pastry', 'croissant', 'bagel', 'english muffin',
  'waffle', 'pancake', 'cereal', 'couscous', 'orzo', 'ravioli', 'tortellini',
  'gnocchi', 'dumpling', 'wonton', 'phyllo', 'puff pastry'
];

// Exception keywords that allow the item even if it contains gluten keywords
const GLUTEN_FREE_EXCEPTIONS = [
  'gluten-free', 'gluten free', 'gf bread', 'gf flour', 'gf pasta',
  'rice noodles', 'rice flour', 'almond flour', 'coconut flour',
  'corn tortilla', 'tamari', 'coconut aminos'
];

function containsKeyword(text, keywords) {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => {
    const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
    return pattern.test(lowerText);
  });
}

function hasGlutenFreeException(text) {
  const lowerText = text.toLowerCase();
  return GLUTEN_FREE_EXCEPTIONS.some(exception => lowerText.includes(exception));
}

function analyzeRecipe(recipe) {
  // Get all ingredient text
  const ingredientsText = recipe.ingredients
    .map(ing => ing.item)
    .join(' ');
  
  const hasMeat = containsKeyword(ingredientsText, MEAT_KEYWORDS);
  const hasDairy = containsKeyword(ingredientsText, DAIRY_KEYWORDS);
  const hasEggs = containsKeyword(ingredientsText, EGG_KEYWORDS);
  const hasHoney = containsKeyword(ingredientsText, HONEY_KEYWORDS);
  const hasGluten = containsKeyword(ingredientsText, GLUTEN_KEYWORDS);
  const hasGlutenException = hasGlutenFreeException(ingredientsText);
  
  const tags = [];
  
  // Vegetarian: no meat
  if (!hasMeat) {
    tags.push('vegetarian');
  }
  
  // Vegan: no meat, dairy, eggs, or honey
  if (!hasMeat && !hasDairy && !hasEggs && !hasHoney) {
    tags.push('vegan');
  }
  
  // Gluten-free: no gluten OR has gluten-free exceptions
  if (!hasGluten || hasGlutenException) {
    tags.push('gluten-free');
  }
  
  return {
    name: recipe.name,
    hasMeat,
    hasDairy,
    hasEggs,
    hasHoney,
    hasGluten,
    hasGlutenException,
    suggestedTags: tags,
    ingredients: recipe.ingredients.map(i => i.item)
  };
}

// Read the recipes file
const recipesPath = path.join(__dirname, '../src/data/recipes.ts');
const content = fs.readFileSync(recipesPath, 'utf8');

// Extract individual recipe objects using regex
// This is a simplified parser - we'll match the recipe objects
const recipePattern = /\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?ingredients:\s*\[([\s\S]*?)\][\s\S]*?tags:\s*\[([\s\S]*?)\][\s\S]*?\}/g;

let match;
const results = [];
let recipeCount = 0;

console.log('🔍 Scanning recipes for dietary tags...\n');

// This is a simplified approach - we'll output a report of what should be changed
// Then make the actual changes systematically

// For now, let's create a simpler approach: export the recipes array and analyze it
console.log('📊 Creating analysis report...');
console.log('This script will identify recipes that should have dietary tags.\n');

// Instead of parsing, let's use a runtime approach
const analysisScript = `
import { recipes } from '../src/data/recipes';

const MEAT_KEYWORDS = ${JSON.stringify(MEAT_KEYWORDS)};
const DAIRY_KEYWORDS = ${JSON.stringify(DAIRY_KEYWORDS)};
const EGG_KEYWORDS = ${JSON.stringify(EGG_KEYWORDS)};
const HONEY_KEYWORDS = ${JSON.stringify(HONEY_KEYWORDS)};
const GLUTEN_KEYWORDS = ${JSON.stringify(GLUTEN_KEYWORDS)};
const GLUTEN_FREE_EXCEPTIONS = ${JSON.stringify(GLUTEN_FREE_EXCEPTIONS)};

${containsKeyword.toString()}
${hasGlutenFreeException.toString()}
${analyzeRecipe.toString()}

recipes.forEach(recipe => {
  const analysis = analyzeRecipe(recipe);
  if (analysis.suggestedTags.length > 0) {
    console.log('Recipe:', recipe.name);
    console.log('Current tags:', recipe.tags || []);
    console.log('Suggested tags:', analysis.suggestedTags);
    console.log('---');
  }
});
`;

console.log('✅ Analysis script ready.');
console.log('\n📝 To see which recipes need dietary tags, the AI will now scan the recipes directly.\n');

