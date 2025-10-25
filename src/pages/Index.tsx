import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { VoiceSearchButton } from "@/components/VoiceSearchButton";
import { RecipeCard } from "@/components/RecipeCard";
// TODO V2.0: Re-enable AI recipe generation with full feature parity
// import { AiGenerationPrompt } from "@/components/AiGenerationPrompt";
import { allRecipes } from "@/data/recipes";
import { AiGenerationPrompt } from "@/components/AiGenerationPrompt";
import type { Recipe } from "@/types/recipe";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";
import { AdSlot } from "@/components/AdSlot";

const Index = () => {
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { generatedRecipes, refetch: refetchGeneratedRecipes } = useGeneratedRecipes();
  const { verifiedRecipes } = useVerifiedRecipes();

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
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

    // Require ALL terms be present in the ingredient list with word boundary matching
    const andMatched = combinedRecipes.filter(recipe => {
      return searchTerms.every(term => {
        // Use word boundary regex so "fish" doesn't match "finish"
        const wordRegex = new RegExp(`\\b${term}`, 'i');
        
        // Check if term matches any ingredient as a word
        return recipe.ingredients.some(ing => wordRegex.test(ing.item));
      });
    });

    return andMatched.sort((a, b) => {
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
      <div className="relative h-[420px] mb-8">
        {/* Hero Background Image - LCP Element */}
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=18&fm=webp"
          srcSet="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=18&fm=webp 400w, https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=18&fm=webp 600w, https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=18&fm=webp 800w"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
          alt="Cooking ingredients background"
          fetchPriority="high"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
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
              <div className="max-w-md mx-auto text-center py-12 space-y-6">
                <div>
                  <div className="text-6xl mb-2">🧪</div>
                  <h3 className="text-2xl font-bold mb-2">No exact matches</h3>
                  <p className="text-muted-foreground">We can generate a custom recipe using those ingredients.</p>
                </div>
                <AiGenerationPrompt 
                  searchTerm={searchInput}
                  onRecipeGenerated={(recipe) => {
                    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
                  }}
                />
                <div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleClearSearch();
                      navigate('/discover');
                    }}
                  >
                    Browse Recipes Instead
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        

        {/* Ad between sections - removed to keep page clean */}

        {/* Featured Collections */}
        {!isSearching && (
          <>
            <div className="mb-12">
              <h2 className="section-header">Featured Collections</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
              { name: 'Quick & Easy', imageBase: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
              { name: 'Fall Favorites', imageBase: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9' },
              { name: 'Family Favorites', imageBase: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' },
              { name: 'One-Pot Wonders', imageBase: 'https://images.unsplash.com/photo-1547592166-23ac45744acd' },
              { name: 'Healthy Bowls', imageBase: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' },
              { name: 'Desserts', imageBase: 'https://images.unsplash.com/photo-1488477181946-6428a0291777' },
            ].map((collection) => (
                <div 
                  key={collection.name}
                  className="clickable-card overflow-hidden"
                  onClick={() => {
                    navigate(`/discover?collection=${encodeURIComponent(collection.name)}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <img 
                    src={`${collection.imageBase}?w=180&q=18&fm=webp`}
                    srcSet={`${collection.imageBase}?w=150&q=18&fm=webp 150w, ${collection.imageBase}?w=180&q=18&fm=webp 180w`}
                    sizes="(max-width: 640px) 150px, 180px"
                    alt={collection.name}
                    loading="lazy"
                    className="h-36 w-full object-cover rounded-xl"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{collection.name}</h3>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </>
        )}

        {/* Featured Collection - Large Cards */}
        {!isSearching && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Restaurant Copycats */}
          <div
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer clickable-card"
            onClick={() => {
              navigate('/discover?collection=Restaurant%20Copycats');
              window.scrollTo(0, 0);
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=18&fm=webp"
              alt="Restaurant style food"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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

        {/* Ad at bottom of page */}
        {!isSearching && (
          <AdSlot slot="0000000000" className="my-10" test />
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
