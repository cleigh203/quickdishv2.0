export interface Ingredient {
  amount: string;
  unit: string;
  item: string;
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
}
