import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types/recipe";
import { ingredientMatch } from "@/utils/pantryUtils";

const PantryRecipes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [readyRecipes, setReadyRecipes] = useState<Recipe[]>([]);
  const [almostReadyRecipes, setAlmostReadyRecipes] = useState<Array<{ recipe: Recipe; missing: string[] }>>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);

  useEffect(() => {
    fetchPantryRecipes();
  }, [user]);

  const fetchPantryRecipes = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get pantry items
      const { data: pantryData } = await supabase
        .from('profiles')
        .select('pantry_items')
        .eq('id', user.id)
        .single();
      
      const pantryIngredients = pantryData?.pantry_items || [];
      console.log('🥘 Pantry items:', pantryIngredients);
      setPantryItems(pantryIngredients);
      
      // Get all recipes
      const { data: recipes } = await supabase
        .from('recipes')
        .select('*');
      
      console.log('📚 Total recipes in database:', recipes?.length);
      
      if (!recipes) {
        setLoading(false);
        return;
      }
      
      // Map Supabase recipes to Recipe type (convert snake_case to camelCase)
      const mappedRecipes: Recipe[] = recipes.map((record: any) => ({
        id: record.id || record.recipe_id,
        name: record.name || 'Untitled Recipe',
        description: record.description || '',
        cookTime: record.cook_time ?? record.cookTime ?? '',
        prepTime: record.prep_time ?? record.prepTime ?? '',
        difficulty: record.difficulty || 'Medium',
        servings: record.servings || 4,
        ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
        instructions: Array.isArray(record.instructions) ? record.instructions : [],
        cuisine: record.cuisine || '',
        imageUrl: record.image_url ?? record.imageUrl ?? '',
        image: record.image_url ?? record.image ?? '',
        image_url: record.image_url ?? record.imageUrl ?? '',
        nutrition: record.nutrition || undefined,
        tags: record.tags || [],
        isPremium: record.is_premium ?? record.isPremium ?? false,
        totalTime: record.total_time ?? record.totalTime ?? undefined,
        category: record.category || undefined,
        isAiGenerated: record.is_ai_generated ?? record.isAiGenerated ?? false,
        generatedAt: record.generated_at ?? record.generatedAt ?? undefined,
      }));
      
      const ready: Recipe[] = [];
      const almostReady: Array<{ recipe: Recipe; missing: string[] }> = [];
      
      mappedRecipes.forEach(recipe => {
        // Skip recipes with no ingredients
        if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
          return;
        }
        
        console.log(`🔍 Checking recipe: ${recipe.name}`, {
          id: recipe.id,
          hasIngredients: recipe.ingredients.length
        });
        
        const missingIngredients: string[] = [];
        
        recipe.ingredients.forEach((ing: any) => {
          const ingName = ing.item || '';
          if (!ingName) return;
          
          const hasIngredient = pantryIngredients.some(pantryItem => 
            ingredientMatch(pantryItem, ingName)
          );
          
          if (!hasIngredient) {
            missingIngredients.push(ingName);
          }
        });
        
        console.log(`   ${recipe.name}: Missing ${missingIngredients.length} ingredients`, missingIngredients.slice(0, 3));
        
        // 100% match - ready to cook
        if (missingIngredients.length === 0) {
          ready.push(recipe);
        }
        // Missing exactly 1 ingredient
        else if (missingIngredients.length === 1) {
          almostReady.push({ recipe, missing: missingIngredients });
        }
      });
      
      console.log('✅ Ready recipes:', ready.map(r => r.name));
      console.log('🛒 Almost ready recipes:', almostReady.map(a => a.recipe.name));
      
      setReadyRecipes(ready);
      setAlmostReadyRecipes(almostReady);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching pantry recipes:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-lg font-semibold text-gray-700">Finding recipes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#047857] to-[#10b981] text-white px-6 py-8 pt-16">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-white/90 flex items-center gap-2 hover:text-white"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-2">Cook With What You Have</h1>
        <p className="text-white/90">
          {pantryItems.length} ingredients in your pantry
        </p>
      </div>

      {/* Ready to Cook Section */}
      {readyRecipes.length > 0 && (
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ready to Cook ({readyRecipes.length})</h2>
              <p className="text-sm text-gray-600">All ingredients in your pantry</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {readyRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => {
                  // Scroll before navigation
                  window.scrollTo(0, 0);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  
                  console.log('=== CLICKED RECIPE (READY) ===');
                  console.log('Recipe ID:', recipe.id);
                  console.log('Recipe UUID:', (recipe as any).uuid);
                  console.log('Recipe Name:', recipe.name);
                  console.log('Recipe Image:', recipe.image_url);
                  console.log('Full Recipe Object:', recipe);
                  console.log('Navigating to: /recipe/' + recipe.id);
                  console.log('Using route defined in App.tsx: /recipe/:id');
                  
                  const recipeId = (recipe as any).uuid || recipe.id;
                  console.log('Final ID being used:', recipeId);
                  
                  navigate(`/recipe/${recipeId}`, {
                    state: { recipe }
                  });
                  
                  // Scroll after navigation too
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }, 100);
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all active:scale-95 border border-gray-100"
              >
                <div className="relative h-40 bg-white flex items-center justify-center overflow-hidden rounded-t-2xl">
                  {recipe.image_url ? (
                    <img 
                      src={recipe.image_url}
                      alt={recipe.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    ✓ Ready
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 text-left">{recipe.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {recipe.ingredients?.length || 0} ingredients
                  </p>
                  {(recipe.prepTime || recipe.cookTime) && (
                    <p className="text-xs text-gray-500 mt-1">
                      ⏰ {[recipe.prepTime, recipe.cookTime].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Almost Ready Section */}
      {almostReadyRecipes.length > 0 && (
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-3xl">🛒</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Almost Ready ({almostReadyRecipes.length})</h2>
              <p className="text-sm text-gray-600">Missing just 1 ingredient</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {almostReadyRecipes.map(({ recipe, missing }) => (
              <button
                key={recipe.id}
                onClick={() => {
                  // Scroll before navigation
                  window.scrollTo(0, 0);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  
                  console.log('=== CLICKED RECIPE (ALMOST READY) ===');
                  console.log('Recipe ID:', recipe.id);
                  console.log('Recipe UUID:', (recipe as any).uuid);
                  console.log('Recipe Name:', recipe.name);
                  console.log('Recipe Image:', recipe.image_url);
                  console.log('Full Recipe Object:', recipe);
                  console.log('Navigating to: /recipe/' + recipe.id);
                  console.log('Using route defined in App.tsx: /recipe/:id');
                  
                  const recipeId = (recipe as any).uuid || recipe.id;
                  console.log('Final ID being used:', recipeId);
                  
                  navigate(`/recipe/${recipeId}`, {
                    state: { recipe }
                  });
                  
                  // Scroll after navigation too
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }, 100);
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all active:scale-95 border border-gray-100"
              >
                <div className="relative h-40 bg-white flex items-center justify-center overflow-hidden rounded-t-2xl">
                  {recipe.image_url ? (
                    <img 
                      src={recipe.image_url}
                      alt={recipe.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Need 1
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 text-left mb-1">{recipe.name}</h3>
                  <p className="text-xs text-orange-600 font-semibold">Need: {missing[0]}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {recipe.ingredients?.length || 0} ingredients total
                  </p>
                  {(recipe.prepTime || recipe.cookTime) && (
                    <p className="text-xs text-gray-500 mt-1">
                      ⏰ {[recipe.prepTime, recipe.cookTime].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {readyRecipes.length === 0 && almostReadyRecipes.length === 0 && (
        <div className="px-6 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Complete Recipes Found
            </h3>
            <p className="text-gray-600 mb-4">
              Your pantry items don't match any of our recipes yet.
            </p>
            <p className="text-sm text-gray-500">
              Try adding more ingredients to your pantry or browse our recipe collections.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantryRecipes;

