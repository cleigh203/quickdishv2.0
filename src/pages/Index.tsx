import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { getFreeHalloweenRecipes } from "@/data/halloweenRecipes";
import { RecipeCard } from "@/components/RecipeCard";
import poisonAppleCocktail from "@/assets/recipes/poison-apple-cocktail.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [showHalloweenRecipes, setShowHalloweenRecipes] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const freeHalloweenRecipes = getFreeHalloweenRecipes();

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Full-width Hero */}
      <div 
        className="relative h-[420px] mb-8 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80)`
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="page-title md:text-6xl mb-4 drop-shadow-2xl text-white">
            Turn Ingredients Into Magic
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-lg">
            Real recipes. Real food. Zero waste.
          </p>
          
          {/* Glassmorphic Search Bar */}
          <div className="w-full max-w-xl glass-card rounded-2xl p-2 flex items-center gap-2 hover:shadow-xl transition-all">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (searchInput.trim()) {
                    navigate(`/discover?ingredients=${encodeURIComponent(searchInput)}`);
                  }
                }
              }}
              placeholder="What's in your fridge?"
              className="flex-1 h-14 px-4 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-lg"
            />
            <Button 
              size="lg" 
              className="rounded-xl h-14 w-14 flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                if (searchInput.trim()) {
                  navigate(`/discover?ingredients=${encodeURIComponent(searchInput)}`);
                }
              }}
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* Halloween Recipes Grid */}
        {showHalloweenRecipes && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">🦇 Spooky Specials</h3>
              <Button variant="ghost" onClick={() => setShowHalloweenRecipes(false)}>
                Hide
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeHalloweenRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Featured Collections */}
        <div className="mb-12">
          <h2 className="section-header">Featured Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Quick & Easy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
              { name: 'Healthy Bowls', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
              { name: 'Comfort Food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
              { name: 'Fresh & Light', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80' },
              { name: 'Leftovers Magic', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
              { name: 'Picky Eaters', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
            ].map((collection) => (
              <div 
                key={collection.name}
                className="clickable-card"
                onClick={() => navigate(`/discover?collection=${encodeURIComponent(collection.name)}`)}
              >
                <div 
                  className="h-36 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${collection.image})` }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm">{collection.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Collection - Large Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {/* Halloween Recipe Drop */}
          <div
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer clickable-card"
            onClick={() => navigate('/discover?collection=Halloween')}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
              style={{
                backgroundImage: `url(${poisonAppleCocktail})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="text-5xl mb-3">🎃</div>
              <h3 className="text-3xl font-bold text-white mb-2">Halloween Recipe Drop</h3>
              <p className="body-text text-white/90">
                Vampire brownies that ooze • Black pasta that goes viral
              </p>
            </div>
          </div>

          {/* Restaurant Copycats */}
          <div
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer clickable-card"
            onClick={() => navigate('/discover?collection=Restaurant%20Copycats')}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80)`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="text-6xl mb-4">🍔</div>
              <h3 className="text-3xl font-bold mb-2">Restaurant Copycats</h3>
              <p className="body-text text-white/90">
                Make your favorite restaurant dishes at home
              </p>
            </div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
