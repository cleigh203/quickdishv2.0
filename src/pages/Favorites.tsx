import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>(() => {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  });
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const navigate = useNavigate();
  const cuisineTypes = ['All', 'Italian', 'Asian', 'Mexican', 'American', 'Mediterranean', 'Various'];

  useEffect(() => {
    const loadFavorites = () => {
      const favorites = localStorage.getItem('favorites');
      setFavoriteRecipes(favorites ? JSON.parse(favorites) : []);
      console.log('Favorites loaded:', favorites ? JSON.parse(favorites).length : 0);
    };
    
    // Load on mount and when returning to this tab
    loadFavorites();
    
    // Listen for storage changes (when recipe is saved from another tab)
    window.addEventListener('storage', loadFavorites);
    window.addEventListener('focus', loadFavorites);
    
    return () => {
      window.removeEventListener('storage', loadFavorites);
      window.removeEventListener('focus', loadFavorites);
    };
  }, []);

  const filteredRecipes = selectedCuisine === 'All' 
    ? favoriteRecipes 
    : favoriteRecipes.filter(r => r.cuisine === selectedCuisine);

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

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {cuisineTypes.map(cuisine => (
            <Badge
              key={cuisine}
              variant={selectedCuisine === cuisine ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 ${
                selectedCuisine === cuisine 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'hover:bg-secondary'
              }`}
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </Badge>
          ))}
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecipes.map((recipe) => (
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
            <p className="text-xl text-muted-foreground">
              {selectedCuisine === 'All' ? 'No saved recipes yet' : `No ${selectedCuisine} recipes saved`}
            </p>
            <p className="text-muted-foreground mt-2">
              Your favorites will appear here
            </p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Favorites;
