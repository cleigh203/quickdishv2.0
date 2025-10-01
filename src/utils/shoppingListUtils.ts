interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

interface Ingredient {
  amount?: string;
  unit?: string;
  item: string;
}

/**
 * Deduplicates shopping list items by combining duplicate ingredients
 * Sums quantities when possible and merges recipe associations
 */
export const deduplicateShoppingList = (items: ShoppingItem[]): ShoppingItem[] => {
  const itemMap = new Map<string, ShoppingItem>();

  items.forEach(item => {
    const normalizedName = item.item.toLowerCase().trim();
    
    if (itemMap.has(normalizedName)) {
      const existing = itemMap.get(normalizedName)!;
      
      // Combine recipes
      const combinedRecipes = [
        ...(existing.recipes || []),
        ...(item.recipes || [])
      ];
      existing.recipes = [...new Set(combinedRecipes)];
      
      // Try to sum amounts if both have numeric amounts
      if (existing.amount && item.amount) {
        const existingNum = parseFloat(existing.amount);
        const itemNum = parseFloat(item.amount);
        
        if (!isNaN(existingNum) && !isNaN(itemNum)) {
          const total = existingNum + itemNum;
          const unit = existing.amount.replace(/[\d\s.]+/, '').trim();
          existing.amount = `${total} ${unit}`.trim();
        } else {
          // Can't sum, keep original
          existing.amount = `${existing.amount}, ${item.amount}`;
        }
      } else if (item.amount && !existing.amount) {
        existing.amount = item.amount;
      }
      
      itemMap.set(normalizedName, existing);
    } else {
      itemMap.set(normalizedName, { ...item });
    }
  });

  return Array.from(itemMap.values());
};

/**
 * Converts recipe ingredients to shopping list items
 */
export const ingredientsToShoppingItems = (
  ingredients: Ingredient[],
  recipeName: string,
  startId: number = Date.now()
): ShoppingItem[] => {
  return ingredients.map((ing, index) => ({
    id: startId + index,
    item: ing.item,
    amount: ing.amount ? `${ing.amount} ${ing.unit || ''}`.trim() : ing.unit,
    checked: false,
    recipes: [recipeName]
  }));
};

/**
 * Categorizes shopping items for organized display/printing
 */
export const categorizeItems = (items: ShoppingItem[]) => {
  const categories = {
    produce: [] as ShoppingItem[],
    dairy: [] as ShoppingItem[],
    meat: [] as ShoppingItem[],
    pantry: [] as ShoppingItem[],
    other: [] as ShoppingItem[]
  };

  const produceKeywords = ['tomato', 'lettuce', 'onion', 'garlic', 'pepper', 'carrot', 'potato', 'fruit', 'vegetable', 'herb', 'spinach', 'kale'];
  const dairyKeywords = ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'egg'];
  const meatKeywords = ['chicken', 'beef', 'pork', 'fish', 'turkey', 'lamb', 'meat', 'salmon', 'tuna'];
  const pantryKeywords = ['flour', 'sugar', 'salt', 'pepper', 'oil', 'rice', 'pasta', 'sauce', 'spice', 'seasoning'];

  items.forEach(item => {
    const itemLower = item.item.toLowerCase();
    
    if (produceKeywords.some(kw => itemLower.includes(kw))) {
      categories.produce.push(item);
    } else if (dairyKeywords.some(kw => itemLower.includes(kw))) {
      categories.dairy.push(item);
    } else if (meatKeywords.some(kw => itemLower.includes(kw))) {
      categories.meat.push(item);
    } else if (pantryKeywords.some(kw => itemLower.includes(kw))) {
      categories.pantry.push(item);
    } else {
      categories.other.push(item);
    }
  });

  return categories;
};
