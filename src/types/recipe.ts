export interface Ingredient {
  amount: string;
  unit: string;
  item: string;
}

export interface Nutrition {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  servingSize: string; // e.g. "1 cup", "2 pieces"
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: string;
  prepTime: string;
  difficulty: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  cuisine: string;
  imageUrl?: string;
  image?: string;
  nutrition?: Nutrition;
  ingredientInput?: string; // Store original input for smart image matching
  isPremium?: boolean; // Premium recipes require subscription
  totalTime?: number; // Total time in minutes for filtering
  tags?: string[]; // Diet and meal type tags (vegetarian, vegan, breakfast, etc.)
  isAiGenerated?: boolean; // Flag for AI-generated recipes
  generatedAt?: string; // Timestamp when recipe was generated
  category?: string; // Category for organized filtering (Breakfast, Lunch, etc.)
  isVerified?: boolean; // Supabase verified flag
}
