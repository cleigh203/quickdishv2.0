import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChefHat } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Recipe } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRecipeImage } from "@/utils/recipeImages";

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
              <div key={recipe.id} className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
                <div 
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <img 
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
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
