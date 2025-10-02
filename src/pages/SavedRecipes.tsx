import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Heart, Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { allRecipes } from "@/data/recipes";
import { Recipe } from "@/types/recipe";
import { recipeStorage } from "@/utils/recipeStorage";
import { CustomRecipeForm } from "@/components/CustomRecipeForm";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null);
  
  // Search overlay state
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeTypeFilter, setRecipeTypeFilter] = useState<'all' | 'custom' | 'saved'>('all');
  const [filters, setFilters] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilteredView, setShowFilteredView] = useState(false);

  const loadRecipes = () => {
    // Load saved recipe IDs from localStorage
    const savedIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Combine hardcoded recipes and dynamically generated recipes
    const dynamicRecipes = recipeStorage.getRecipes();
    const allAvailableRecipes = [...allRecipes, ...dynamicRecipes];
    
    // Remove duplicates by ID (prioritize dynamic versions)
    const recipeMap = new Map<string, Recipe>();
    allAvailableRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe);
    });
    
    // Filter recipes that match saved IDs
    const saved = Array.from(recipeMap.values()).filter(recipe => 
      savedIds.includes(recipe.id)
    );
    setSavedRecipes(saved);

    // Load custom recipes
    const custom = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    setCustomRecipes(custom);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleDelete = (recipeId: string) => {
    setDeleteRecipeId(recipeId);
  };

  const confirmDelete = () => {
    if (deleteRecipeId) {
      const updatedCustomRecipes = customRecipes.filter(r => r.id !== deleteRecipeId);
      localStorage.setItem('customRecipes', JSON.stringify(updatedCustomRecipes));
      setCustomRecipes(updatedCustomRecipes);
      toast.success("Recipe deleted");
      setDeleteRecipeId(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleSave = () => {
    loadRecipes();
  };

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setFilters([]);
    setSearchQuery('');
    setRecipeTypeFilter('all');
  };

  const handleSearch = () => {
    setActiveFilters(filters);
    setShowFilteredView(true);
    setShowSearchOverlay(false);
  };

  const handleClearAll = () => {
    clearFilters();
    setActiveFilters([]);
    setShowFilteredView(false);
    setShowSearchOverlay(false);
  };

  const removeActiveFilter = (filter: string) => {
    const newFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newFilters);
    setFilters(newFilters);
    if (newFilters.length === 0 && !searchQuery) {
      setShowFilteredView(false);
    }
  };

  // Filter recipes based on search and filters
  const getFilteredRecipes = (recipes: Recipe[]) => {
    return recipes.filter(recipe => {
      // Search query filter
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const matchesName = recipe.name.toLowerCase().includes(queryLower);
        const matchesIngredients = recipe.ingredients.some(ing => 
          ing.item.toLowerCase().includes(queryLower)
        );
        if (!matchesName && !matchesIngredients) return false;
      }

      // Apply all filters (AND logic)
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
        
        // Meal type filters
        if (['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(filter)) {
          return recipe.tags?.some(tag => tag.toLowerCase() === filter.toLowerCase()) || false;
        }

        return true;
      });
    });
  };

  const filteredCustomRecipes = useMemo(() => {
    if (!showFilteredView && recipeTypeFilter === 'all') return customRecipes;
    if (recipeTypeFilter === 'saved') return [];
    return getFilteredRecipes(customRecipes);
  }, [customRecipes, showFilteredView, recipeTypeFilter, searchQuery, activeFilters]);

  const filteredSavedRecipes = useMemo(() => {
    if (!showFilteredView && recipeTypeFilter === 'all') return savedRecipes;
    if (recipeTypeFilter === 'custom') return [];
    return getFilteredRecipes(savedRecipes);
  }, [savedRecipes, showFilteredView, recipeTypeFilter, searchQuery, activeFilters]);

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 bg-background border-b px-4 py-4 flex items-center justify-between z-10">
        <div className="flex-1" />
        <h1 className="text-xl font-bold">Saved Recipes</h1>
        <div className="flex-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearchOverlay(true)}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Active Filters */}
        {showFilteredView && (activeFilters.length > 0 || searchQuery) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => {
                      setSearchQuery('');
                      if (activeFilters.length === 0) setShowFilteredView(false);
                    }}
                  />
                </Badge>
              )}
              {activeFilters.map(filter => (
                <Badge key={filter} variant="secondary" className="gap-1">
                  {filter}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeActiveFilter(filter)}
                  />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Create Your Own Recipe Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your Own Recipe
          </Button>
        </div>

        {/* My Recipes Section */}
        {filteredCustomRecipes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">My Recipes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCustomRecipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <div className="relative h-48 rounded-t-xl overflow-hidden bg-gradient-to-br from-[#FF6B35]/20 to-[#FF6B35]/10">
                      {recipe.imageUrl || recipe.image ? (
                        <img 
                          src={recipe.imageUrl || recipe.image} 
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          👨‍🍳
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-[#FF6B35] text-white">
                        MY RECIPE
                      </Badge>
                    </div>
                    <div className="p-4 bg-card rounded-b-xl border border-t-0">
                      <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(recipe);
                      }}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(recipe.id);
                      }}
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved from QuickDish Section */}
        {filteredSavedRecipes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Saved from QuickDish</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredSavedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe.id)}
                  className="cursor-pointer group"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                    <img
                      src={recipe.image || recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {recipe.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-white/80 text-xs">
                        <span>{recipe.cookTime}</span>
                        <span>•</span>
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredSavedRecipes.length === 0 && filteredCustomRecipes.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">
              {showFilteredView ? 'No recipes match your filters' : 'No saved recipes yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {showFilteredView 
                ? 'Try adjusting your filters or search terms' 
                : 'Start saving your favorite recipes to see them here'}
            </p>
            {!showFilteredView && (
              <Button 
                size="lg" 
                onClick={() => navigate('/generate')}
                className="bg-primary hover:bg-primary/90"
              >
                Discover Recipes
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto pb-20">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearchOverlay(false)}
              className="shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
            <Input
              autoFocus
              placeholder="Search your saved recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-muted/50 focus-visible:ring-0"
            />
          </div>

          {/* Content */}
          <div className="px-4 py-6 space-y-6">
            {/* Recipe Type Filter */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Recipe Type</p>
              <div className="inline-flex gap-2 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setRecipeTypeFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    recipeTypeFilter === 'all'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  All Recipes
                </button>
                <button
                  onClick={() => setRecipeTypeFilter('custom')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    recipeTypeFilter === 'custom'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  My Recipes
                </button>
                <button
                  onClick={() => setRecipeTypeFilter('saved')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    recipeTypeFilter === 'saved'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Saved Recipes
                </button>
              </div>
            </div>

            {/* Cook Time */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Cook Time</p>
              <div className="flex flex-wrap gap-2">
                {['Under 30min', '30-60min'].map((filter) => (
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
                {['Easy', 'Medium', 'Hard'].map((filter) => (
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
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((filter) => (
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
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-background py-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={handleSearch}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      <CustomRecipeForm
        open={showForm}
        onOpenChange={handleFormClose}
        editRecipe={editingRecipe}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteRecipeId} onOpenChange={() => setDeleteRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default SavedRecipes;
