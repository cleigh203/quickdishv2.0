import { PantryItem } from "@/types/pantry";

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
