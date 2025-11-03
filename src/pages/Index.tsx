import { useLocation, useNavigate } from "react-router-dom";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { Sparkles, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { VoiceSearchButton } from "@/components/VoiceSearchButton";
import { RecipeCard } from "@/components/RecipeCard";
import { useAllRecipes } from "@/hooks/useAllRecipes";
import { AiGenerationPrompt } from "@/components/AiGenerationPrompt";
import type { Recipe } from "@/types/recipe";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";
import { getRecipeImage } from "@/utils/recipeImages";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For non-recipe navigation
  const { navigateToRecipe, getContext } = useSmartNavigation();
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { allRecipes, isLoading: isLoadingRecipes } = useAllRecipes();
  const { generatedRecipes, refetch: refetchGeneratedRecipes } = useGeneratedRecipes();
  const { verifiedRecipes } = useVerifiedRecipes();

  const handleRecipeClick = (recipeId: string) => {
    // Find the recipe in our combined data to pass via state
    const recipe = combinedRecipes.find(r => r.id === recipeId);
    navigateToRecipe(recipeId, recipe);
  };

  // Combine verified, generated, and static recipes with proper deduplication
  const combinedRecipes = useMemo(() => {
    const recipeMap = new Map<string, Recipe>();

    // Helper: when overriding an existing recipe, preserve any custom imageUrl we set in static data
    const setWithImagePreserved = (incoming: Recipe) => {
      const existing = recipeMap.get(incoming.id);
      if (existing && existing.imageUrl) {
        recipeMap.set(incoming.id, { ...incoming, imageUrl: existing.imageUrl });
      } else {
        recipeMap.set(incoming.id, incoming);
      }
    };

    // Add static recipes first (may include curated imageUrl updates)
    allRecipes.forEach((recipe) => {
      recipeMap.set(recipe.id, recipe);
    });

    // Override with generated recipes (higher priority), but keep curated imageUrl if present
    generatedRecipes.forEach((recipe) => {
      setWithImagePreserved(recipe as Recipe);
    });

    // Override with verified recipes (highest priority), but keep curated imageUrl if present
    verifiedRecipes.forEach((recipe) => {
      setWithImagePreserved(recipe as Recipe);
    });

    // Exclude AI-generated (session) recipes from public discovery lists
    return Array.from(recipeMap.values()).filter(r => !(r as any).isAiGenerated);
  }, [generatedRecipes, verifiedRecipes]);

  // Image preloading to prevent flashing on first load
  useEffect(() => {
    if (!combinedRecipes || combinedRecipes.length === 0) return;

    // Preload first 12 images (visible on screen)
    const imagesToPreload = combinedRecipes.slice(0, 12).map(r => getRecipeImage(r, import.meta.env.DEV));

    Promise.all(
      imagesToPreload.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error
        });
      })
    ).then(() => {
      setImagesLoaded(true);
    });
  }, [combinedRecipes]);

  // Filter recipes by ingredients (AND logic on ingredients only)
  const filteredRecipes = useMemo(() => {
    if (!isSearching || !searchInput.trim()) return [];

    // Common words to ignore
    const stopWords = ['and', 'or', 'with', 'the', 'a', 'an', 'in', 'on', 'for'];

    const searchTerms = searchInput
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(term => term.length > 0 && !stopWords.includes(term));

    if (searchTerms.length === 0) return [];

    // Filter recipes by ingredients (AND logic - must contain ALL search terms)
    const matched = combinedRecipes.filter(recipe => {
      return searchTerms.every(term => {
        // Use word boundary regex so "fish" doesn't match "finish"
        const wordRegex = new RegExp(`\\b${term}`, 'i');

        // Check if term matches any ingredient as a word
        return recipe.ingredients.some(ing => wordRegex.test(ing.item));
      });
    });

    return matched.sort((a, b) => {
      // Sort by number of matching terms (most matches first)
      const aMatches = searchTerms.filter(term => {
        const wordRegex = new RegExp(`\\b${term}`, 'i');
        return a.ingredients.some(ing => wordRegex.test(ing.item));
      }).length;

      const bMatches = searchTerms.filter(term => {
        const wordRegex = new RegExp(`\\b${term}`, 'i');
        return b.ingredients.some(ing => wordRegex.test(ing.item));
      }).length;

      return bMatches - aMatches; // More matches = higher priority
    });
  }, [searchInput, isSearching, combinedRecipes]);

  const handleSearch = (searchTerm?: string) => {
    const term = searchTerm || searchInput;
    console.log('Search triggered with term:', term);
    if (term.trim()) {
      if (searchTerm) {
        setSearchInput(searchTerm); // Ensure state is updated
      }
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
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%), url(https://i.imgur.com/ZWIwJpH.png)`
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
              data-search-bar
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
              onClick={() => handleSearch()}
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
            
            {!imagesLoaded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative">
                    <div className="bg-gray-200 animate-pulse rounded-lg h-64" />
                  </div>
                ))}
              </div>
            ) : filteredRecipes.length > 0 ? (
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
              <div className="max-w-md mx-auto text-center py-12 space-y-6">
                <div>
                  <div className="text-6xl mb-2">🧪</div>
                  <h3 className="text-2xl font-bold mb-2">No exact matches</h3>
                  <p className="text-muted-foreground">We can generate a custom recipe using those ingredients.</p>
                </div>
                <AiGenerationPrompt 
                  searchTerm={searchInput}
                  onRecipeGenerated={(recipe) => {
                    navigateToRecipe(recipe.id, recipe);
                  }}
                />
              </div>
            )}
          </div>
        )}


        {/* Featured Collections */}
        {!isSearching && (
          <>
            <div className="mb-12">
              <h2 className="section-header">Featured Collections</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
              { name: 'Fall Favorites', image: 'https://i.imgur.com/H7xbRNq.png' },
{ name: 'Quick and Easy', image: 'https://i.imgur.com/mIajfse.png' },
{ name: 'Restaurant Copycats', image: 'https://i.imgur.com/eNF1erk.png' },
{ name: 'One Pot Meals', image: 'https://i.imgur.com/5NcvbyS.png' },
{ name: 'Desserts', image: 'https://i.imgur.com/suB5DEO.png' },
{ name: 'Family Approved', image: 'https://i.imgur.com/vznGLfX.png' },
            ].map((collection) => (
                <div 
                  key={collection.name}
                  className="clickable-card"
                  onClick={() => {
                    navigate(`/discover?collection=${encodeURIComponent(collection.name)}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="relative h-36 bg-gray-200 rounded-xl overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{collection.name}</h3>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </>
        )}

      </div>

      <BottomNav />
    </div>
  );
};

export default Index;


