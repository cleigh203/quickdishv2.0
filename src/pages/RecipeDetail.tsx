import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import CookingMode from "@/components/CookingMode";
import { ingredientsToShoppingItems } from "@/utils/shoppingListUtils";
import { allRecipes } from "@/data/recipes";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";
import { useShoppingList } from "@/hooks/useShoppingList";
import { RecipeNotesDialog } from "@/components/RecipeNotesDialog";
import { PremiumPaywallModal } from "@/components/PremiumPaywallModal";
import { NutritionFactsModal } from "@/components/NutritionFactsModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateRecipePDF } from "@/utils/pdfExport";
import { RatingModal } from "@/components/RatingModal";
import { useRecipeRating } from "@/hooks/useRecipeRating";
import { useMealPlan } from "@/hooks/useMealPlan";
import { MealPlanDialog } from "@/components/MealPlanDialog";
import { RecipeAIChatDialog } from "@/components/RecipeAIChatDialog";
import { RewardedAdModal } from "@/components/RewardedAdModal";
import { AdSlot } from "@/components/AdSlot";
import { needAdForNutrition, markNutritionWatched, needAdForChatThisSession, markChatAdWatched, recordRecipeViewAndCheckInterstitial, markInterstitialShown } from "@/utils/adGates";
import { filterShoppingListByPantry } from "@/utils/pantryUtils";
import { usePantryItems } from "@/hooks/usePantryItems";
// ShoppingGuide temporarily removed - will use Kroger/Instacart API when ready
// import { StoreSelection } from "@/components/StoreSelection";
// import { ShoppingGuide } from "@/components/ShoppingGuide";
// import { ShoppingListItem, GroceryStore } from "@/types/shopping";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const { isSaved, saveRecipe, unsaveRecipe, savedRecipes, updateRecipeNotes } = useSavedRecipes();
  const { addItems } = useShoppingList();
  const { addMealPlan } = useMealPlan();
  const { generatedRecipes } = useGeneratedRecipes();
  const { verifiedRecipes, isLoading: isLoadingVerified } = useVerifiedRecipes();
  const { fetchPantryItems } = usePantryItems();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [cookingMode, setCookingMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [premiumPaywallOpen, setPremiumPaywallOpen] = useState(false);
  const [nutritionModalOpen, setNutritionModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [mealPlanDialogOpen, setMealPlanDialogOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [showAd, setShowAd] = useState<null | 'chat' | 'nutrition' | 'interstitial'>(null);
  // Shopping guide removed - will add back with Kroger/Instacart API
  // const [showShopping, setShowShopping] = useState(false);
  // const [selectedStore, setSelectedStore] = useState<GroceryStore | null>(null);

  const currentSavedRecipe = recipe ? savedRecipes.find(r => r.recipe_id === recipe.id) : null;
  const { averageRating, totalRatings, refetch: refetchRatings } = useRecipeRating(recipe?.id || '');

  // Always start at top when opening a recipe
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    if (!id) {
      setIsLoadingRecipe(false);
      return;
    }
    
    let foundRecipe: Recipe | undefined;
    
    // PRIORITY 1: Check DATABASE for verified recipes with AI-generated images
    foundRecipe = verifiedRecipes.find(r => r.id === id);
    
    // PRIORITY 2: Check user's generated recipes
    if (!foundRecipe) {
      foundRecipe = generatedRecipes.find(r => r.id === id);
    }
    
    // PRIORITY 3: Check location.state as fallback
    if (!foundRecipe) {
      const passedRecipe = (location.state as any)?.recipe;
      if (passedRecipe) {
        foundRecipe = passedRecipe;
      }
    }
    
    // PRIORITY 4: Search in static recipes
    if (!foundRecipe) {
      foundRecipe = allRecipes.find(r => r.id === id);
    }
    
    // PRIORITY 5: Check localStorage for user-generated recipes
    if (!foundRecipe) {
      foundRecipe = recipeStorage.getRecipeById(id);
    }
    
    // PRIORITY 6: Check custom recipes in localStorage
    if (!foundRecipe) {
      try {
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
        foundRecipe = customRecipes.find((r: Recipe) => r.id === id);
      } catch (error) {
        console.error('Error loading custom recipes:', error);
      }
    }
    
    if (foundRecipe) {
      setRecipe(foundRecipe);
      setIsLoadingRecipe(false);
      try {
        if (recordRecipeViewAndCheckInterstitial()) {
          setShowAd('interstitial');
        }
      } catch {}
      
      // Check if coming from "Cook Now" button
      const params = new URLSearchParams(window.location.search);
      if (params.get('cook') === 'true') {
        setCookingMode(true);
        window.history.replaceState({}, '', `/recipe/${id}`);
      }
    } else {
      setRecipe(null);
      setIsLoadingRecipe(false);
      navigate('/generate');
    }
  }, [id, navigate, generatedRecipes, verifiedRecipes, location.state]);

  const toggleFavorite = async () => {
    if (!recipe) return;
    
    if (!user) {
      toast({
        title: "Sign up to save recipes",
        description: "Create an account to save your favorite recipes",
        action: (
          <Button
            size="sm"
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary/90"
          >
            Sign Up
          </Button>
        ),
      });
      return;
    }
    
    if (isSaved(recipe.id)) {
      await unsaveRecipe(recipe.id);
    } else {
      // Workaround: persist AI recipes locally so Favorites can resolve by ID immediately
      try {
        const existing = recipeStorage.getRecipes();
        if (!existing.find(r => r.id === recipe.id)) {
          recipeStorage.setRecipes([recipe, ...existing]);
        }
      } catch {}
      // Ensure AI recipe exists in Supabase detail table for fallback
      try {
        if (recipe.isAiGenerated && user) {
          const payload: any = {
            user_id: user.id,
            recipe_id: recipe.id,
            name: recipe.name,
            description: recipe.description || '',
            cook_time: recipe.cookTime || '',
            prep_time: recipe.prepTime || '',
            difficulty: recipe.difficulty || 'Medium',
            servings: recipe.servings || 4,
            ingredients: recipe.ingredients || [],
            instructions: recipe.instructions || [],
            cuisine: recipe.cuisine || '',
            nutrition: recipe.nutrition || null,
            tags: recipe.tags || [],
            image_url: null,
          };
          await supabase
            .from('generated_recipes')
            .upsert(payload, { onConflict: 'user_id,recipe_id' });
        }
      } catch (e) {
        console.log('AI recipe upsert skipped/failed:', e);
      }
      // Ensure AI recipes can be saved even if not in static list
      await saveRecipe(recipe.id);
    }
  };

  const addToShoppingList = async () => {
    if (!recipe) return;
    
    if (!user) {
      toast({
        title: "Sign up to use shopping lists",
        description: "Create an account to add ingredients to your shopping list",
        action: (
          <Button
            size="sm"
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary/90"
          >
            Sign Up
          </Button>
        ),
      });
      return;
    }
    
    // Convert recipe ingredients to shopping items format
    const newItems = ingredientsToShoppingItems(recipe.ingredients, recipe.name);
    
    // Filter out items already in pantry (with caching)
    let itemsToAdd = newItems;
    let filteredCount = 0;
    
    const pantryItems = await fetchPantryItems();
    
    if (pantryItems.length > 0) {
      const shoppingItems = newItems.map((item, idx) => ({
        ...item,
        id: idx,
        checked: false,
      }));

      const { filtered } = filterShoppingListByPantry(shoppingItems, pantryItems);
      filteredCount = newItems.length - filtered.length;
      itemsToAdd = newItems.filter(item => 
        filtered.some(f => f.item === item.item)
      );
    }
    
    // Add to shopping list via hook
    if (itemsToAdd.length > 0) {
      addItems(itemsToAdd);
      
      toast({
        title: "Added to shopping list! 🛒",
        description: filteredCount > 0
          ? `${itemsToAdd.length} ingredients added (${filteredCount} already in pantry)`
          : `${recipe.name} ingredients added`,
      });
    } else if (filteredCount > 0) {
      toast({
        title: "All items in pantry! ✨",
        description: "All ingredients are already in your pantry",
      });
    }
  };

  const handleSaveNotes = async (notes: string) => {
    if (!recipe) return { success: false, message: 'No recipe loaded' };

    const result = await updateRecipeNotes(recipe.id, notes);

    if (result.success) {
      toast({
        title: "Notes saved!",
        description: "Your recipe notes have been updated",
      });
    } else {
      toast({
        title: "Failed to save notes",
        description: result.message || "Please try again",
        variant: "destructive",
      });
    }

    return result;
  };


  const handleExportPDF = async () => {
    if (!recipe) return;
    
    setIsGeneratingPDF(true);
    toast({
      title: "Generating PDF...",
      description: "Please wait while we create your recipe PDF",
    });

    try {
      await generateRecipePDF(recipe, currentSavedRecipe?.notes);
      
      toast({
        title: "PDF downloaded! 📄",
        description: `${recipe.name} saved as PDF`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Failed to generate PDF",
        description: "Please try again",
        variant: "destructive",
        action: (
          <Button
            size="sm"
            onClick={handleExportPDF}
            className="bg-primary hover:bg-primary/90"
          >
            Retry
          </Button>
        ),
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Image export temporarily disabled
  const handleExportImage = async () => {
    toast({
      title: "Coming soon",
      description: "Save as Image will return in a future update",
    });
  };

  if (isLoadingRecipe || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (cookingMode) {
    return <CookingMode recipe={recipe} onExit={() => setCookingMode(false)} />;
  }

  const adjustedServings = recipe.servings * servingMultiplier;

  return (
    <div className="min-h-screen pb-8">
      {/* Top banner ad (excluded in cooking mode branch) */}
      <div className="max-w-5xl mx-auto px-5 pt-4">
        <AdSlot slot="0000000000" className="my-2" test />
      </div>
      {/* Only show image for non-AI recipes */}
      {!recipe.isAiGenerated && (
        <div className="relative min-h-[400px] overflow-hidden">
          <img
            key={recipe.imageUrl || recipe.image}
            src={getRecipeImage(recipe, import.meta.env.DEV)}
            alt={recipe.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            decoding="async"
            width="1200"
            height="600"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80";
            }}
          />
          <Button
            onClick={() => navigate(-1)}
            variant="icon"
            size="icon"
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              onClick={() => setMenuOpen(true)}
              variant="icon"
              size="icon"
              data-recipe-menu-button
            >
              <span className="text-xl">⋮</span>
            </Button>
          </div>
        </div>
      )}

      {/* For AI recipes, show simple header with back button */}
      {recipe.isAiGenerated && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-8">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              ✨ AI Generated
            </Badge>
            <Button
              onClick={() => setMenuOpen(true)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              data-recipe-menu-button
            >
              <span className="text-xl">⋮</span>
            </Button>
          </div>
        </div>
      )}

      <div className={`relative bg-white px-5 pt-4 pb-6 shadow-lg ${
        !recipe.isAiGenerated ? '-mt-24 rounded-t-3xl' : 'mt-0'
      }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-black">{recipe.name}</h1>
                
                {/* Average Rating Display */}
                {totalRatings > 0 ? (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-semibold">{averageRating}</span>
                    <span className="text-primary">★</span>
                    <span className="text-sm text-muted-foreground">({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mb-2">No ratings yet</div>
                )}
                
                <p className="body-text text-muted-foreground">{recipe.description}</p>
                
                {/* Personal Notes Display */}
                {currentSavedRecipe?.notes && (
                  <Card className="mt-4 bg-purple-50/50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">📝</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-purple-900 mb-1">Your Notes</p>
                          <p className="text-sm text-purple-800 whitespace-pre-wrap">{currentSavedRecipe.notes}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-8 text-xs text-purple-700 hover:text-purple-900"
                            onClick={() => setNotesDialogOpen(true)}
                          >
                            Edit Notes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {recipe.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-[#FF6B35] text-black">
                {recipe.cuisine}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="info-card">
                <p className="text-2xl font-bold text-primary">{recipe.prepTime}</p>
                <p className="small-text">Prep Time</p>
              </div>
              <div className="info-card">
                <p className="text-2xl font-bold text-primary">{recipe.cookTime}</p>
                <p className="small-text">Cook Time</p>
              </div>
              <div className="info-card">
                <p className="text-2xl font-bold text-primary">{adjustedServings}</p>
                <p className="small-text">Servings</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold">Adjust Servings</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-4 text-black">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, index) => {
                  // Always show complete ingredient with measurements
                  const ingredientText = `${ing.amount} ${ing.unit} ${ing.item}`.trim();
                  
                  // Smart ingredient scaling
                  const adjustIngredientAmount = (text: string) => {
                    return text.replace(/(\d+\.?\d*)/g, (match) => {
                      const num = parseFloat(match);
                      const scaled = (num * servingMultiplier).toFixed(1).replace('.0', '');
                      return scaled;
                    });
                  };
                  
                  return (
                    <li key={index} className="flex items-start text-black">
                      <span className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0">
                        <Checkbox className="w-5 h-5 rounded border-2 border-input checked:bg-primary checked:border-primary transition-all" />
                      </span>
                      <span>{adjustIngredientAmount(ingredientText)}</span>
                    </li>
                  );
                })}
              </ul>
              <Button
                onClick={addToShoppingList}
                className="w-full h-12 mt-4 bg-primary hover:bg-primary/90 hidden"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Shopping List
              </Button>
            </div>

            <button
              onClick={() => setCookingMode(true)}
              className="w-full py-4 bg-primary text-black font-bold text-lg rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-6 hidden"
            >
              <ChefHat className="w-5 h-5" />
              Start Cooking Mode
            </button>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-black">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4 font-bold">
                      {index + 1}
                    </span>
                    <p className="flex-1 pt-1 text-black">{instruction.replace(/\[|\]/g, '')}</p>
                  </li>
                ))}
              </ol>
            </div>
      </div>

      {/* 3-Dot Menu Modal */}
      {menuOpen && (
        <>
          {/* Overlay - z-[60] is above bottom nav (z-50) */}
          <div 
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel - z-[70] is above overlay */}
          <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-[70] p-6 max-h-[80vh] overflow-y-auto pb-24 border-t border-border">
            {/* Handle Bar */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
            
            {/* PRIMARY ACTIONS GROUP */}
            
            {/* Start Cooking Mode */}
            <button
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Sign up to use cooking mode",
                    description: "Create an account to access step-by-step cooking mode",
                    action: (
                      <Button
                        size="sm"
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Sign Up
                      </Button>
                    ),
                  });
                  setMenuOpen(false);
                  return;
                }
                setCookingMode(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
              data-menu-cooking-mode
            >
              <div className="w-10 h-10 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center text-xl">
                🍳
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">Start Cooking Mode</div>
                <div className="text-sm text-muted-foreground">Step-by-step with voice control</div>
              </div>
            </button>
            
            {/* Add to Saved */}
            <button
              onClick={() => {
                toggleFavorite();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
              data-menu-favorites
            >
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center text-xl">
                {recipe && isSaved(recipe.id) ? '❤️' : '🤍'}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">{recipe && isSaved(recipe.id) ? 'Remove from' : 'Save to'} Favorites</div>
                <div className="text-sm text-muted-foreground">Save for later</div>
              </div>
            </button>

            {/* Add to Meal Plan */}
            <button
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Sign in to use meal planning",
                    description: "Create an account to plan your meals",
                    action: (
                      <Button
                        size="sm"
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Sign In
                      </Button>
                    ),
                  });
                  setMenuOpen(false);
                  return;
                }
                setMealPlanDialogOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
              data-menu-meal-plan
            >
              <div className="w-10 h-10 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center text-xl">
                📅
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">Add to Meal Plan</div>
                <div className="text-sm text-muted-foreground">
                  {user ? 'Schedule this meal' : 'Sign in to plan meals'}
                </div>
              </div>
            </button>
            
            {/* Add to Shopping List */}
            <button
              onClick={() => {
                addToShoppingList();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
              data-menu-shopping
            >
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center text-xl">
                🛒
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">Add to Shopping List</div>
                <div className="text-sm text-muted-foreground">Add all ingredients</div>
              </div>
            </button>


            {/* Visual Divider */}
            <div className="my-4">
              <div className="h-px bg-border/50" />
            </div>

            {/* SECONDARY ACTIONS GROUP */}

            {/* Ask Chef Quinn - Premium */}
            <button
              onClick={() => {
                // Guest users: show sign up prompt
                if (!user) {
                  toast({
                    title: "Sign up to chat with Chef Quinn",
                    description: "Create an account to ask Chef Quinn about recipes",
                    action: (
                      <Button
                        size="sm"
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Sign Up
                      </Button>
                    ),
                  });
                  setMenuOpen(false);
                  return;
                }

                // Authenticated users: check premium status
                // Rewarded ad gate for chat once per session
                if (needAdForChatThisSession()) {
                  setShowAd('chat');
                  setMenuOpen(false);
                  return;
                }

                setAiChatOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
            >
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-full flex items-center justify-center text-xl">
                👨‍🍳
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  Ask Chef Quinn
                  {isPremium && <span className="text-xs">👑</span>}
                </div>
                <div className="text-sm text-muted-foreground">Chat with your AI sous chef</div>
              </div>
              {!isPremium && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  PREMIUM
                </div>
              )}
            </button>
            
            {/* Nutritional Facts - Premium */}
            <button
              onClick={() => {
                // Guest users: show sign up prompt
                if (!user) {
                  toast({
                    title: "Sign up to unlock nutritional information",
                    description: "Create an account to access detailed nutrition facts",
                    action: (
                      <Button
                        size="sm"
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Sign Up
                      </Button>
                    ),
                  });
                  setMenuOpen(false);
                  return;
                }

                // Authenticated users: check premium status
                // Rewarded ad gate per recipe per day
                if (recipe && needAdForNutrition(recipe.id)) {
                  setShowAd('nutrition');
                  setMenuOpen(false);
                  return;
                }

                if (recipe?.nutrition) {
                  setNutritionModalOpen(true);
                  setMenuOpen(false);
                } else {
                  toast({
                    title: "Nutrition data unavailable",
                    description: "This recipe doesn't have nutrition information yet",
                  });
                  setMenuOpen(false);
                }
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
            >
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center text-xl">
                📊
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  Nutritional Facts
                  {isPremium && <span className="text-xs">👑</span>}
                </div>
                <div className="text-sm text-muted-foreground">Calories, macros, vitamins</div>
              </div>
              {!isPremium && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  PREMIUM
                </div>
              )}
            </button>
            
            {/* Add Notes */}
            <button
              onClick={() => {
                setNotesDialogOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
            >
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-full flex items-center justify-center text-xl">
                📝
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">
                  {currentSavedRecipe?.notes ? 'Edit Notes' : 'Add Notes'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentSavedRecipe?.notes ? 'Update your notes' : 'Personal recipe notes'}
                </div>
              </div>
              {currentSavedRecipe?.notes && (
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              )}
            </button>
            
            {/* Rate Recipe */}
            <button
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Sign in to rate recipes",
                    description: "Create an account to rate and review recipes",
                    action: (
                      <Button
                        size="sm"
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Sign In
                      </Button>
                    ),
                  });
                  setMenuOpen(false);
                  return;
                }
                setRatingModalOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent border-b border-border"
            >
              <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-950/30 rounded-full flex items-center justify-center text-xl">
                ⭐
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">Rate Recipe</div>
                <div className="text-sm text-muted-foreground">
                  {user ? 'Share your rating' : 'Sign in to rate'}
                </div>
              </div>
            </button>
            
            {/* Export as PDF */}
            <button
              onClick={() => {
                handleExportPDF();
                setMenuOpen(false);
              }}
              disabled={isGeneratingPDF}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border-b border-border"
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-xl">
                📄
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">
                  {isGeneratingPDF ? 'Generating...' : 'Export as PDF'}
                </div>
                <div className="text-sm text-muted-foreground">Download recipe as PDF</div>
              </div>
            </button>

            {/* Save as Image (temporarily removed) */}
          </div>
        </>
      )}

      <RecipeNotesDialog
        open={notesDialogOpen}
        onOpenChange={setNotesDialogOpen}
        recipeName={recipe.name}
        currentNotes={currentSavedRecipe?.notes || null}
        onSave={handleSaveNotes}
        isSaved={isSaved(recipe.id)}
      />

      <PremiumPaywallModal
        open={premiumPaywallOpen}
        onClose={() => setPremiumPaywallOpen(false)}
      />

      {recipe?.nutrition && (
        <NutritionFactsModal
          open={nutritionModalOpen}
          onClose={() => setNutritionModalOpen(false)}
          nutrition={recipe.nutrition}
          recipeName={recipe.name}
        />
      )}

      <RatingModal
        open={ratingModalOpen}
        onOpenChange={setRatingModalOpen}
        recipeName={recipe.name}
        recipeId={recipe.id}
        userId={user?.id}
        onRatingSubmitted={refetchRatings}
      />

      <MealPlanDialog
        open={mealPlanDialogOpen}
        onOpenChange={setMealPlanDialogOpen}
        recipeName={recipe.name}
        onSave={async (date, mealType) => {
          await addMealPlan(recipe.id, date, mealType);
        }}
      />

      <RecipeAIChatDialog
        recipe={recipe}
        open={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />

      <RewardedAdModal
        open={showAd !== null}
        onClose={() => setShowAd(null)}
        onReward={() => {
          if (showAd === 'chat') {
            markChatAdWatched();
            setAiChatOpen(true);
          }
          if (showAd === 'nutrition' && recipe) {
            markNutritionWatched(recipe.id);
            setNutritionModalOpen(true);
          }
          if (showAd === 'interstitial') {
            markInterstitialShown();
          }
        }}
        title={
          showAd === 'chat'
            ? 'Watch an ad to chat with Chef Quinn'
            : showAd === 'nutrition'
              ? 'Watch an ad to view nutrition facts'
              : 'Sponsored content'
        }
        description={
          showAd === 'chat'
            ? 'Unlock AI chat for this session by watching one ad.'
            : showAd === 'nutrition'
              ? 'Unlock nutrition info for this recipe by watching one ad.'
              : ''
        }
      />

      {/* Shopping Flow Components - Removed, will add back with Kroger/Instacart API */}
      {/* {showShopping && !selectedStore && (
        <StoreSelection
          onSelectStore={(store) => setSelectedStore(store)}
          onClose={() => setShowShopping(false)}
        />
      )}

      {showShopping && selectedStore && (
        <ShoppingGuide
          items={recipe.ingredients.map((ing, idx) => ({
            id: `${recipe.id}-${idx}`,
            name: ing.item,
            amount: ing.amount,
            unit: ing.unit,
            completed: false,
            recipeId: recipe.id
          }))}
          store={selectedStore}
          onComplete={() => {
            setShowShopping(false);
            setSelectedStore(null);
            toast({
              title: "Shopping Complete! 🎉",
              description: "Hope you found everything you need!",
            });
          }}
          onBack={() => setSelectedStore(null)}
        />
      )} */}
    </div>
  );
};

export default RecipeDetail;
