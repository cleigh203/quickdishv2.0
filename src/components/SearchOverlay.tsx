import { useMemo, Fragment, useRef, useEffect } from "react";
import { ArrowLeft, Search, Check, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoiceSearchButton } from "@/components/VoiceSearchButton";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import { useNavigate } from "react-router-dom";
import { InlineRating } from "@/components/InlineRating";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  appliedSearchTerm?: string; // Only filter when this is set (after Apply Filters is clicked)
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
  appliedSearchTerm, // Only filter when this is set (after Apply Filters is clicked)
  // searchMode, setSearchMode, ingredientInput, setIngredientInput - no longer used
  filters,
  toggleFilter,
  clearFilters,
  onSearch,
  recipes,
  onAddToFavorites,
  hideAiImages = false
}: SearchOverlayProps) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const FILTERS = {
    time: ['Under 30min', '30-60min'],
    difficulty: ['Easy', 'Medium', 'Hard'],
    diet: ['Vegetarian', 'Vegan', 'Gluten-Free']
  };

  // Filter recipes - ONLY when appliedSearchTerm is set (not while typing)
  // Return empty array if appliedSearchTerm is undefined (modal just opened)
  const filteredRecipes = useMemo(() => {
    // If appliedSearchTerm is undefined, return empty array (no recipes shown until Apply Filters clicked)
    // But allow filtering if filters are applied (even without search term)
    if (appliedSearchTerm === undefined && filters.length === 0) {
      return [];
    }

    const isHalloweenRecipe = (recipe: Recipe) => 
      recipe.cuisine?.toLowerCase() === 'halloween' || 
      recipe.tags?.includes('halloween') || false;

    const searchTermToUse = appliedSearchTerm || '';
    const normalizedSearch = searchTermToUse.trim().toLowerCase();
    const searchTerms = normalizedSearch ? normalizedSearch.split(/[\s,]+/).map(term => term.trim()).filter(Boolean) : [];

    const meetsFilters = (recipe: Recipe) => {
      if (filters.length === 0) return true;

      return filters.every(filter => {
        // Cook Time Filters
        if (filter === 'Under 30min') {
          // Extract numbers from strings like "10 min" or "15 minutes"
          const prepTime = parseInt(String(recipe.prepTime || '0').replace(/\D/g, '')) || 0;
          const cookTime = parseInt(String(recipe.cookTime || '0').replace(/\D/g, '')) || 0;
          const totalTime = prepTime + cookTime;
          return totalTime <= 30;
        }
        if (filter === '30-60min') {
          const prepTime = parseInt(String(recipe.prepTime || '0').replace(/\D/g, '')) || 0;
          const cookTime = parseInt(String(recipe.cookTime || '0').replace(/\D/g, '')) || 0;
          const totalTime = prepTime + cookTime;
          return totalTime > 30 && totalTime <= 60;
        }

        // Difficulty Filters
        if (['Easy', 'Medium', 'Hard'].includes(filter)) {
          const recipeDifficulty = (recipe.difficulty || '').toLowerCase().trim();
          const filterDifficulty = filter.toLowerCase().trim();
          return recipeDifficulty === filterDifficulty;
        }

        // Dietary Filters
        const normalizedFilter = filter.toLowerCase().replace(/\s+/g, '-').replace('gluten-free', 'glutenfree');
        const recipeTags = recipe.tags || [];
        return recipeTags.some(tag => {
          const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-').replace('gluten-free', 'glutenfree');
          return normalizedTag === normalizedFilter;
        });
      });
    };

    return recipes.filter(recipe => {
      if (isHalloweenRecipe(recipe)) return false;

      // If search term is empty but filters were applied, only filter by filters
      if (!normalizedSearch) {
        // Only apply filter-based filtering
        return meetsFilters(recipe);
      }

      // Search ONLY recipe names (not ingredients or cuisine)
      // Home page already has ingredient search, Discover search is for finding dishes by name
      const matchesSearch = searchTerms.every(term => {
        return (recipe.name || '').toLowerCase().includes(term);
      });

      if (!matchesSearch) return false;

      return meetsFilters(recipe);
    });
  }, [recipes, appliedSearchTerm, filters]);

  // Restore scroll position when modal opens with applied search or filters
  useEffect(() => {
    if (isOpen && (appliedSearchTerm !== undefined || filters.length > 0)) {
      const savedScroll = sessionStorage.getItem('searchModalScroll');
      if (savedScroll && filteredRecipes.length > 0) {
        const scrollValue = parseInt(savedScroll, 10);
        
        if (!isNaN(scrollValue) && scrollValue >= 0) {
          const restoreScroll = () => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current;
              // Verify the container is scrollable and has enough content
              const hasScrollableContent = container.scrollHeight > container.clientHeight;
              
              if (hasScrollableContent) {
                container.scrollTop = scrollValue;
                return true;
              }
            }
            return false;
          };
          
          // Try multiple times with increasing delays
          const delays = [0, 50, 100, 200, 300, 500, 800, 1200];
          delays.forEach((delay) => {
            setTimeout(() => {
              restoreScroll();
            }, delay);
          });
        }
      }
    }
  }, [isOpen, appliedSearchTerm, filters.length, filteredRecipes.length]);

  // Clear scroll position when modal is manually closed
  useEffect(() => {
    if (!isOpen) {
      // Clear scroll position when modal closes
      sessionStorage.removeItem('searchModalScroll');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 bg-background z-50 overflow-y-auto pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 py-4">
          <Button
            variant="outline"
            onClick={() => {
              clearFilters();
              setSearchQuery('');
              // Clear applied search term to hide results
              // Note: This will be handled by parent component via onSearch callback
            }}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={() => {
              onSearch();
              // Don't close modal - keep it open to show results
            }}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>

        {/* Filtered Results - Only show when appliedSearchTerm is set OR filters are applied (after Apply Filters clicked) */}
        {(appliedSearchTerm !== undefined || filters.length > 0) ? (
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
              {filteredRecipes.map((recipe, idx) => (
                <Fragment key={recipe.id}>
                  <div
                    onClick={() => {
                      // Save modal state and scroll position before navigating
                      sessionStorage.setItem('searchModalOpen', 'true');
                      sessionStorage.setItem('searchTerm', appliedSearchTerm || searchQuery || '');
                      
                      // Save filters so they can be restored
                      if (filters.length > 0) {
                        sessionStorage.setItem('discover_filters', JSON.stringify(filters));
                      }
                      
                      // Save scroll position of the modal container (not window)
                      if (scrollContainerRef.current) {
                        const scrollPosition = scrollContainerRef.current.scrollTop;
                        sessionStorage.setItem('searchModalScroll', scrollPosition.toString());
                      }
                      
                      navigate(`/recipe/${recipe.id}`);
                      // Don't close modal - it will be restored on back navigation
                    }}
                    className="relative cursor-pointer"
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                      {hideAiImages && (recipe as any).isAiGenerated ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          <span className="text-sm">AI Recipe</span>
                        </div>
                      ) : (
                        <>
                          {/* Loading placeholder skeleton - shows while image loads */}
                          <div className="absolute inset-0 bg-muted animate-pulse z-0" />
                          <img
                            src={getRecipeImage(recipe, import.meta.env.DEV)}
                            alt={recipe.name}
                            className="relative w-full h-full object-cover z-10"
                            loading={idx < 8 ? "eager" : "lazy"}
                            fetchpriority={idx < 3 ? "high" : idx < 8 ? "auto" : "low"}
                            decoding={idx < 8 ? "sync" : "async"}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            width="400"
                            height="500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
                              // Hide placeholder on error too
                              const placeholder = target.previousElementSibling as HTMLElement;
                              if (placeholder) {
                                placeholder.style.display = 'none';
                              }
                            }}
                            onLoad={(e) => {
                              // Hide placeholder when image loads
                              const target = e.target as HTMLImageElement;
                              const placeholder = target.previousElementSibling as HTMLElement;
                              if (placeholder && placeholder.classList.contains('animate-pulse')) {
                                placeholder.style.display = 'none';
                              }
                            }}
                          />
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToFavorites(recipe);
                        }}
                        aria-label={`Add ${recipe.name} to shopping list`}
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
                    <div key={`ad-${idx}`} className="col-span-2">
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">Enter search terms and click Apply Filters</p>
            <p className="text-sm mt-2">Use the filters above to narrow down your search</p>
          </div>
        )}
      </div>
    </div>
  );
};
