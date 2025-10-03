import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { CustomRecipeForm } from "@/components/CustomRecipeForm";
import { MealPlanTab } from "@/components/MealPlanTab";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, X, Heart, Calendar } from "lucide-react";
import { allRecipes } from "@/data/recipes";
import { Recipe } from "@/types/recipe";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useMealPlan } from "@/hooks/useMealPlan";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const SavedRecipes = () => {
  const navigate = useNavigate();
  const { savedRecipes, loading } = useSavedRecipes();
  const { mealPlans } = useMealPlan();
  const [activeTab, setActiveTab] = useState("saved");
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    time: string[];
    difficulty: string[];
    mealType: string[];
  }>({
    time: [],
    difficulty: [],
    mealType: [],
  });

  useEffect(() => {
    const custom = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    setCustomRecipes(custom);
  }, []);

  const savedRecipesList = useMemo(() => {
    return savedRecipes
      .map(saved => allRecipes.find(r => r.id === saved.recipe_id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined);
  }, [savedRecipes]);

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowCustomForm(true);
  };

  const handleDelete = (recipeId: string) => {
    setDeletingRecipeId(recipeId);
  };

  const confirmDelete = () => {
    if (deletingRecipeId) {
      const updatedRecipes = customRecipes.filter(r => r.id !== deletingRecipeId);
      localStorage.setItem('customRecipes', JSON.stringify(updatedRecipes));
      setCustomRecipes(updatedRecipes);
      setDeletingRecipeId(null);
    }
  };

  const handleSave = () => {
    const custom = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    setCustomRecipes(custom);
  };

  const toggleFilter = (category: 'time' | 'difficulty' | 'mealType', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      time: [],
      difficulty: [],
      mealType: [],
    });
    setSearchQuery("");
  };

  const handleSearch = () => {
    setShowSearch(false);
  };

  const handleClearAll = () => {
    clearFilters();
    setShowSearch(false);
  };

  const removeActiveFilter = (category: 'time' | 'difficulty' | 'mealType', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(v => v !== value)
    }));
  };

  const getFilteredRecipes = (recipes: Recipe[]) => {
    return recipes.filter(recipe => {
      const matchesSearch = !searchQuery || 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.item.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeFilters.time.length > 0) {
        const totalTime = (parseInt(recipe.prepTime || '0') || 0) + (parseInt(recipe.cookTime || '0') || 0);
        const matchesTime = activeFilters.time.some(filter => {
          if (filter === 'Under 30min') return totalTime < 30;
          if (filter === '30-60min') return totalTime >= 30 && totalTime <= 60;
          return false;
        });
        if (!matchesTime) return false;
      }

      if (activeFilters.difficulty.length > 0) {
        if (!activeFilters.difficulty.includes(recipe.difficulty)) return false;
      }

      if (activeFilters.mealType.length > 0) {
        const matchesMealType = activeFilters.mealType.some(type =>
          recipe.tags?.some(tag => tag.toLowerCase() === type.toLowerCase())
        );
        if (!matchesMealType) return false;
      }

      return true;
    });
  };

  const filteredCustomRecipes = useMemo(() => 
    getFilteredRecipes(customRecipes), 
    [customRecipes, searchQuery, activeFilters]
  );

  const filteredSavedRecipes = useMemo(() => 
    getFilteredRecipes(savedRecipesList), 
    [savedRecipesList, searchQuery, activeFilters]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Kitchen</h1>
          <p className="text-white/90">Your saved recipes and meal plans</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-lg mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full rounded-none border-b bg-transparent h-auto p-0 sticky top-0 z-10 glass-card">
            <TabsTrigger 
              value="saved" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent py-4"
            >
              <Heart className="w-4 h-4 mr-2" />
              Saved Recipes
              {savedRecipesList.length + customRecipes.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {savedRecipesList.length + customRecipes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="mealplan" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent py-4"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Meal Plan
              {mealPlans.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {mealPlans.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-0">
            {/* Search Bar for Saved Tab */}
            <div className="sticky top-[57px] z-10 glass-card border-b border-border px-4 py-3">
              <button
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-muted/80 smooth-transition"
              >
                <Search className="w-4 h-4" />
                <span>Search saved recipes...</span>
              </button>
            </div>

            {/* Active Filters */}
            {(activeFilters.time.length > 0 || 
              activeFilters.difficulty.length > 0 || 
              activeFilters.mealType.length > 0) && (
              <div className="px-4 pt-4 flex flex-wrap gap-2">
                {activeFilters.time.map(filter => (
                  <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <button onClick={() => removeActiveFilter('time', filter)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {activeFilters.difficulty.map(filter => (
                  <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <button onClick={() => removeActiveFilter('difficulty', filter)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {activeFilters.mealType.map(filter => (
                  <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <button onClick={() => removeActiveFilter('mealType', filter)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="p-4 space-y-8">
              {/* Create Your Own Recipe Button */}
              <Button 
                onClick={() => setShowCustomForm(true)}
                className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your Own Recipe
              </Button>

              {/* My Recipes Section */}
              {filteredCustomRecipes.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">My Recipes</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredCustomRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Saved from QuickDish Section */}
              {filteredSavedRecipes.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">Saved from QuickDish</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredSavedRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {filteredCustomRecipes.length === 0 && filteredSavedRecipes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">No saved recipes found</p>
                  <p className="text-sm">
                    {activeFilters.time.length > 0 || activeFilters.difficulty.length > 0 || activeFilters.mealType.length > 0
                      ? "Try adjusting your filters"
                      : "Start saving recipes to see them here"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mealplan" className="mt-0 px-4">
            <MealPlanTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-background z-50">
          <div className="sticky top-0 z-10 glass-card border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="w-5 h-5" />
              </Button>
              <Input
                autoFocus
                placeholder="Search saved recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="p-4 space-y-6">
            {/* Filters would go here if needed */}
            <p className="text-sm text-muted-foreground">Type to search your saved recipes...</p>
          </div>
        </div>
      )}

      {/* Custom Recipe Form */}
      <CustomRecipeForm
        open={showCustomForm}
        onOpenChange={(open) => {
          setShowCustomForm(open);
          if (!open) setEditingRecipe(null);
        }}
        onSave={handleSave}
        editRecipe={editingRecipe}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingRecipeId} onOpenChange={() => setDeletingRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your custom recipe. This action cannot be undone.
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
