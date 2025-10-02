import { useState } from "react";
import { ArrowLeft, Search, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  onSearch
}: SearchOverlayProps) => {
  const FILTERS = {
    time: ['Under 30min', '30-60min'],
    difficulty: ['Easy', 'Medium', 'Hard'],
    diet: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
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
        <Input
          autoFocus
          placeholder="Search by name, ingredients, ..."
          value={searchMode === 'search' ? searchQuery : ingredientInput}
          onChange={(e) =>
            searchMode === 'search'
              ? setSearchQuery(e.target.value)
              : setIngredientInput(e.target.value)
          }
          className="flex-1 border-0 bg-muted/50 focus-visible:ring-0"
        />
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
                className="cursor-pointer px-4 py-2 rounded-full"
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
                className="cursor-pointer px-4 py-2 rounded-full"
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
                className="cursor-pointer px-4 py-2 rounded-full"
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
                className="cursor-pointer px-4 py-2 rounded-full"
                onClick={() => toggleFilter(filter)}
              >
                {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={clearFilters}
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
