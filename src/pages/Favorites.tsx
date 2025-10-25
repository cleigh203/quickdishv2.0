import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChefHat, Loader2, Search } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Recipe } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { allRecipes } from "@/data/recipes";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { getRecipeImage } from "@/utils/recipeImages";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
// Ads removed

const Favorites = () => {
  const { savedRecipes, loading } = useSavedRecipes();
  const { generatedRecipes } = useGeneratedRecipes();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const resolveFavorites = async () => {
      // Map saved recipe IDs to actual recipe objects
      const genMap = new Map(generatedRecipes.map(r => [r.id, r]));
      const statMap = new Map(allRecipes.map(r => [r.id, r]));

      const base: Recipe[] = savedRecipes
        .map(saved => {
          const gen = genMap.get(saved.recipe_id);
          if (gen) return gen;
          const stat = statMap.get(saved.recipe_id);
          if (stat) return stat;
          try {
            const stored = JSON.parse(localStorage.getItem('recipes') || '[]');
            return stored.find((r: any) => r.id === saved.recipe_id);
          } catch {
            return undefined;
          }
        })
        .filter((r): r is Recipe => r !== undefined)
        .map(r => ({ ...r }));

      // If any missing IDs remain, fetch from generated_recipes table
      const resolvedIds = new Set(base.map(r => r.id));
      const missingIds = savedRecipes.map(s => s.recipe_id).filter(id => !resolvedIds.has(id));

      let fetched: Recipe[] = [];
      if (missingIds.length > 0) {
        try {
          const { data, error } = await supabase
            .from('generated_recipes')
            .select('*')
            .in('recipe_id', missingIds);
          if (!error && Array.isArray(data)) {
            fetched = data.map((record: any) => ({
              id: record.recipe_id,
              name: record.name,
              description: record.description || '',
              cookTime: record.cook_time || '',
              prepTime: record.prep_time || '',
              difficulty: record.difficulty || 'Medium',
              servings: record.servings || 4,
              ingredients: record.ingredients || [],
              instructions: record.instructions || [],
              cuisine: record.cuisine || '',
              imageUrl: record.image_url || '',
              image: record.image_url || '',
              nutrition: record.nutrition || undefined,
              tags: record.tags || [],
              isAiGenerated: true,
              generatedAt: record.created_at,
            } as Recipe));
          }
        } catch (e) {
          console.warn('Favorites fetch fallback failed', e);
        }
      }

      // Create stubs for any IDs still unresolved so the user sees items immediately
      const fetchedIds = new Set(fetched.map(r => r.id));
      const unresolvedIds = savedRecipes
        .map(s => s.recipe_id)
        .filter(id => !resolvedIds.has(id) && !fetchedIds.has(id));

      const stubs: Recipe[] = unresolvedIds.map((id) => ({
        id,
        name: 'Saved AI Recipe',
        description: '',
        cookTime: '',
        prepTime: '',
        difficulty: 'Medium',
        servings: 1,
        ingredients: [],
        instructions: [],
        cuisine: '',
        image: '',
        imageUrl: '',
        tags: [],
        isAiGenerated: true,
      } as Recipe));

      setFavoriteRecipes([...base, ...fetched, ...stubs]);
    };

    resolveFavorites();
  }, [savedRecipes, generatedRecipes]);

  const filteredRecipes = favoriteRecipes.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = r.name.toLowerCase().includes(q);
    const ingredientMatch = r.ingredients.some((ing) => ing.item.toLowerCase().includes(q));
    return nameMatch || ingredientMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Favorite Recipes</h1>
          <p className="text-muted-foreground">
            Your saved recipes collection
          </p>
        </div>

        {/* Search bar for saved recipes */}
        <div className="mb-6">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your saved recipes by name or ingredient..."
              className="pr-10"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
                <div 
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  {recipe.isAiGenerated ? (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">AI Recipe</span>
                    </div>
                  ) : (
                    <img 
                      src={getRecipeImage(recipe, import.meta.env.DEV)}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      width="640"
                      height="360"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=180&q=18&fm=webp";
                      }}
                    />
                  )}
                </div>
                
                <div className="p-4">
                  <h3 
                    className="text-white font-bold text-lg mb-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    {recipe.name}
                  </h3>
                  
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{recipe.difficulty}</Badge>
                    <Badge variant="outline" className="text-xs">{recipe.cuisine}</Badge>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button 
                      onClick={() => navigate(`/recipe/${recipe.id}?cook=true`)}
                      className="flex-1 bg-primary hover:bg-primary/90 font-semibold"
                    >
                      <ChefHat className="mr-2 h-4 w-4" />
                      Cook Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No saved recipes yet</p>
            <p className="text-muted-foreground mt-2">
              Your favorites will appear here
            </p>
            <Button 
              onClick={() => navigate('/discover')}
              className="mt-4"
            >
              Discover Recipes
            </Button>
          </div>
        )}

        
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Favorites;
