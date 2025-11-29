import { PantryItem, PantryCategory } from "@/types/pantry";

/**
 * Matches a pantry item to a recipe ingredient with fuzzy matching and substitutions
 */
export const ingredientMatch = (pantryItem: string, recipeIngredient: string): boolean => {
  const pantry = pantryItem.toLowerCase().trim();
  const recipe = recipeIngredient.toLowerCase().trim();
  
  // Exact match
  if (pantry === recipe) return true;
  
  // Contains match (either direction)
  if (pantry.includes(recipe) || recipe.includes(pantry)) return true;
  
  // Common substitutions
  const substitutions: Record<string, string[]> = {
    'chicken breast': ['chicken', 'poultry'],
    'chicken thigh': ['chicken', 'poultry'],
    'all-purpose flour': ['flour'],
    'whole wheat flour': ['flour'],
    'olive oil': ['oil', 'vegetable oil'],
    'canola oil': ['oil', 'vegetable oil'],
    'white sugar': ['sugar'],
    'brown sugar': ['sugar'],
    'salt': ['sea salt', 'kosher salt'],
    'milk': ['whole milk', '2% milk', 'skim milk'],
  };
  
  for (const [key, values] of Object.entries(substitutions)) {
    if (pantry.includes(key) && values.some(v => recipe.includes(v))) return true;
    if (recipe.includes(key) && values.some(v => pantry.includes(v))) return true;
  }
  
  return false;
};

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

/**
 * Normalizes ingredient name for fuzzy matching
 */
const normalizeIngredient = (ingredient: string): string => {
  return ingredient
    .toLowerCase()
    .replace(/[,.].*$/, '') // Remove everything after comma/period
    .trim()
    .replace(/s$/, ''); // Remove trailing 's' for plurals
};

/**
 * Checks if an ingredient exists in pantry with fuzzy matching
 */
export const isInPantry = (
  ingredientName: string,
  pantryItems: PantryItem[]
): boolean => {
  const normalizedIngredient = normalizeIngredient(ingredientName);
  
  console.log('Checking ingredient:', ingredientName, '→ normalized:', normalizedIngredient);
  console.log('Against pantry:', pantryItems.map(p => p.name));
  
  const match = pantryItems.some(item => {
    const normalizedPantry = normalizeIngredient(item.name);
    // Check if either contains the other (handles "ginger" vs "fresh ginger")
    const isMatch = normalizedIngredient.includes(normalizedPantry) || 
                    normalizedPantry.includes(normalizedIngredient);
    
    if (isMatch) {
      console.log('✅ MATCH:', ingredientName, 'matches pantry item:', item.name);
    }
    
    return isMatch;
  });
  
  if (!match) {
    console.log('❌ NO MATCH for:', ingredientName);
  }
  
  return match;
};

/**
 * Filters shopping list by removing items that exist in pantry
 */
export const filterShoppingListByPantry = (
  shoppingList: ShoppingItem[],
  pantryItems: PantryItem[]
): { filtered: ShoppingItem[]; removed: ShoppingItem[] } => {
  const filtered: ShoppingItem[] = [];
  const removed: ShoppingItem[] = [];

  shoppingList.forEach(item => {
    if (isInPantry(item.item, pantryItems)) {
      removed.push(item);
    } else {
      filtered.push(item);
    }
  });

  return { filtered, removed };
};

/**
 * Converts shopping items to pantry items
 */
export const shoppingItemsToPantry = (
  items: ShoppingItem[]
): PantryItem[] => {
  return items.map(item => ({
    id: `pantry-${Date.now()}-${Math.random()}`,
    name: item.item,
    quantity: parseFloat(item.amount || '1') || 1,
    unit: item.amount?.replace(/[\d\s.]+/, '').trim() || 'unit',
    category: 'other' as const,
    addedDate: new Date().toISOString(),
  }));
};

/**
 * Groups pantry items by category
 */
export const groupPantryByCategory = (items: PantryItem[]) => {
  const grouped: Record<string, PantryItem[]> = {};
  
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  return grouped;
};

/**
 * Auto-categorize pantry item based on name
 */
export const autoCategorizePantryItem = (itemName: string): PantryCategory => {
  const name = itemName.toLowerCase();

  // Debug paprika specifically
  if (name.includes('paprika')) {
    console.log('🌶️ PAPRIKA CATEGORIZATION - Item:', itemName, 'Lowercase:', name);
  }
  
  // Condiments & Seasonings (CHECK FIRST - before produce catches "pepper")
  if (name.includes('black pepper') || name.includes('white pepper') || 
      name.includes('red pepper flakes') || name.includes('cayenne pepper') ||
      name.includes('pepper flakes') || name.includes('peppercorn') ||
      (name.includes('pepper') && !name.includes('bell pepper') && !name.includes('jalapeño'))) {
    return 'spices';
  }
  
  if (name.includes('salt') || name.includes('sugar') ||
      name.includes('spice') || name.includes('oil') || name.includes('vinegar') ||
      name.includes('ketchup') || name.includes('mustard') || name.includes('mayo') ||
      name.includes('soy sauce') || name.includes('hot sauce') || name.includes('worcestershire') ||
      name.includes('paprika')) {
    return 'spices';
  }
  
  // Canned & Packaged Tomato Products (CHECK BEFORE produce catches "tomato")
  if (name.includes('tomato sauce') || name.includes('canned tomato') || 
      name.includes('tomato paste') || name.includes('crushed tomato') ||
      name.includes('diced tomato') || name.includes('tomato puree') ||
      (name.includes('tomato') && (name.includes('can') || name.includes('sauce')))) {
    return 'pantry';
  }
  
  // Canned & Packaged
  if (name.includes('canned') || name.includes('jar') || name.includes('box') ||
      name.includes('beans') || name.includes('soup') || name.includes('sauce') ||
      name.includes('broth') || name.includes('stock') || name.includes('bouillon')) {
    return 'pantry';
  }
  
  // Baking Ingredients & Pantry Staples
  if (name.includes('baking powder') || name.includes('baking soda') || 
      name.includes('vanilla extract') || name.includes('vanilla') ||
      name.includes('garlic') || name.includes('ginger') ||
      name.includes('cinnamon') || name.includes('nutmeg') ||
      name.includes('cocoa') || name.includes('chocolate chips') ||
      name.includes('yeast') || name.includes('cornstarch') ||
      name.includes('baking') || name.includes('extract')) {
    return 'pantry';
  }
  
  // Dairy & Eggs
  if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
      name.includes('butter') || name.includes('cream') || name.includes('egg')) {
    return 'dairy';
  }
  
  // Meat & Poultry
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
      name.includes('turkey') || name.includes('meat') || name.includes('steak') ||
      name.includes('bacon') || name.includes('sausage') || name.includes('fish') ||
      name.includes('salmon') || name.includes('tuna')) {
    return 'meat';
  }
  
  // Produce (AFTER spices/canned checks)
  if (name.includes('apple') || name.includes('banana') || name.includes('lettuce') || 
      name.includes('tomato') || name.includes('onion') || name.includes('potato') ||
      name.includes('carrot') || name.includes('bell pepper') || name.includes('spinach') ||
      name.includes('broccoli') || name.includes('cucumber') || name.includes('avocado') ||
      name.includes('berry') || name.includes('orange') || name.includes('lemon') ||
      name.includes('jalapeño') || name.includes('pepper') || name.includes('celery')) {
    return 'produce';
  }
  
  // Grains & Pasta
  if (name.includes('flour') || name.includes('rice') || name.includes('pasta') || 
      name.includes('bread') || name.includes('cereal') || name.includes('oat')) {
    return 'pantry';
  }
  
  // Beverages
  if (name.includes('juice') || name.includes('soda') || name.includes('water') || 
      name.includes('coffee') || name.includes('tea')) {
    return 'pantry';
  }
  
  // Frozen Foods
  if (name.includes('frozen') || name.includes('ice cream')) {
    return 'frozen';
  }
  
  // Default
  if (name.includes('paprika')) {
    console.log('🌶️ PAPRIKA FALLBACK - Assigning category: other');
  }
  return 'other';
};

/**
 * Estimate expiration date based on item name and category
 */
export const estimateExpirationDate = (itemName: string, category: PantryCategory): Date => {
  const today = new Date();
  const name = itemName.toLowerCase();
  
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  // Dairy - 7-14 days
  if (category === 'dairy') {
    if (name.includes('milk')) return addDays(today, 7);
    if (name.includes('egg')) return addDays(today, 30);
    if (name.includes('yogurt')) return addDays(today, 14);
    return addDays(today, 10);
  }
  
  // Meat - 3-5 days (fridge) or 6 months (freezer)
  if (category === 'meat') {
    return addDays(today, 4); // Default fridge storage
  }
  
  // Fresh Produce - 5-14 days
  if (category === 'produce') {
    if (name.includes('lettuce') || name.includes('spinach')) return addDays(today, 5);
    if (name.includes('apple') || name.includes('onion')) return addDays(today, 30);
    return addDays(today, 7);
  }
  
  // Grains & Pasta - 1-2 years
  if (category === 'pantry') {
    return addDays(today, 365);
  }
  
  // Frozen - 6 months
  if (category === 'frozen') {
    return addDays(today, 180);
  }
  
  // Condiments - 1 year
  if (category === 'spices') {
    return addDays(today, 365);
  }
  
  // Default - 30 days
  return addDays(today, 30);
};