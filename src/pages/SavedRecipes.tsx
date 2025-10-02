import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { allRecipes } from "@/data/recipes";
import { Recipe } from "@/types/recipe";

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Load saved recipe IDs from localStorage
    const savedIds = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    // Filter recipes that match saved IDs
    const saved = allRecipes.filter(recipe => savedIds.includes(recipe.id));
    setSavedRecipes(saved);
  }, []);

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-16 px-6 text-center text-white">
        <Heart className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Saved Recipes</h1>
        <p className="text-xl text-white/90">Your favorite recipes in one place</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-3">No saved recipes yet</h2>
            <p className="text-muted-foreground mb-8">
              Start saving your favorite recipes to see them here
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/generate')}
              className="bg-gradient-to-r from-pink-500 to-rose-500"
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

export default SavedRecipes;
