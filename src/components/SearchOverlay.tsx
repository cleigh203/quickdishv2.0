import { useState, useMemo } from "react";
import { ArrowLeft, Search, Check, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoiceSearchButton } from "@/components/VoiceSearchButton";
import { Recipe } from "@/types/recipe";
import { useNavigate } from "react-router-dom";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchMode: 'search' | 'ingredients';
  setSearchMode: (mode: 'search' | 'ingredients') => void;
  ingredientInput: string;
  setIngredientInput: (input: string) => void;
  filters: string[];
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  onSearch: () => void;
  recipes: Recipe[];
  onAddToFavorites: (recipe: Recipe) => void;
}

export const SearchOverlay = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  searchMode,
  setSearchMode,
  ingredientInput,
  setIngredientInput,
  filters,
  toggleFilter,
  clearFilters,
  onSearch,
  recipes,
  onAddToFavorites
}: SearchOverlayProps) => {
  const navigate = useNavigate();
  
  const FILTERS = {
    time: ['Under 30min', '30-60min'],
    difficulty: ['Easy', 'Medium', 'Hard'],
    diet: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  };

  // Filter recipes in real-time
  const filteredRecipes = useMemo(() => {
    const isHalloweenRecipe = (recipe: Recipe) => 
      recipe.cuisine?.toLowerCase() === 'halloween' || 
      recipe.tags?.includes('halloween') || false;

    return recipes.filter(recipe => {
      // Exclude Halloween recipes from search
      if (isHalloweenRecipe(recipe)) return false;

      // Search query filter
      const query = searchMode === 'search' ? searchQuery : ingredientInput;
      if (query.trim()) {
        const queryLower = query.toLowerCase();
        
        if (searchMode === 'search') {
          // Search by recipe name
          if (!recipe.name.toLowerCase().includes(queryLower)) return false;
        } else {
          // Search by ingredients
          const hasIngredient = recipe.ingredients.some(ing => 
            ing.item.toLowerCase().includes(queryLower)
          );
          if (!hasIngredient) return false;
        }
      }

      // Apply all filters (AND logic)
      if (filters.length === 0) return true;

      return filters.every(filter => {
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
        
        // Diet and meal filters (check tags)
        const normalizedFilter = filter.toLowerCase().replace(/\s+/g, '-').replace('gluten-free', 'glutenfree');
        return recipe.tags?.some(tag => 
          tag.toLowerCase().replace(/\s+/g, '-') === normalizedFilter
        ) || false;
      });
    });
  }, [recipes, searchQuery, ingredientInput, searchMode, filters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 relative">
          <Input
            autoFocus
            placeholder="Search by name, ingredients, ..."
            value={searchMode === 'search' ? searchQuery : ingredientInput}
            onChange={(e) =>
              searchMode === 'search'
                ? setSearchQuery(e.target.value)
                : setIngredientInput(e.target.value)
            }
            className="border-0 bg-muted/50 focus-visible:ring-0 pr-12"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <VoiceSearchButton
              onTranscript={(text) =>
                searchMode === 'search'
                  ? setSearchQuery(text)
                  : setIngredientInput(text)
              }
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Search Mode Toggle */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Search Mode</p>
          <div className="inline-flex gap-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setSearchMode('search')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                searchMode === 'search'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Search Recipes
            </button>
            <button
              onClick={() => setSearchMode('ingredients')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                searchMode === 'ingredients'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Use My Ingredients
            </button>
          </div>
        </div>

        {/* Cook Time */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Cook Time</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.time.map((filter) => (
              <Badge
                key={filter}
                variant={filters.includes(filter) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                  filters.includes(filter) 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.difficulty.map((filter) => (
              <Badge
                key={filter}
                variant={filters.includes(filter) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                  filters.includes(filter) 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Dietary</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.diet.map((filter) => (
              <Badge
                key={filter}
                variant={filters.includes(filter) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                  filters.includes(filter) 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Meal Type */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Meal Type</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.meal.map((filter) => (
              <Badge
                key={filter}
                variant={filters.includes(filter) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                  filters.includes(filter) 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Filtered Results */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Results ({filteredRecipes.length})
          </p>
          
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No recipes found</p>
              <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    navigate(`/recipe/${recipe.id}`);
                    onClose();
                  }}
                  className="relative cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                    <img
                      src={recipe.image || recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToFavorites(recipe);
                      }}
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 sticky bottom-0 bg-background py-4">
          <Button
            variant="outline"
            onClick={() => {
              clearFilters();
              setSearchQuery('');
              setIngredientInput('');
            }}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={() => {
              onSearch();
              onClose();
            }}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
