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
 * Parses amount string to extract number and unit
 * Handles fractions like "1/2" and decimals like "1.5"
 */
const parseAmount = (amountStr: string): { value: number; unit: string } | null => {
  if (!amountStr) return null;
  
  const cleaned = amountStr.trim();
  
  // Try to match number patterns: "1", "1.5", "1/2", "1 1/2"
  const fractionMatch = cleaned.match(/^(\d+)?\s*(\d+)\/(\d+)/); // Matches "1/2" or "1 1/2"
  const decimalMatch = cleaned.match(/^(\d+\.?\d*)/); // Matches "1" or "1.5"
  
  let value = 0;
  let restOfString = cleaned;
  
  if (fractionMatch) {
    // Handle fractions like "1/2" or "1 1/2"
    const whole = fractionMatch[1] ? parseInt(fractionMatch[1]) : 0;
    const numerator = parseInt(fractionMatch[2]);
    const denominator = parseInt(fractionMatch[3]);
    value = whole + numerator / denominator;
    restOfString = cleaned.substring(fractionMatch[0].length).trim();
  } else if (decimalMatch) {
    // Handle decimals and whole numbers
    value = parseFloat(decimalMatch[1]);
    restOfString = cleaned.substring(decimalMatch[0].length).trim();
  } else {
    return null; // Can't parse number
  }
  
  // Extract unit (everything after the number)
  const unit = restOfString.trim();
  
  return { value, unit };
};

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
      
      // Try to sum amounts if both have amounts
      if (existing.amount && item.amount) {
        const existingParsed = parseAmount(existing.amount);
        const itemParsed = parseAmount(item.amount);
        
        if (existingParsed && itemParsed) {
          // Check if units match (ignoring plural/singular differences)
          const normalizeUnit = (u: string) => u.toLowerCase().replace(/s$/, '');
          const existingUnit = normalizeUnit(existingParsed.unit);
          const itemUnit = normalizeUnit(itemParsed.unit);
          
          if (existingUnit === itemUnit || !existingParsed.unit || !itemParsed.unit) {
            // Units match or one is missing - sum the values
            const total = existingParsed.value + itemParsed.value;
            const unit = existingParsed.unit || itemParsed.unit;
            
            // Format nicely: use fractions if result is a common fraction
            let displayValue: string;
            if (total % 1 === 0) {
              displayValue = total.toString();
            } else if (total === 0.25) {
              displayValue = '1/4';
            } else if (total === 0.5) {
              displayValue = '1/2';
            } else if (total === 0.75) {
              displayValue = '3/4';
            } else if (total === 0.33 || total === 0.333) {
              displayValue = '1/3';
            } else if (total === 0.67 || total === 0.667) {
              displayValue = '2/3';
            } else {
              displayValue = total.toFixed(2).replace(/\.?0+$/, '');
            }
            
            existing.amount = unit ? `${displayValue} ${unit}` : displayValue;
          } else {
            // Units don't match - keep both
            existing.amount = `${existing.amount}, ${item.amount}`;
          }
        } else {
          // Can't parse - keep both
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
    amount: `${ing.amount || ''} ${ing.unit || ''}`.trim(),
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
