import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useToast } from "@/hooks/use-toast";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { allRecipes } from "@/data/recipes";
// TODO V2.0: Re-enable AI recipe generation with full feature parity
// import { AiGenerationPrompt } from "@/components/AiGenerationPrompt";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";

const Generate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveRecipe, isSaved } = useSavedRecipes();
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
  
  // Check for collection filter from URL
  const collectionParam = searchParams.get('collection');
  const ingredientsParam = searchParams.get('ingredients');
  
  // Combine recipes, deduplicating by recipe_id and prioritizing DB recipes over static ones
  const combinedRecipes = (() => {
    const recipeMap = new Map<string, Recipe>();
    
    // Add static recipes first
    allRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe);
    });
    
    // Override with verified DB recipes (these have priority)
    verifiedRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe);
    });
    
    // Add user's generated recipes
    generatedRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe);
    });
    
    return Array.from(recipeMap.values());
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
    { id: 'halloween', name: 'Halloween', emoji: '🎃' },
    { id: 'fall', name: 'Fall Favorites', emoji: '🍂' },
    { id: 'quick', name: 'Quick & Easy', emoji: '⚡' },
    { id: 'copycat', name: 'Restaurant Copycats', emoji: '🍔' },
    { id: 'breakfast', name: 'Breakfast', emoji: '🥞' },
    { id: 'lunch', name: 'Lunch Ideas', emoji: '🥗' },
    { id: 'dinner', name: 'Dinner', emoji: '🍗' },
    { id: 'dessert', name: 'Desserts', emoji: '🧁' },
    { id: 'onepot', name: 'One-Pot Wonders', emoji: '🍲' },
    { id: 'bowls', name: 'Healthy Bowls', emoji: '🥙' },
    { id: 'leftover', name: 'Leftover Magic', emoji: '♻️' },
    { id: 'family', name: 'Family Favorites', emoji: '👨‍👩‍👧' }
  ];

  // Function to get recipes for each category
  const getRecipesByCategory = (categoryId: string): Recipe[] => {
    const isHalloweenRecipe = (recipe: Recipe) => 
      recipe.cuisine?.toLowerCase() === 'halloween' || 
      recipe.tags?.includes('halloween') || false;

    switch (categoryId) {
      case 'halloween':
        return combinedRecipes.filter(isHalloweenRecipe);
      
      case 'fall':
        return combinedRecipes.filter(recipe => {
          const ingredients = recipe.ingredients.map(i => i.item.toLowerCase()).join(' ');
          const hasFallIngredient = ingredients.includes('pumpkin') || 
            ingredients.includes('apple') || 
            ingredients.includes('squash') || 
            ingredients.includes('cinnamon') ||
            ingredients.includes('nutmeg');
          return (hasFallIngredient || recipe.tags?.includes('fall')) && !isHalloweenRecipe(recipe);
        });
      
      case 'quick':
        return combinedRecipes.filter(recipe => {
          return (recipe.totalTime <= 30 || recipe.tags?.includes('quick')) && !isHalloweenRecipe(recipe);
        });
      
      case 'breakfast':
        return combinedRecipes.filter(recipe =>
          recipe.tags?.includes('breakfast') && !isHalloweenRecipe(recipe)
        );
      
      case 'lunch':
        return combinedRecipes.filter(recipe =>
          (recipe.tags?.includes('lunch') || 
           recipe.tags?.includes('sandwich') ||
           recipe.tags?.includes('salad') ||
           recipe.tags?.includes('wrap')) && !isHalloweenRecipe(recipe)
        );
      
      case 'dinner':
        return combinedRecipes.filter(recipe =>
          recipe.tags?.includes('dinner') && !isHalloweenRecipe(recipe)
        );
      
      case 'dessert':
        return combinedRecipes.filter(recipe =>
          recipe.tags?.includes('dessert') && !isHalloweenRecipe(recipe)
        );
      
      case 'onepot':
        return combinedRecipes.filter(recipe =>
          (recipe.tags?.includes('one-pot') || 
           recipe.tags?.includes('sheet-pan') || 
           recipe.tags?.includes('air-fryer') ||
           recipe.tags?.includes('casserole')) && !isHalloweenRecipe(recipe)
        );
      
      case 'bowls':
        return combinedRecipes.filter(recipe =>
          (recipe.cuisine.toLowerCase().includes('bowl') || 
           recipe.tags?.includes('bowls') || 
           recipe.tags?.includes('healthy')) && !isHalloweenRecipe(recipe)
        );
      
      case 'family':
        return combinedRecipes.filter(recipe =>
          (recipe.tags?.includes('kid-friendly') || 
           recipe.tags?.includes('family') || 
           recipe.difficulty.toLowerCase() === 'easy') && !isHalloweenRecipe(recipe)
        );
      
      case 'copycat':
        return combinedRecipes.filter(recipe =>
          (recipe.cuisine.toLowerCase().includes('copycat') || 
           recipe.tags?.includes('copycat') ||
           recipe.name.toLowerCase().includes('copycat')) && !isHalloweenRecipe(recipe)
        );
      
      case 'leftover':
        return combinedRecipes.filter(recipe =>
          (recipe.cuisine.toLowerCase().includes('leftover') || 
           recipe.tags?.includes('leftover') ||
           recipe.name.toLowerCase().includes('leftover')) && !isHalloweenRecipe(recipe)
        );
      
      default:
        return [];
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

  // Filter recipes by ingredients from URL param
  const filterByIngredients = (recipes: Recipe[], query: string) => {
    if (!query) return recipes;
    
    const searchTerms = query.toLowerCase().split(',').map(t => t.trim());
    
    return recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.item.toLowerCase()).join(' ');
      // Match if recipe contains ANY of the search terms
      return searchTerms.some(term => recipeIngredients.includes(term));
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
          if (!recipe.name.toLowerCase().includes(queryLower)) return false;
        } else {
          const hasIngredient = recipe.ingredients.some(ing => 
            ing.item.toLowerCase().includes(queryLower)
          );
          if (!hasIngredient) return false;
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
          return recipe.difficulty.toLowerCase() === filter.toLowerCase();
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
          <p className="text-sm text-muted-foreground mb-4">
            {filteredRecipes.length} recipes found
          </p>
          {filteredRecipes.length === 0 ? (
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
            <div className="grid grid-cols-2 gap-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
                  className="relative cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-[220px] object-cover"
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
                      <Plus className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                  <p className="mt-2 font-medium text-sm line-clamp-2">
                    {recipe.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // If viewing a specific collection, show grid view
  if (collectionParam) {
    const categoryMapping: { [key: string]: string } = {
      'Halloween': 'halloween',
      'Fall Favorites': 'fall',
      'Quick & Easy': 'quick',
      'Restaurant Copycats': 'copycat',
      'Breakfast': 'breakfast',
      'Lunch Ideas': 'lunch',
      'Dinner': 'dinner',
      'Desserts': 'dessert',
      'One-Pot Wonders': 'onepot',
      'Healthy Bowls': 'bowls',
      'Leftover Magic': 'leftover',
      'Family Favorites': 'family'
    };

    const categoryId = categoryMapping[collectionParam];
    let collectionRecipes: Recipe[] = [];

    if (categoryId === 'leftover') {
      collectionRecipes = combinedRecipes.filter(recipe =>
        recipe.cuisine.toLowerCase().includes('leftover') || 
        recipe.tags?.includes('leftover') || 
        recipe.name.toLowerCase().includes('leftover')
      );
    } else if (categoryId) {
      collectionRecipes = getRecipesByCategory(categoryId);
    }

    // Apply search and filter
    const filteredRecipes = collectionRecipes.filter(recipe => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = recipe.name.toLowerCase().includes(query);
        const matchesIngredients = recipe.ingredients.some(ing => 
          ing.item.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesIngredients) return false;
      }
      
      if (!filters.length) return true;
      
      return filters.every(filter => {
        // Time filters
        if (filter === 'Under 30min') return (recipe.totalTime || 0) <= 30;
        if (filter === '30-60min') return (recipe.totalTime || 0) > 30 && (recipe.totalTime || 0) <= 60;
        
        // Difficulty filters
        if (filter === 'Easy') return recipe.difficulty.toLowerCase() === 'easy';
        if (filter === 'Medium') return recipe.difficulty.toLowerCase() === 'medium';
        if (filter === 'Hard') return recipe.difficulty.toLowerCase() === 'hard';
        
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
                      : 'bg-white border border-border text-foreground hover:bg-primary hover:text-white'
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
          <p className="text-sm text-muted-foreground mb-4">
            {filteredRecipes.length} recipes found
          </p>
          <div className="grid grid-cols-2 gap-4">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
                className="relative cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-[220px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={(e) => addToFavorites(recipe, e)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <p className="mt-2 font-medium text-sm line-clamp-2">
                  {recipe.name}
                </p>
              </div>
            ))}
          </div>
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
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                navigate(`/discover?collection=${encodeURIComponent(category.name)}`);
                window.scrollTo(0, 0);
              }}
              className="shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors bg-white border border-border text-foreground hover:bg-primary hover:text-white"
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scrolling Sections */}
      <div className="space-y-6 py-6">
        {categories.map((category) => {
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
                      onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
                      className="relative cursor-pointer shrink-0 w-40"
                    >
                      <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <button
                          onClick={(e) => addToFavorites(recipe, e)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
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
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default Generate;
