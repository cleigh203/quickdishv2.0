import { supabase } from "@/integrations/supabase/client";

export async function generateImagesForRecipes(recipeIds: string[]) {
  const { data, error } = await supabase.functions.invoke('batch-generate-images', {
    body: { recipeIds }
  });

  if (error) {
    console.error('Image generation error:', error);
    throw error;
  }

  return data;
}

// Recipe IDs that need new images
export const RECIPE_IDS_TO_UPDATE = [
  'copycat-cheddar-biscuits',        // Red Lobster Cheddar Bay Biscuits
  'copycat-roadhouse-rolls',         // Texas Roadhouse Rolls
  'dessert-bread-pudding',           // Bread Pudding
  'dessert-peach-cobbler',           // Peach Cobbler
  'dessert-pumpkin-cheesecake',      // Pumpkin Cheesecake
  'dessert-banana-bread-chocolate',  // Chocolate Chip Banana Bread
  'lunch-chicken-shawarma-wrap',     // Chicken Shawarma Wrap
  'lunch-southwest-chicken-bowl',    // Southwest Chicken Bowl
];
