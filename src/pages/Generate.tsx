import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { allRecipes } from "@/data/recipes";

const Generate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Search overlay state
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<'search' | 'ingredients'>('search');
  const [ingredientInput, setIngredientInput] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  
  // Check for collection filter from URL
  const collectionParam = searchParams.get('collection');
  
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
    { id: 'quick', name: 'Quick & Easy', emoji: '⚡' },
    { id: 'breakfast', name: 'Breakfast', emoji: '🍳' },
    { id: 'lunch', name: 'Lunch', emoji: '🥗' },
    { id: 'dinner', name: 'Dinner', emoji: '🍽️' },
    { id: 'snacks', name: 'Snacks', emoji: '🍿' },
    { id: 'comfort', name: 'Comfort Food', emoji: '🥘' },
    { id: 'bowls', name: 'Healthy Bowls', emoji: '🥙' },
    { id: 'fresh', name: 'Fresh & Light', emoji: '🥬' },
    { id: 'kids', name: 'Picky Eaters', emoji: '👶' },
    { id: 'rated', name: 'Top Rated', emoji: '⭐' }
  ];

  // Function to get recipes for each category
  const getRecipesByCategory = (categoryId: string): Recipe[] => {
    const isHalloweenRecipe = (recipe: Recipe) => 
      recipe.cuisine?.toLowerCase() === 'halloween' || 
      recipe.tags?.includes('halloween') || false;

    switch (categoryId) {
      case 'halloween':
        return allRecipes.filter(isHalloweenRecipe);
      
      case 'quick':
        return allRecipes.filter(recipe => {
          const prepTimeNum = parseInt(recipe.prepTime) || 0;
          return (prepTimeNum <= 30 || recipe.tags?.includes('quick')) && !isHalloweenRecipe(recipe);
        });
      
      case 'breakfast':
        return allRecipes.filter(recipe => 
          recipe.tags?.includes('breakfast') && !isHalloweenRecipe(recipe)
        );
      
      case 'lunch':
        return allRecipes.filter(recipe => 
          recipe.tags?.includes('lunch') && !isHalloweenRecipe(recipe)
        );
      
      case 'dinner':
        return allRecipes.filter(recipe => 
          recipe.tags?.includes('dinner') && !isHalloweenRecipe(recipe)
        );
      
      case 'snacks':
        return allRecipes.filter(recipe => 
          recipe.tags?.includes('snack') && !isHalloweenRecipe(recipe)
        );
      
      case 'comfort':
        return allRecipes.filter(recipe => 
          (recipe.cuisine.toLowerCase().includes('comfort') || 
           recipe.tags?.includes('hearty') || 
           recipe.tags?.includes('comfort')) && !isHalloweenRecipe(recipe)
        );
      
      case 'bowls':
        return allRecipes.filter(recipe => 
          (recipe.cuisine.toLowerCase().includes('bowl') || 
           recipe.tags?.includes('bowls') || 
           recipe.tags?.includes('healthy')) && !isHalloweenRecipe(recipe)
        );
      
      case 'fresh':
        return allRecipes.filter(recipe => 
          (recipe.cuisine.toLowerCase().includes('salad') || 
           recipe.tags?.includes('fresh') || 
           recipe.tags?.includes('light')) && !isHalloweenRecipe(recipe)
        );
      
      case 'kids':
        return allRecipes.filter(recipe => 
          (recipe.tags?.includes('kid-friendly') || 
           recipe.tags?.includes('kids') || 
           recipe.difficulty.toLowerCase() === 'easy') && !isHalloweenRecipe(recipe)
        );
      
      case 'rated':
        return allRecipes.filter(recipe => !isHalloweenRecipe(recipe)).slice(0, 12);
      
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

  const clearFilters = () => setFilters([]);

  const handleSearch = () => {
    // Search logic handled by filters
  };

  const handleSeeAll = (categoryName: string) => {
    navigate(`/discover?collection=${encodeURIComponent(categoryName)}`);
  };

  const addToFavorites = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (recipeStorage.isFavorite(recipe.id)) {
      toast({
        title: "Recipe already in your favorites!",
      });
      return;
    }
    
    recipeStorage.addFavorite(recipe.id);
    toast({
      title: "Added to favorites! ❤️",
    });
  };

  // If viewing a specific collection, show grid view
  if (collectionParam) {
    const categoryMapping: { [key: string]: string } = {
      'Halloween': 'halloween',
      'Quick & Easy': 'quick',
      'Breakfast': 'breakfast',
      'Lunch': 'lunch',
      'Dinner': 'dinner',
      'Snacks': 'snacks',
      'Comfort Food': 'comfort',
      'Healthy Bowls': 'bowls',
      'Fresh & Light': 'fresh',
      'Picky Eaters': 'kids',
      'Leftovers Magic': 'leftover'
    };

    const categoryId = categoryMapping[collectionParam];
    let collectionRecipes: Recipe[] = [];

    if (categoryId === 'leftover') {
      collectionRecipes = allRecipes.filter(recipe => 
        recipe.cuisine.toLowerCase().includes('leftover') || 
        recipe.tags?.includes('leftovers') || 
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
        />

        {/* Top Bar */}
        <div className="sticky top-0 bg-background border-b px-4 py-4 flex items-center justify-between z-10">
          <div className="w-10"></div>
          <h1 className="text-xl font-bold">Discover</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearchOverlay(true)}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Collection Filter Badge */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm text-muted-foreground">Showing:</p>
              <p className="font-bold">{collectionParam}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/discover')}
            >
              <X className="w-4 h-4" />
            </Button>
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
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="relative cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
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
      />

      {/* Top Bar */}
      <div className="sticky top-0 bg-background border-b px-4 py-4 flex items-center justify-between z-10">
        <div className="w-10"></div>
        <h1 className="text-xl font-bold">Discover</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearchOverlay(true)}
        >
          <Search className="w-5 h-5" />
        </Button>
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
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
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
