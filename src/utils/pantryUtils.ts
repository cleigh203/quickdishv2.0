import { PantryItem } from "@/types/pantry";

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

/**
 * Checks if an ingredient exists in pantry with sufficient quantity
 */
export const isInPantry = (
  ingredientName: string,
  pantryItems: PantryItem[]
): boolean => {
  const normalizedName = ingredientName.toLowerCase().trim();
  return pantryItems.some(item => 
    item.name.toLowerCase().includes(normalizedName) || 
    normalizedName.includes(item.name.toLowerCase())
  );
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
