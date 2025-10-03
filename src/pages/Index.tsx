import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { VoiceSearchButton } from "@/components/VoiceSearchButton";
import { getFreeHalloweenRecipes } from "@/data/halloweenRecipes";
import { RecipeCard } from "@/components/RecipeCard";
// TODO V2.0: Re-enable AI recipe generation with full feature parity
// import { AiGenerationPrompt } from "@/components/AiGenerationPrompt";
import poisonAppleCocktail from "@/assets/recipes/poison-apple-cocktail.jpg";
import { allRecipes } from "@/data/recipes";
import type { Recipe } from "@/types/recipe";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";

const Index = () => {
  const navigate = useNavigate();
  const [showHalloweenRecipes, setShowHalloweenRecipes] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { generatedRecipes, refetch: refetchGeneratedRecipes } = useGeneratedRecipes();

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const freeHalloweenRecipes = getFreeHalloweenRecipes();

  // Combine static recipes with user's generated recipes
  const combinedRecipes = [...allRecipes, ...generatedRecipes];

  // Filter recipes by ingredients
  const filteredRecipes = useMemo(() => {
    if (!isSearching || !searchInput.trim()) return [];

    const searchTerms = searchInput
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(term => term.length > 0);

    if (searchTerms.length === 0) return [];

    return combinedRecipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients
        .map(ing => ing.item.toLowerCase())
        .join(" ");

      return searchTerms.every(term =>
        recipeIngredients.includes(term)
      );
    });
  }, [searchInput, isSearching, combinedRecipes]);

  const handleSearch = () => {
    console.log('Search button clicked with term:', searchInput);
    if (searchInput.trim()) {
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setIsSearching(false);
  };

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
          <div className="w-full max-w-xl glass-card rounded-2xl p-2 hover:shadow-xl transition-all mx-auto relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="What's in your fridge?"
              className="w-full h-14 px-4 pr-28 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-lg"
            />
            <VoiceSearchButton
              onTranscript={(text) => setSearchInput(text)}
              onSearchTrigger={handleSearch}
              variant="ghost"
              size="icon"
              className="absolute right-[60px] top-1/2 -translate-y-1/2 h-10 w-10 p-2 z-10"
            />
            <Button 
              type="button"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 p-3 z-10"
              onClick={handleSearch}
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Search Results */}
        {isSearching && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Search Results {filteredRecipes.length > 0 && `(${filteredRecipes.length})`}
              </h2>
              <Button 
                variant="outline" 
                onClick={handleClearSearch}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Search
              </Button>
            </div>
            
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <div key={recipe.id} className="relative">
                    <RecipeCard
                      recipe={recipe}
                      onClick={() => handleRecipeClick(recipe.id)}
                    />
                    {recipe.isAiGenerated && (
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 left-2 text-xs bg-purple-500/90 text-white backdrop-blur-sm"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">
                  No recipes found for '{searchInput}'
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try different search terms or browse our categories
                </p>
                <Button 
                  size="lg"
                  onClick={() => {
                    handleClearSearch();
                    navigate('/discover');
                  }}
                >
                  Browse Recipes
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Halloween Recipes Grid */}
        {!isSearching && showHalloweenRecipes && (
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
        {!isSearching && (
          <div className="mb-12">
            <h2 className="section-header">Featured Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Quick & Easy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
              { name: 'Fall Favorites', image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400&q=80' },
              { name: 'Family Favorites', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
              { name: 'One-Pot Wonders', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80' },
              { name: 'Healthy Bowls', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
              { name: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
            ].map((collection) => (
              <div 
                key={collection.name}
                className="clickable-card"
                onClick={() => {
                  navigate(`/discover?collection=${encodeURIComponent(collection.name)}`);
                  window.scrollTo(0, 0);
                }}
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
        )}

        {/* Featured Collection - Large Cards */}
        {!isSearching && (
          <div className="grid md:grid-cols-2 gap-6 mb-20">
          {/* Halloween Recipe Drop */}
          <div
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer clickable-card"
            onClick={() => {
              navigate('/discover?collection=Halloween');
              window.scrollTo(0, 0);
            }}
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
            onClick={() => {
              navigate('/discover?collection=Restaurant%20Copycats');
              window.scrollTo(0, 0);
            }}
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
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
