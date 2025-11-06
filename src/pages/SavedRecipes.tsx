import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { CustomRecipeForm } from "@/components/CustomRecipeForm";
import { MealPlanTab } from "@/components/MealPlanTab";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, X, Heart, Calendar, RefreshCw, Trash2 } from "lucide-react";
import { useAllRecipes } from "@/hooks/useAllRecipes";
import { Recipe } from "@/types/recipe";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useMealPlan } from "@/hooks/useMealPlan";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { supabase } from "@/integrations/supabase/client";
import { MealPlanDialog } from "@/components/MealPlanDialog";

export const SavedRecipes = () => {
  const location = useLocation();
  const { navigateToRecipe, getContext } = useSmartNavigation();
  
  // Enable scroll restoration for this page
  useScrollRestoration();
  
  const { allRecipes } = useAllRecipes();
  const { savedRecipes, loading, error, refetch, unsaveRecipe } = useSavedRecipes();
  const { mealPlans, refreshMealPlans, addMealPlan } = useMealPlan();
  const { generatedRecipes, refetch: refetchGeneratedRecipes } = useGeneratedRecipes();
  const [activeTab, setActiveTab] = useState("saved");
  
  // Check if we should open meal plan tab
  useEffect(() => {
    if (location.state?.openMealPlan) {
      setActiveTab("mealPlan");
      // Clear the state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [resolvedSavedRecipes, setResolvedSavedRecipes] = useState<Recipe[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    time: string[];
    difficulty: string[];
    mealType: string[];
  }>({
    time: [],
    difficulty: [],
    mealType: [],
  });
  const [mealPlanDialogOpen, setMealPlanDialogOpen] = useState(false);
  const [selectedRecipeForMealPlan, setSelectedRecipeForMealPlan] = useState<Recipe | null>(null);

  useEffect(() => {
    // COMMENTED OUT: No localStorage recipe storage - only database for logged-in users
    // const custom = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    // setCustomRecipes(custom);
    setCustomRecipes([]);
  }, []);

  // Resolve saved recipes to actual Recipe objects (static + generated + DB fallback + stubs)
  useEffect(() => {
    const resolveSaved = async () => {
      // Map saved recipe IDs to actual recipe objects
      const genMap = new Map(generatedRecipes.map(r => [r.id, r]));
      const statMap = new Map(allRecipes.map(r => [r.id, r]));

      const base: Recipe[] = savedRecipes
        .map(saved => {
          const gen = genMap.get(saved.recipe_id);
          if (gen) return gen;
          const stat = statMap.get(saved.recipe_id);
          if (stat) return stat;
          // COMMENTED OUT: No localStorage recipe storage - only database for logged-in users
          /*
          try {
            const stored = JSON.parse(localStorage.getItem('recipes') || '[]');
            return stored.find((r: any) => r.id === saved.recipe_id);
          } catch {
            return undefined;
          }
          */
          return undefined;
        })
        .filter((r): r is Recipe => r !== undefined)
        .map(r => ({ ...r }));

      // If any missing IDs remain, fetch from generated_recipes table
      const resolvedIds = new Set(base.map(r => r.id));
      const missingIds = savedRecipes.map(s => s.recipe_id).filter(id => !resolvedIds.has(id));

      let fetched: Recipe[] = [];
      if (missingIds.length > 0) {
        console.log(`🔍 Fetching ${missingIds.length} recipes from generated_recipes:`, missingIds);
        try {
          const { data, error } = await supabase
            .from('generated_recipes')
            .select('*')
            .in('recipe_id', missingIds);
          
          if (error) {
            console.error('❌ Error fetching generated recipes:', error);
          } else if (Array.isArray(data)) {
            console.log(`✅ Fetched ${data.length} recipes from database`);
            fetched = data.map((record: any) => ({
              id: record.recipe_id,
              name: record.name || 'Unnamed Recipe',
              description: record.description || '',
              cookTime: record.cook_time || '',
              prepTime: record.prep_time || '',
              difficulty: record.difficulty || 'Medium',
              servings: record.servings || 4,
              ingredients: record.ingredients || [],
              instructions: record.instructions || [],
              cuisine: record.cuisine || '',
              imageUrl: record.image_url || '',
              image: record.image_url || '',
              nutrition: record.nutrition || undefined,
              tags: record.tags || [],
              isAiGenerated: true,
              generatedAt: record.created_at,
            } as Recipe));
          }
        } catch (e) {
          console.error('❌ SavedRecipes fetch fallback failed:', e);
        }
      }

      // Create stubs for any IDs still unresolved so the user sees items immediately
      const fetchedIds = new Set(fetched.map(r => r.id));
      const unresolvedIds = savedRecipes
        .map(s => s.recipe_id)
        .filter(id => !resolvedIds.has(id) && !fetchedIds.has(id));

      const stubs: Recipe[] = unresolvedIds.map((id) => {
        console.warn(`⚠️ Unable to resolve recipe with ID: ${id}`);
        return {
          id,
          name: 'Loading Recipe...',
          description: 'This recipe is being loaded',
          cookTime: '?',
          prepTime: '?',
          difficulty: 'Medium',
          servings: 1,
          ingredients: [],
          instructions: [],
          cuisine: '',
          image: '',
          imageUrl: '',
          tags: [],
          isAiGenerated: true,
        } as Recipe;
      });

      setResolvedSavedRecipes([...base, ...fetched, ...stubs]);
    };

    resolveSaved();
  }, [savedRecipes, generatedRecipes]);

  // Refresh meal plans when user navigates to meal plan tab
  useEffect(() => {
    if (activeTab === "mealplan") {
      refreshMealPlans();
    }
  }, [activeTab, refreshMealPlans]);

  const savedRecipesList = useMemo(() => {
    return resolvedSavedRecipes;
  }, [resolvedSavedRecipes]);

  const handleRecipeClick = (recipeId: string) => {
    // Find the recipe in our data to pass via state
    const recipe = resolvedSavedRecipes.find(r => r.id === recipeId) ||
                   customRecipes.find(r => r.id === recipeId);
    navigateToRecipe(recipeId, recipe);
  };

  const handleUnsave = async (recipeId: string) => {
    await unsaveRecipe(recipeId);
    refetch();
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
      // COMMENTED OUT: No localStorage recipe storage - only database for logged-in users
      // localStorage.setItem('customRecipes', JSON.stringify(updatedRecipes));
      setCustomRecipes(updatedRecipes);
      setDeletingRecipeId(null);
    }
  };

  const handleSave = async () => {
    // Refetch generated recipes to show the newly saved custom recipe
    await refetchGeneratedRecipes();
    // Also refetch saved recipes in case user wants to save it
    await refetch();
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

  const handleMealPlanClick = (recipe: Recipe) => {
    setSelectedRecipeForMealPlan(recipe);
    setMealPlanDialogOpen(true);
  };

  const handleMealPlanSave = async (date: string, mealType: string) => {
    if (!selectedRecipeForMealPlan) return;
    
    try {
      await addMealPlan(selectedRecipeForMealPlan.id, date, mealType);
      toast.success(`${selectedRecipeForMealPlan.name} added to ${mealType} on ${date}`);
      refreshMealPlans();
    } catch (error) {
      console.error('Error adding to meal plan:', error);
      toast.error('Failed to add recipe to meal plan');
    }
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

  // Debug logging right before render
  console.log('🎨 RENDERING My Kitchen with:', {
    generatedRecipes: generatedRecipes,
    generatedRecipesLength: generatedRecipes?.length || 0,
    firstGeneratedRecipe: generatedRecipes?.[0],
    customRecipes: customRecipes,
    customRecipesLength: customRecipes?.length || 0,
    resolvedSavedRecipes: resolvedSavedRecipes,
    resolvedSavedRecipesLength: resolvedSavedRecipes?.length || 0,
    filteredCustomRecipes: filteredCustomRecipes,
    filteredCustomRecipesLength: filteredCustomRecipes?.length || 0,
    filteredSavedRecipes: filteredSavedRecipes,
    filteredSavedRecipesLength: filteredSavedRecipes?.length || 0,
    savedRecipesList: savedRecipesList,
    savedRecipesListLength: savedRecipesList?.length || 0,
    loading: loading,
    error: error
  });

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

              {/* Loading State */}
              {loading && <LoadingScreen message="Loading your saved recipes..." />}

              {/* Error State - Only show if not loading */}
              {!loading && error && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">{error}</p>
                  <Button onClick={refetch} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* My Recipes Section */}
              {!loading && filteredCustomRecipes.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">My Recipes</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredCustomRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe.id)}
                        showRemoveButton={true}
                        onRemove={() => handleDelete(recipe.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Saved from QuickDish Section */}
              {!loading && filteredSavedRecipes.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">Saved from QuickDish</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredSavedRecipes.map((recipe) => {
                      const savedRecipe = savedRecipes.find(sr => sr.recipe_id === recipe.id);
                      return (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          showRemoveButton={true}
                          onRemove={() => savedRecipe && handleUnsave(savedRecipe.recipe_id)}
                          onClick={() => handleRecipeClick(recipe.id)}
                          showMealPlanButton={true}
                          onMealPlanClick={() => handleMealPlanClick(recipe)}
                        />
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Empty state - Only show if not loading and no error */}
              {!loading && !error && filteredCustomRecipes.length === 0 && filteredSavedRecipes.length === 0 && (
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

      {/* Meal Plan Dialog */}
      {selectedRecipeForMealPlan && (
        <MealPlanDialog
          open={mealPlanDialogOpen}
          onOpenChange={setMealPlanDialogOpen}
          onSave={handleMealPlanSave}
          recipeName={selectedRecipeForMealPlan.name}
        />
      )}

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
