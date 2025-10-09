import { supabase } from "@/integrations/supabase/client";
import eggMcmuffin from "@/assets/recipes/egg-mcmuffin-new.jpg";
import oliveGardenSalad from "@/assets/recipes/olive-garden-salad-new.jpg";
import paneraSandwich from "@/assets/recipes/panera-sandwich-new.jpg";
import zitiAlforno from "@/assets/recipes/ziti-alforno-new.jpg";

export async function updateRecipeImages() {
  const updates = [
    {
      recipe_id: "copycat-mcdonald-s-egg-mcmuffin",
      image_url: eggMcmuffin
    },
    {
      recipe_id: "copycat-olive-garden-house-salad-with-dressing",
      image_url: oliveGardenSalad
    },
    {
      recipe_id: "copycat-panera-chipotle-chicken-avocado-melt",
      image_url: paneraSandwich
    },
    {
      recipe_id: "copycat-olive-garden-5-cheese-ziti",
      image_url: zitiAlforno
    }
  ];

  const results = [];
  
  for (const update of updates) {
    const { error } = await supabase
      .from('recipes')
      .update({ image_url: update.image_url })
      .eq('recipe_id', update.recipe_id);
    
    if (error) {
      console.error(`Failed to update ${update.recipe_id}:`, error);
      results.push({ recipe_id: update.recipe_id, success: false, error });
    } else {
      console.log(`Updated ${update.recipe_id}`);
      results.push({ recipe_id: update.recipe_id, success: true });
    }
  }
  
  return results;
}
