import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useToast } from "@/hooks/use-toast";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { useAllRecipes } from "@/hooks/useAllRecipes";
import { AiGenerationPrompt } from "@/components/AiGenerationPrompt";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";
import { LoadingScreen } from "@/components/LoadingScreen";
import { getRecipeImage } from "@/utils/recipeImages";

const Generate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { saveRecipe, isSaved } = useSavedRecipes();
  const { allRecipes, isLoading: isLoadingRecipes } = useAllRecipes();
  const { generatedRecipes, refetch: refetchGeneratedRecipes } = useGeneratedRecipes();
  const { verifiedRecipes } = useVerifiedRecipes();
  
  // Search overlay state
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<'search' | 'ingredients'>('search');
  const [ingredientInput, setIngredientInput] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilteredView, setShowFilteredView] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Check for collection filter from URL
  const collectionParam = searchParams.get('collection');
  const ingredientsParam = searchParams.get('ingredients');

  // Exit filtered view when search is cleared
  useEffect(() => {
    if (!searchQuery && !ingredientInput && activeFilters.length === 0 && !ingredientsParam) {
      setShowFilteredView(false);
    }
  }, [searchQuery, ingredientInput, activeFilters, ingredientsParam]);

  // Restore scroll position when returning from recipe detail
  useEffect(() => {
    const state = location.state;
    if (state?.restoreScroll) {
      setTimeout(() => {
        window.scrollTo(0, state.restoreScroll);
      }, 0);
    }
  }, [location.state]);
  
  // Combine recipes, deduplicating by recipe_id and prioritizing DB recipes over static ones
  type RecipeWithCategory = Recipe & { category?: string };

  const combinedRecipes: RecipeWithCategory[] = (() => {
    const recipeMap = new Map<string, RecipeWithCategory>();
    
    // Add static recipes first
    allRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe as RecipeWithCategory);
    });
    
    // Override with verified DB recipes (these have priority)
    verifiedRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe as RecipeWithCategory);
    });
    
    // Add user's generated recipes
    generatedRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe as RecipeWithCategory);
    });
    
    // Exclude AI-generated recipes from discovery dataset
    const recipes = Array.from(recipeMap.values()).filter(r => !(r as any).isAiGenerated);
    
    // 🔍 DEBUG: Log recipe data for debugging
    console.log('🔍 Recipe Debug Info:');
    console.log('Total recipes:', recipes.length);
    console.log('Fall Favorites:', recipes.filter(r => r.category === 'Fall Favorites').length);
    console.log('Quick and Easy:', recipes.filter(r => r.category === 'Quick and Easy').length);
    console.log('Clean Eats:', recipes.filter(r => r.category === 'Clean Eats').length);

    // 🔍 DEBUG: Show all unique categories and their counts
    const categoryCounts = {};
    recipes.forEach(r => {
      const cat = r.category || 'undefined';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    console.log('🔍 All categories found:', categoryCounts);
    
    
    console.log('Sample recipe:', recipes[0]);
    console.log('Sample recipe category:', recipes[0]?.category);
    console.log('Sample recipe tags:', recipes[0]?.tags);
    
    return recipes;
  })();

  // Load all recipes into storage on mount
  useEffect(() => {
    const existingRecipes = recipeStorage.getRecipes();
    const existingIds = new Set(existingRecipes.map(r => r.id));
    const newRecipes = allRecipes.filter(r => !existingIds.has(r.id));
    
    if (newRecipes.length > 0) {
      recipeStorage.setRecipes([...existingRecipes, ...newRecipes]);
    }
  }, []);

  // Recipe categories for horizontal sections
  const categories = [
    { id: 'fall', name: 'Fall Favorites', emoji: '🍂' },
    { id: 'quick', name: 'Quick and Easy', emoji: '⚡' },
    { id: 'clean', name: 'Clean Eats', emoji: '🌱' },
    { id: 'breakfast', name: 'Breakfast', emoji: '🥞' },
    { id: 'dessert', name: 'Desserts', emoji: '🧁' },
    { id: 'onepot', name: 'One Pot Meals', emoji: '🍲' },
    { id: 'family', name: 'Family Approved', emoji: '👨‍👩‍👧‍👦' },
    { id: 'copycat', name: 'Restaurant Copycats', emoji: '🍔' }
];

  // Function to get recipes for each category
  const getRecipesByCategory = (categoryId: string): Recipe[] => {
    switch (categoryId) {
      case 'fall': return combinedRecipes.filter(r => r.category === 'Fall Favorites');
      case 'quick': return combinedRecipes.filter(r => r.category === 'Quick and Easy');
      case 'clean': return combinedRecipes.filter(r => r.category === 'Clean Eats');
      case 'breakfast': return combinedRecipes.filter(r => r.category === 'Breakfast');
      case 'dessert': return combinedRecipes.filter(r => r.category === 'Desserts');
      case 'onepot': return combinedRecipes.filter(r => r.category === 'One Pot Meals');
      case 'family': return combinedRecipes.filter(r => r.category === 'Family Approved');
      case 'copycat': return combinedRecipes.filter(r => r.category === 'Restaurant Copycats');
      default: return [];
    }
  };


  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setFilters([]);
    setActiveFilters([]);
    setSearchQuery('');
    setIngredientInput('');
    setShowFilteredView(false);
    // Clear URL params
    navigate('/discover');
  };

  const removeFilter = (filter: string) => {
    setFilters(prev => prev.filter(f => f !== filter));
    setActiveFilters(prev => prev.filter(f => f !== filter));
    
    // If no filters left, exit filtered view
    if (filters.length <= 1 && !searchQuery && !ingredientInput) {
      setShowFilteredView(false);
    }
  };

  const handleSearch = () => {
    // Copy current state to active filters
    setActiveFilters([...filters]);
    setShowFilteredView(true);
  };

  const handleSeeAll = (categoryName: string) => {
    navigate(`/discover?collection=${encodeURIComponent(categoryName)}`);
  };

  const addToFavorites = async (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSaved(recipe.id)) {
      toast({
        title: "Recipe already in your favorites!",
      });
      return;
    }
    
    await saveRecipe(recipe.id);
  };

  // Filter recipes by ingredients from URL param (AND logic - must have ALL ingredients with word boundaries)
  const filterByIngredients = (recipes: Recipe[], query: string) => {
    if (!query) return recipes;
    
    // Common words to ignore
    const stopWords = ['and', 'or', 'with', 'the', 'a', 'an', 'in', 'on', 'for'];
    
    const searchTerms = query
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(term => term.length > 0 && !stopWords.includes(term));
    
    if (searchTerms.length === 0) return recipes;
    
    // Require ALL terms be present in the ingredient list with word boundary matching
    return recipes.filter(recipe => {
      return searchTerms.every(term => {
        const wordRegex = new RegExp(`\\b${term}`, 'i');
        return recipe.ingredients.some(ing => wordRegex.test(ing.item));
      });
    });
  };

  // Get filtered recipes for search overlay results
  const getFilteredRecipes = () => {
    const isHalloweenRecipe = (recipe: Recipe) => 
      recipe.cuisine?.toLowerCase() === 'halloween' || 
      recipe.tags?.includes('halloween') || false;

    let filtered = combinedRecipes.filter(recipe => {
      // Exclude Halloween from search results
      if (isHalloweenRecipe(recipe)) return false;

      // Search query filter
      const query = searchMode === 'search' ? searchQuery : ingredientInput;
      if (query.trim()) {
        const queryLower = query.toLowerCase();
        
        if (searchMode === 'search') {
          if (!recipe.name?.toLowerCase().includes(queryLower)) return false;
        } else {
          // Ingredient mode: Use AND logic with word boundaries - ALL terms must be present
          const stopWords = ['and', 'or', 'with', 'the', 'a', 'an', 'in', 'on', 'for'];
          const searchTerms = query
            .toLowerCase()
            .split(/[\s,]+/)
            .filter(term => term.length > 0 && !stopWords.includes(term));
          
          if (searchTerms.length === 0) return false;
          
          const hasAllIngredients = searchTerms.every(term => {
            const wordRegex = new RegExp(`\\b${term}`, 'i');
            return recipe.ingredients.some(ing => wordRegex.test(ing.item));
          });
          if (!hasAllIngredients) return false;
        }
      }

      // Apply active filters (AND logic)
      if (activeFilters.length === 0) return true;

      return activeFilters.every(filter => {
        // Time filters
        if (filter === 'Under 30min') {
          const totalTime = (parseInt(recipe.prepTime) || 0) + (parseInt(recipe.cookTime) || 0);
          return totalTime <= 30;
        }
        if (filter === '30-60min') {
          const totalTime = (parseInt(recipe.prepTime) || 0) + (parseInt(recipe.cookTime) || 0);
          return totalTime > 30 && totalTime <= 60;
        }
        
        // Difficulty filters
        if (['Easy', 'Medium', 'Hard'].includes(filter)) {
          return recipe.difficulty?.toLowerCase() === filter.toLowerCase();
        }
        
        // Diet and meal filters
        const normalizedFilter = filter.toLowerCase().replace(/\s+/g, '-').replace('gluten-free', 'glutenfree');
        return recipe.tags?.some(tag => 
          tag.toLowerCase().replace(/\s+/g, '-') === normalizedFilter
        ) || false;
      });
    });

    // Apply ingredient filter from URL if present
    if (ingredientsParam) {
      filtered = filterByIngredients(filtered, ingredientsParam);
    }

    return filtered;
  };

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

  // If viewing filtered search results or ingredient search from home
  if ((showFilteredView || ingredientsParam) && !collectionParam) {
    const filteredRecipes = getFilteredRecipes();

    return (
      <div className="min-h-screen pb-20 bg-background">
        <SearchOverlay
          isOpen={showSearchOverlay}
          onClose={() => setShowSearchOverlay(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          ingredientInput={ingredientInput}
          setIngredientInput={setIngredientInput}
          filters={filters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          onSearch={handleSearch}
          recipes={combinedRecipes}
          onAddToFavorites={(recipe) => addToFavorites(recipe, { stopPropagation: () => {} } as any)}
          hideAiImages
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover</h1>
              <p className="text-white/90">Explore recipes for every occasion</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearchOverlay(true)}
              className="text-white hover:bg-white/20"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(activeFilters.length > 0 || searchQuery || ingredientInput || ingredientsParam) && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">
                {ingredientsParam ? 'Showing recipes with:' : 'Active Filters'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredientsParam && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  {ingredientsParam}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => navigate('/discover')}
                  />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Search: {searchQuery}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {ingredientInput && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Ingredient: {ingredientInput}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => setIngredientInput('')}
                  />
                </Badge>
              )}
              {activeFilters.map(filter => (
                <Badge key={filter} variant="secondary" className="pl-3 pr-2 py-1.5">
                  {filter}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="px-4 py-6">
          {isLoadingRecipes ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="relative rounded-lg overflow-hidden">
                    <div className="w-full h-[200px] bg-gray-200" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-5 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-4 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">
                No recipes found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try different search terms or browse our categories
              </p>
              <Button
                size="lg"
                onClick={() => {
                  clearFilters();
                  navigate('/discover');
                }}
              >
                Browse Recipes
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredRecipes.length} recipes found
              </p>
              <div className="grid grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe, from: location.pathname, scrollY: window.scrollY } })}
                    className="relative cursor-pointer"
                  >
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={getRecipeImage(recipe, import.meta.env.DEV)}
                        alt={recipe.name}
                        className="w-full h-[220px] object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/400x300/10b981/ffffff?text=QuickDish";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {recipe.isAiGenerated && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 left-2 text-xs bg-purple-500/90 text-white backdrop-blur-sm"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                      <button
                        onClick={(e) => addToFavorites(recipe, e)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Plus className="w-4 h-4 text-black" />
                      </button>
                    </div>
                    <p className="mt-2 font-medium text-sm line-clamp-2">
                      {recipe.name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // If viewing a specific collection, show grid view
  if (collectionParam) {
    const categoryMapping: { [key: string]: string } = {
      'Fall Favorites': 'fall',
      'Quick and Easy': 'quick',
      'Clean Eats': 'clean',
      'Restaurant Copycats': 'copycat',
      'Breakfast': 'breakfast',
      'Desserts': 'dessert',
      'One Pot Meals': 'onepot',
      'Leftover Magic': 'leftover',
      'Family Approved': 'family'
    };

    const categoryId = categoryMapping[collectionParam];
    let collectionRecipes: Recipe[] = [];

    if (categoryId === 'leftover') {
      collectionRecipes = combinedRecipes.filter(recipe =>
        recipe.cuisine?.toLowerCase().includes('leftover') || 
        recipe.tags?.includes('leftover') || 
        recipe.name?.toLowerCase().includes('leftover')
      );
    } else if (categoryId) {
      collectionRecipes = getRecipesByCategory(categoryId);
    }

    // Apply search and filter
    const filteredRecipes = collectionRecipes.filter(recipe => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = recipe.name?.toLowerCase().includes(query);
        const matchesIngredients = recipe.ingredients?.some(ing => 
          ing.item?.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesIngredients) return false;
      }
      
      if (!filters.length) return true;
      
      return filters.every(filter => {
        // Time filters
        if (filter === 'Under 30min') return (recipe.totalTime || 0) <= 30;
        if (filter === '30-60min') return (recipe.totalTime || 0) > 30 && (recipe.totalTime || 0) <= 60;
        
        // Difficulty filters
        if (filter === 'Easy') return recipe.difficulty?.toLowerCase() === 'easy';
        if (filter === 'Medium') return recipe.difficulty?.toLowerCase() === 'medium';
        if (filter === 'Hard') return recipe.difficulty?.toLowerCase() === 'hard';
        
        // Diet and meal filters (tags)
        const normalizedFilter = filter.toLowerCase().replace('-', '');
        return recipe.tags?.some(tag => tag.toLowerCase().includes(normalizedFilter));
      });
    });

    return (
      <div className="min-h-screen pb-20 bg-background">
        <SearchOverlay
          isOpen={showSearchOverlay}
          onClose={() => setShowSearchOverlay(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          ingredientInput={ingredientInput}
          setIngredientInput={setIngredientInput}
          filters={filters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          onSearch={handleSearch}
          recipes={allRecipes}
          onAddToFavorites={(recipe) => addToFavorites(recipe, { stopPropagation: () => {} } as any)}
          hideAiImages
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover</h1>
              <p className="text-white/90">Explore recipes for every occasion</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearchOverlay(true)}
              className="text-white hover:bg-white/20"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => {
              const isActive = collectionParam === category.name;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    navigate(`/discover?collection=${encodeURIComponent(category.name)}`);
                    window.scrollTo(0, 0);
                  }}
                  className={`shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'bg-white border border-border text-[#2C3E50] hover:bg-primary hover:text-white'
                  }`}
                >
                  {category.emoji} {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="px-4 py-6">
          {!imagesLoaded ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="w-full h-[220px] bg-gray-200 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="mt-2 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="mt-1 h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredRecipes.length} recipes found
              </p>
              <div className="grid grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe, from: location.pathname, scrollY: window.scrollY } })}
                    className="relative cursor-pointer"
                  >
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={getRecipeImage(recipe)}
                        alt={recipe.name}
                        className="w-full h-[220px] object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/400x300/10b981/ffffff?text=QuickDish";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button
                        onClick={(e) => addToFavorites(recipe, e)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Plus className="w-4 h-4 text-black" />
                      </button>
                    </div>
                    <p className="mt-2 font-medium text-sm line-clamp-2">
                      {recipe.name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // Default view: horizontal scrolling sections
  return (
    <div className="min-h-screen pb-20 bg-background">
      <SearchOverlay
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        ingredientInput={ingredientInput}
        setIngredientInput={setIngredientInput}
        filters={filters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
        onSearch={handleSearch}
        recipes={allRecipes}
        onAddToFavorites={(recipe) => addToFavorites(recipe, { stopPropagation: () => {} } as any)}
        hideAiImages
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-white/90">Explore recipes for every occasion</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearchOverlay(true)}
            className="text-white hover:bg-white/20"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* AI Generation Section - Only show when there's a search with no results */}
        {searchQuery && getFilteredRecipes().length === 0 && (
        <div className="px-4 pt-4 pb-2">
          <AiGenerationPrompt 
            searchTerm={searchQuery}
            onRecipeGenerated={(recipe) => {
              refetchGeneratedRecipes();
              navigate(`/recipe/${recipe.id}`, { state: { recipe } });
            }}
          />
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                navigate(`/discover?collection=${encodeURIComponent(category.name)}`);
                window.scrollTo(0, 0);
              }}
              className="shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors bg-white border border-border text-[#2C3E50] hover:bg-primary hover:text-white"
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scrolling Sections */}
      <div className="space-y-6 py-6">
        {!imagesLoaded ? (
          // Loading skeletons for horizontal sections
          categories.slice(0, 4).map((category, categoryIndex) => (
            <div key={`loading-${category.id}`}>
              {/* Category Header Skeleton */}
              <div className="px-4 mb-3 flex items-center justify-between">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-48" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-12" />
              </div>

              {/* Horizontal Scroll Skeleton */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 px-4 pb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={`skeleton-${categoryIndex}-${i}`} className="relative shrink-0 w-40">
                      <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="mt-2 h-4 bg-gray-200 animate-pulse rounded" />
                      <div className="mt-1 h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          categories.map((category) => {
            const categoryRecipes = getRecipesByCategory(category.id);

            if (categoryRecipes.length === 0) return null;

            return (
              <div key={category.id}>
                {/* Category Header */}
                <div className="px-4 mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {category.emoji} {category.name}
                  </h2>
                  <button
                    onClick={() => handleSeeAll(category.name)}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    See All
                  </button>
                </div>

                {/* Horizontal Scroll */}
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 px-4 pb-2">
                    {categoryRecipes.slice(0, 10).map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe, from: location.pathname, scrollY: window.scrollY } })}
                        className="relative cursor-pointer shrink-0 w-40"
                      >
                        <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                          <img
                            src={getRecipeImage(recipe, import.meta.env.DEV)}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                            decoding="sync"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/400x300/10b981/ffffff?text=QuickDish";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <button
                            onClick={(e) => addToFavorites(recipe, e)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <Plus className="w-4 h-4 text-black" />
                          </button>
                        </div>
                        <p className="mt-2 font-medium text-sm line-clamp-2">
                          {recipe.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Generate;


