import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, ChefHat, Trash2, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMealPlan } from "@/hooks/useMealPlan";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useShoppingList } from "@/hooks/useShoppingList";
import { allRecipes } from "@/data/recipes";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";
import { toast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isPast, addDays, startOfDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { filterShoppingListByPantry } from "@/utils/pantryUtils";
import { usePantryItems } from "@/hooks/usePantryItems";

export const MealPlanTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mealPlans, deleteMealPlan, clearAllMealPlans, refreshMealPlans } = useMealPlan();
  const { incrementTimesCooked } = useSavedRecipes();
  const { replaceList } = useShoppingList();
  const { fetchPantryItems, loading: pantryLoading } = usePantryItems();
  const { generatedRecipes } = useGeneratedRecipes();
  const { verifiedRecipes } = useVerifiedRecipes();
  const [mealToDelete, setMealToDelete] = useState<{ id: string; name: string; date: string; type: string } | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [keepPastMeals, setKeepPastMeals] = useState(true);

  // Combine all recipe sources
  const allAvailableRecipes = useMemo(() => {
    return [...allRecipes, ...generatedRecipes, ...verifiedRecipes];
  }, [generatedRecipes, verifiedRecipes]);

  const sortedMealPlans = useMemo(() => {
    return [...mealPlans].sort((a, b) => 
      new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    );
  }, [mealPlans]);

  const upcomingMeals = useMemo(() => {
    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    
    console.log('📅 Calculating upcoming meals:', {
      today: today.toISOString(),
      nextWeek: nextWeek.toISOString(),
      totalMealPlans: sortedMealPlans.length
    });
    
    const filtered = sortedMealPlans.filter(meal => {
      const mealDate = startOfDay(new Date(meal.scheduled_date + 'T00:00:00'));
      const isUpcoming = mealDate >= today && mealDate < nextWeek;
      
      console.log(`  Meal: ${meal.recipe_id}`, {
        scheduledDate: meal.scheduled_date,
        mealDate: mealDate.toISOString(),
        isUpcoming,
        reason: !isUpcoming ? (mealDate < today ? 'past' : 'beyond 7 days') : 'included'
      });
      
      return isUpcoming;
    });
    
    console.log('✅ Upcoming meals count:', filtered.length);
    return filtered;
  }, [sortedMealPlans]);

  const handleAddToShoppingList = async () => {
    const ingredients: { item: string; amount: string; recipes: string[] }[] = [];

    upcomingMeals.forEach(meal => {
      const recipe = allAvailableRecipes.find(r => r.id === meal.recipe_id);
      if (recipe) {
        recipe.ingredients.forEach(ingredient => {
          const existingItem = ingredients.find(i => 
            i.item.toLowerCase() === ingredient.item.toLowerCase()
          );
          if (existingItem) {
            if (!existingItem.recipes.includes(recipe.name)) {
              existingItem.recipes.push(recipe.name);
            }
          } else {
            ingredients.push({
              item: ingredient.item,
              amount: `${ingredient.amount || ''} ${ingredient.unit || ''}`.trim(),
              recipes: [recipe.name],
            });
          }
        });
      }
    });

    // Filter out items already in pantry (with caching)
    let itemsToAdd = ingredients;
    let filteredCount = 0;
    
    if (user) {
      const pantryItems = await fetchPantryItems();
      
      if (pantryItems.length > 0) {
        const shoppingItems = ingredients.map((ing, idx) => ({
          id: idx,
          item: ing.item,
          amount: ing.amount,
          checked: false,
          recipes: ing.recipes,
        }));

        const { filtered } = filterShoppingListByPantry(shoppingItems, pantryItems);
        filteredCount = ingredients.length - filtered.length;
        itemsToAdd = filtered.map(item => ({
          item: item.item,
          amount: item.amount || '',
          recipes: item.recipes || [],
        }));
      }
    }

    if (itemsToAdd.length > 0) {
      // Replace entire shopping list to prevent old items from persisting
      const newShoppingList = itemsToAdd.map((item, idx) => ({
        id: Date.now() + idx,
        item: item.item,
        amount: item.amount || '', // Ensure amount is never undefined
        checked: false,
        recipes: item.recipes,
      }));
      await replaceList(newShoppingList);
      toast({
        title: "Success",
        description: filteredCount > 0 
          ? `${itemsToAdd.length} ingredients added (${filteredCount} already in pantry)`
          : `${itemsToAdd.length} ingredients added to shopping list`,
      });
    } else if (filteredCount > 0) {
      toast({
        title: "All items in pantry",
        description: "All ingredients are already in your pantry!",
      });
    }
  };

  const handleMarkAsCooked = async (recipeId: string, mealPlanId: string) => {
    await incrementTimesCooked(recipeId);
    await deleteMealPlan(mealPlanId);
    await refreshMealPlans(); // Immediately refresh to remove the meal
    toast({
      title: "Success",
      description: "Marked as cooked!",
    });
  };

  const handleDeleteMeal = async () => {
    if (mealToDelete) {
      await deleteMealPlan(mealToDelete.id);
      toast({
        title: "Success",
        description: "Removed from meal plan",
      });
      setMealToDelete(null);
    }
  };

  const handleClearAll = async () => {
    await clearAllMealPlans(keepPastMeals);
    toast({
      title: "Success",
      description: "Meal plan cleared",
    });
    setShowClearDialog(false);
    setKeepPastMeals(true);
  };

  const formatDate = (dateString: string) => {
    // Force local timezone by appending time component
    const date = new Date(dateString + 'T00:00:00');
    if (isToday(date)) return `Today - ${format(date, 'MMM d')}`;
    if (isTomorrow(date)) return `Tomorrow - ${format(date, 'MMM d')}`;
    return format(date, 'EEEE - MMM d');
  };

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-orange-500/20 text-orange-700',
      lunch: 'bg-orange-500/20 text-orange-700',
      dinner: 'bg-orange-500/20 text-orange-700',
      snack: 'bg-orange-500/20 text-orange-700',
    };
    return colors[type as keyof typeof colors] || 'bg-orange-500/20 text-orange-700';
  };

  if (sortedMealPlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No meals planned yet</h3>
        <p className="text-muted-foreground mb-6">Browse recipes and add them to your meal plan</p>
        <Button onClick={() => navigate('/generate')} className="bg-primary hover:bg-primary/90">
          Browse Recipes
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-24">
        {upcomingMeals.length > 0 && (
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold">This Week's Meals</h3>
                <p className="text-sm text-muted-foreground">{upcomingMeals.length} meals planned</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddToShoppingList} 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="sm"
                  disabled={pantryLoading}
                >
                  {pantryLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Checking pantry...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Shopping List
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setShowClearDialog(true)}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      <div className="space-y-3">
        {sortedMealPlans.map(meal => {
          const recipe = allAvailableRecipes.find(r => r.id === meal.recipe_id);
          if (!recipe) return null;

          // Use startOfDay for proper local timezone comparison
          const mealDate = startOfDay(new Date(meal.scheduled_date + 'T00:00:00'));
          const today = startOfDay(new Date());
          const isPastMeal = mealDate < today;

          return (
            <Card 
              key={meal.id} 
              className={`relative border-0 cursor-pointer transition-opacity ${isPastMeal ? 'opacity-60' : ''}`}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-10">
                    <p className="text-sm text-muted-foreground mb-1">{formatDate(meal.scheduled_date)}</p>
                    <h3 className="font-semibold mb-2 line-clamp-1">{recipe.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getMealTypeColor(meal.meal_type)}>
                        <ChefHat className="w-3 h-3 mr-1" />
                        {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.cookTime}
                      </span>
                    </div>
                    {isPastMeal && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsCooked(recipe.id, meal.id);
                        }}
                      >
                        Mark as Cooked
                      </Button>
                    )}
                  </div>
                  {!isPastMeal && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-4 right-4 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMealToDelete({
                          id: meal.id,
                          name: recipe.name,
                          date: formatDate(meal.scheduled_date),
                          type: meal.meal_type
                        });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </div>

      {/* Individual Meal Delete Confirmation */}
      <AlertDialog 
        open={!!mealToDelete} 
        onOpenChange={(open) => {
          if (!open) setMealToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from meal plan?</AlertDialogTitle>
            <AlertDialogDescription>
              {mealToDelete && (
                <>Remove <strong>{mealToDelete.name}</strong> from {mealToDelete.date} ({mealToDelete.type})?</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMealToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMeal}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Meals Confirmation */}
      <AlertDialog 
        open={showClearDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setShowClearDialog(false);
            setKeepPastMeals(true);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear your entire meal plan?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>This will remove all planned meals. This can't be undone.</p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keep-past" 
                  checked={keepPastMeals}
                  onCheckedChange={(checked) => setKeepPastMeals(checked as boolean)}
                />
                <Label htmlFor="keep-past" className="text-sm font-normal cursor-pointer">
                  Keep past meals (only clear future meals)
                </Label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowClearDialog(false);
              setKeepPastMeals(true);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
