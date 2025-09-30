import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const favoriteIds = recipeStorage.getFavorites();
    const recipes = recipeStorage.getRecipes();
    const filtered = recipes.filter(r => favoriteIds.includes(r.id));
    setFavoriteRecipes(filtered);
  }, []);

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

        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No favorite recipes yet</p>
            <p className="text-muted-foreground mt-2">
              Save recipes to find them here later
            </p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Favorites;
