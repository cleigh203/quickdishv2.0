import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { CustomRecipeForm } from "@/components/CustomRecipeForm";
import { MealPlanTab } from "@/components/MealPlanTab";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, X, Heart, Calendar, RefreshCw, Trash2 } from "lucide-react";
import { useRecipes } from "@/contexts/RecipesContext";
import { Recipe } from "@/types/recipe";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useMealPlan } from "@/hooks/useMealPlan";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { supabase } from "@/integrations/supabase/client";

const MealPlanDialog = lazy(() => import("@/components/MealPlanDialog").then(m => ({ default: m.MealPlanDialog })));

type SavedRecipeWithDetails = Recipe & {
  savedAt: string;
  bookmarkId: string;
};

const mapDbRecipeToRecipe = (record: any): Recipe => ({
  id: record.id,
  name: record.name || 'Untitled Recipe',
  description: record.description || '',
  cookTime: record.cook_time ?? record.cookTime ?? '',
  prepTime: record.prep_time ?? record.prepTime ?? '',
  difficulty: record.difficulty || 'Medium',
  servings: record.servings || 4,
  ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
  instructions: Array.isArray(record.instructions)
    ? record.instructions
    : record.instructions
    ? [record.instructions]
    : [],
  cuisine: record.cuisine || '',
  imageUrl: record.image_url ?? record.imageUrl ?? '',
  image: record.image_url ?? record.image ?? '',
  nutrition: record.nutrition || undefined,
  tags: record.tags || [],
  isPremium: record.is_premium ?? record.isPremium ?? false,
  totalTime: record.total_time ?? record.totalTime ?? undefined,
  category: record.category || undefined,
  isAiGenerated: record.is_ai_generated ?? record.isAiGenerated ?? false,
  generatedAt: record.generated_at ?? record.generatedAt ?? undefined,
});

const mapGeneratedRecordToRecipe = (record: any): Recipe => ({
  id: record.recipe_id,
  name: record.name || 'Untitled Recipe',
  description: record.description || '',
  cookTime: record.cook_time || '',
  prepTime: record.prep_time || '',
  difficulty: record.difficulty || 'Medium',
  servings: record.servings || 4,
  ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
  instructions: Array.isArray(record.instructions)
    ? record.instructions
    : record.instructions
    ? [record.instructions]
    : [],
  cuisine: record.cuisine || '',
  imageUrl: record.image_url || '',
  image: record.image_url || '',
  nutrition: record.nutrition || undefined,
  tags: record.tags || [],
  isAiGenerated: true,
  generatedAt: record.created_at || undefined,
  category: record.category || undefined,
});

export const SavedRecipes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getContext } = useSmartNavigation();
  
  // Enable scroll restoration for this page (but main page loads start at top)
  
  // Always scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Also try after a short delay to ensure it works
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
  }, []);
  
  const { recipes: allRecipes, isLoading: allRecipesLoading } = useRecipes();
  const { savedRecipes, loading, error, refetch, unsaveRecipe } = useSavedRecipes();
  const { mealPlans, refreshMealPlans, addMealPlan } = useMealPlan();
  const { generatedRecipes, isLoading: generatedRecipesLoading, refetch: refetchGeneratedRecipes } = useGeneratedRecipes();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("saved");
  
  // Check if we should open meal plan tab (from URL param or state)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'mealplan') {
      setActiveTab("mealplan");
    } else if (location.state?.openMealPlan) {
      setActiveTab("mealplan");
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
  const [resolvedSavedRecipes, setResolvedSavedRecipes] = useState<SavedRecipeWithDetails[]>([]);
  const [savedFromQuickDishLoading, setSavedFromQuickDishLoading] = useState(false);
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

  // Filter generatedRecipes into custom and AI recipes
  useEffect(() => {
    if (generatedRecipes && generatedRecipes.length > 0) {
      const customRecipesFiltered = generatedRecipes.filter((r: Recipe) => {
        const raw = r as Recipe & { recipe_id?: string };
        const candidateId = raw.id || raw.recipe_id || "";
        const isCustom = candidateId.startsWith('custom-');
        return isCustom;
      });
      
      setCustomRecipes(customRecipesFiltered);
    } else {
      setCustomRecipes([]);
    }
  }, [generatedRecipes]);

  // Resolve saved recipes to complete recipe objects (static + generated + Supabase fetch)
  useEffect(() => {
    if (!savedRecipes || savedRecipes.length === 0) {
      setResolvedSavedRecipes([]);
      setSavedFromQuickDishLoading(false);
      return;
    }

    if (loading || allRecipesLoading || generatedRecipesLoading) {
      setSavedFromQuickDishLoading(true);
      return;
    }

    const hasAnyRecipeData = (allRecipes && allRecipes.length > 0) || (generatedRecipes && generatedRecipes.length > 0);
    if (!hasAnyRecipeData) {
      setSavedFromQuickDishLoading(true);
      return;
    }

    const resolveSaved = async () => {
      setSavedFromQuickDishLoading(true);

      try {
        const generatedMap = new Map(generatedRecipes.map((recipe) => [recipe.id, recipe]));
        const staticMap = new Map(allRecipes.map((recipe) => [recipe.id, recipe]));
        const resolvedMap = new Map<string, Recipe>();

        // Attempt to resolve from in-memory sources first
        savedRecipes.forEach((saved) => {
          const fromGenerated = generatedMap.get(saved.recipe_id);
          if (fromGenerated) {
            resolvedMap.set(saved.recipe_id, { ...fromGenerated });
            return;
          }

          const fromStatic = staticMap.get(saved.recipe_id);
          if (fromStatic) {
            resolvedMap.set(saved.recipe_id, { ...fromStatic });
          }
        });

        const unresolvedIds = savedRecipes
          .map((saved) => saved.recipe_id)
          .filter((id) => id && !resolvedMap.has(id));

        // Fetch missing recipes from main recipes table
        if (unresolvedIds.length > 0) {
          try {
            const { data: recipeDetails, error } = await supabase
              .from('recipes')
              .select('*')
              .in('id', unresolvedIds);

            if (error) {
              console.error('Error fetching recipe details:', error);
            } else if (Array.isArray(recipeDetails)) {
              recipeDetails.forEach((record) => {
                const mapped = mapDbRecipeToRecipe(record);
                resolvedMap.set(mapped.id, mapped);
              });
            }
          } catch (fetchError) {
            console.error('Error fetching recipes from Supabase:', fetchError);
          }
        }

        // Fallback: fetch from generated_recipes for any remaining IDs (custom/AI)
        const stillMissingIds = savedRecipes
          .map((saved) => saved.recipe_id)
          .filter((id) => id && !resolvedMap.has(id));

        if (stillMissingIds.length > 0 && user) {
          try {
            const { data: generatedDetails, error } = await supabase
              .from('generated_recipes')
              .select('*')
              .in('recipe_id', stillMissingIds)
              .eq('user_id', user.id);

            if (error) {
              console.error('Error fetching generated recipe details:', error);
            } else if (Array.isArray(generatedDetails)) {
              generatedDetails.forEach((record) => {
                const mapped = mapGeneratedRecordToRecipe(record);
                resolvedMap.set(mapped.id, mapped);
              });
            }
          } catch (generatedFetchError) {
            console.error('Error fetching fallback generated recipes:', generatedFetchError);
          }
        }

        const completeRecipes = savedRecipes
          .map((saved) => {
            const recipe = resolvedMap.get(saved.recipe_id);
            if (!recipe) {
              return null;
            }

            return {
              ...recipe,
              savedAt: saved.saved_at,
              bookmarkId: saved.id,
            };
          })
          .filter((recipe): recipe is SavedRecipeWithDetails => recipe !== null);

        setResolvedSavedRecipes(completeRecipes);
      } catch (error) {
        console.error('Error resolving saved recipes:', error);
      } finally {
        setSavedFromQuickDishLoading(false);
      }
    };

    resolveSaved();
  }, [savedRecipes, loading, allRecipes, allRecipesLoading, generatedRecipes, generatedRecipesLoading]);

  // Refresh meal plans when user navigates to meal plan tab
  useEffect(() => {
    if (activeTab === "mealplan") {
      refreshMealPlans();
    }
  }, [activeTab, refreshMealPlans]);

  const savedRecipesList = useMemo(() => {
    return resolvedSavedRecipes;
  }, [resolvedSavedRecipes]);

  const combinedSavedRecipesLoading = loading || savedFromQuickDishLoading || allRecipesLoading || generatedRecipesLoading;

  const handleRecipeClick = (recipeId: string) => {
    // Find the recipe in our data to pass via state
    const recipe = resolvedSavedRecipes.find(r => r.id === recipeId) ||
                   customRecipes.find(r => r.id === recipeId);
    navigate(`/recipe/${recipeId}`, {
      state: { recipe }
    });
  };

  const handleUnsave = async (recipeId: string) => {
    await unsaveRecipe(recipeId);
    refetch();
  };

  const handleEdit = (recipe: Recipe) => {
    if (!recipe.id?.startsWith('custom-')) return;
    setEditingRecipe(recipe);
    setShowCustomForm(true);
  };

  const handleDelete = (recipeId: string) => {
    setDeletingRecipeId(recipeId);
  };

  const confirmDelete = async () => {
    if (!deletingRecipeId) return;

    try {
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to delete recipes");
        setDeletingRecipeId(null);
        return;
      }

      // Find the recipe to get the database UUID id
      const recipeToDelete = customRecipes.find(r => r.id === deletingRecipeId);
      if (!recipeToDelete) {
        console.error('Recipe not found in customRecipes:', deletingRecipeId);
        setDeletingRecipeId(null);
        return;
      }

      // Delete from database using recipe_id (this is the custom-xxx ID stored in the recipe_id column)
      const { error } = await supabase
        .from('generated_recipes')
        .delete()
        .eq('recipe_id', deletingRecipeId)  // Use recipe_id column which contains 'custom-xxx'
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Delete error:', error);
        toast.error("Failed to delete recipe");
        setDeletingRecipeId(null);
        return;
      }


      // Update local state immediately
      setCustomRecipes(prev => prev.filter(r => r.id !== deletingRecipeId));

      // Also refetch from database to ensure sync
      await refetchGeneratedRecipes();

      toast.success("Recipe deleted!");
      setDeletingRecipeId(null);

    } catch (err) {
      console.error('❌ Delete error:', err);
      toast.error("Failed to delete recipe");
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

  return (
    <div className="min-h-screen pb-20">
      {/* Header - Scrollable */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-8 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Kitchen</h1>
          <p className="text-white/90">Your saved recipes and meal plans</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-lg mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Sticky Header Section - Tabs + Search + Create Button */}
          <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <TabsList className="w-full rounded-none border-b bg-background h-auto p-0">
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

            {/* Search Bar - only show for saved tab */}
            {activeTab === 'saved' && (
              <div className="border-b border-border px-4 py-3 bg-background">
                <button
                  onClick={() => setShowSearch(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-muted/80 smooth-transition"
                >
                  <Search className="w-4 h-4" />
                  <span>Search saved recipes...</span>
                </button>
              </div>
            )}

            {/* Create Recipe Button - Sticky at top */}
            {activeTab === 'saved' && (
              <div className="border-b border-border px-4 py-3 bg-background">
                <Button 
                  onClick={() => setShowCustomForm(true)}
                  className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your Own Recipe
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="saved" className="mt-0">

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
              {/* Loading State */}
              {combinedSavedRecipesLoading && <LoadingScreen message="Loading your saved recipes..." />}

              {/* Error State - Only show if not loading */}
              {!combinedSavedRecipesLoading && error && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">{error}</p>
                  <Button onClick={refetch} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* My Recipes Section */}
              {!combinedSavedRecipesLoading && filteredCustomRecipes.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">My Recipes</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredCustomRecipes.map((recipe, index) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe.id)}
                        showRemoveButton={true}
                        onRemove={() => handleDelete(recipe.id)}
                        showEditButton={recipe.id.startsWith('custom-')}
                        onEdit={() => handleEdit(recipe)}
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Saved from QuickDish Section */}
              {!combinedSavedRecipesLoading && filteredSavedRecipes.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">Saved from QuickDish</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredSavedRecipes.map((recipe, index) => {
                      const savedRecipe = savedRecipes.find(sr => sr.recipe_id === recipe.id);
                      // Calculate total index including custom recipes for progressive loading
                      const totalIndex = filteredCustomRecipes.length + index;
                      return (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          showRemoveButton={true}
                          onRemove={() => {
                            if (savedRecipe) {
                              handleUnsave(savedRecipe.recipe_id);
                            } else {
                              // Fallback: try to unsave using recipe.id directly
                              handleUnsave(recipe.id);
                            }
                          }}
                          onClick={() => handleRecipeClick(recipe.id)}
                          showMealPlanButton={true}
                          onMealPlanClick={() => handleMealPlanClick(recipe)}
                          index={totalIndex}
                        />
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Empty state - Only show if not loading and no error */}
              {!combinedSavedRecipesLoading && !error && filteredCustomRecipes.length === 0 && filteredSavedRecipes.length === 0 && (
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

      {/* Search Overlay - Centered Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="border-b border-border px-4 py-3 flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="w-5 h-5" />
              </Button>
              <Input
                autoFocus
                placeholder="Search saved recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {(searchQuery || activeFilters.time.length > 0 || activeFilters.difficulty.length > 0 || activeFilters.mealType.length > 0) && (
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-muted-foreground mb-4">Type to search your saved recipes...</p>
              
              {/* Active Filters */}
              {(activeFilters.time.length > 0 || 
                activeFilters.difficulty.length > 0 || 
                activeFilters.mealType.length > 0) && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
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
                </div>
              )}
            </div>
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
        <Suspense fallback={null}>
          <MealPlanDialog
            open={mealPlanDialogOpen}
            onOpenChange={setMealPlanDialogOpen}
            onSave={handleMealPlanSave}
            recipeName={selectedRecipeForMealPlan.name}
          />
        </Suspense>
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
