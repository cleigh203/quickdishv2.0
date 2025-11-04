import { useState, useMemo, Fragment } from "react";
import { ArrowLeft, Search, Check, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoiceSearchButton } from "@/components/VoiceSearchButton";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { InlineRating } from "@/components/InlineRating";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchMode?: 'search' | 'ingredients'; // Optional for backward compatibility
  setSearchMode?: (mode: 'search' | 'ingredients') => void; // Optional for backward compatibility
  ingredientInput?: string; // Optional for backward compatibility
  setIngredientInput?: (input: string) => void; // Optional for backward compatibility
  filters: string[];
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  onSearch: () => void;
  recipes: Recipe[];
  onAddToFavorites: (recipe: Recipe) => void;
  hideAiImages?: boolean;
}

export const SearchOverlay = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  // searchMode, setSearchMode, ingredientInput, setIngredientInput - no longer used
  filters,
  toggleFilter,
  clearFilters,
  onSearch,
  recipes,
  onAddToFavorites,
  hideAiImages = false
}: SearchOverlayProps) => {
  const { navigateToRecipe } = useSmartNavigation();

  // Separate input state from applied search state
  const [appliedSearch, setAppliedSearch] = useState('');
  
  const FILTERS = {
    time: ['Under 30min', '30-60min'],
    difficulty: ['Easy', 'Medium', 'Hard'],
    diet: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  };

  // Only filter when appliedSearch is set (after clicking Apply Filters)
  const filteredRecipes = useMemo(() => {
    if (!appliedSearch?.trim()) {
      return [];
    }
    
          const query = appliedSearch.toLowerCase();
      return recipes
        .filter(r => r.name?.toLowerCase().includes(query));
  }, [appliedSearch, recipes]);

  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    onSearch(); // Trigger the parent's handleSearch to show filtered view
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setAppliedSearch('');
    clearFilters();
  };

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
            placeholder="Search by name or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-muted/50 focus-visible:ring-0 pr-12"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <VoiceSearchButton
              onTranscript={(text) => setSearchQuery(text)}
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 py-4">
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>

          {/* Filtered Results */}
        {appliedSearch && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Results ({filteredRecipes.length})
          </p>
          
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No recipes found for "{appliedSearch}"</p>
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredRecipes.map((recipe, idx) => (
                <Fragment key={recipe.id}>
                  <div
                    onClick={() => {
                      navigateToRecipe(recipe.id, recipe, {
                        searchQuery: appliedSearch,
                        activeFilters: filters
                      });
                      onClose();
                    }}
                    className="relative cursor-pointer"
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                      {hideAiImages && (recipe as any).isAiGenerated ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          <span className="text-sm">AI Recipe</span>
                        </div>
                      ) : (
                        <img
                          src={getRecipeImage(recipe, import.meta.env.DEV)}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                          loading="eager"
                          fetchPriority="high"
                          decoding="sync"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          width="400"
                          height="500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x500/10b981/ffffff?text=QuickDish";
                          }}
                        />
                      )}
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
                    <p className="mt-2 font-medium text-sm line-clamp-2">{recipe.name}</p>
                    <InlineRating recipeId={recipe.id} />
                  </div>
                  {/* Conservative cap: show at most two ads, after ~12 and ~24 results */}
                  {(idx === 12 || idx === 24) && (
                    <div className="col-span-2">
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
