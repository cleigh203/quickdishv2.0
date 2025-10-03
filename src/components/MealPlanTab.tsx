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
import { toast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isPast, addDays, startOfDay } from "date-fns";

export const MealPlanTab = () => {
  const navigate = useNavigate();
  const { mealPlans, deleteMealPlan, clearAllMealPlans } = useMealPlan();
  const { incrementTimesCooked } = useSavedRecipes();
  const { addItems } = useShoppingList();
  const [mealToDelete, setMealToDelete] = useState<{ id: string; name: string; date: string; type: string } | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [keepPastMeals, setKeepPastMeals] = useState(true);

  const sortedMealPlans = useMemo(() => {
    return [...mealPlans].sort((a, b) => 
      new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    );
  }, [mealPlans]);

  const upcomingMeals = useMemo(() => {
    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    return sortedMealPlans.filter(meal => {
      const mealDate = startOfDay(new Date(meal.scheduled_date));
      return mealDate >= today && mealDate < nextWeek;
    });
  }, [sortedMealPlans]);

  const handleAddToShoppingList = async () => {
    const ingredients: { item: string; amount: string; recipes: string[] }[] = [];

    upcomingMeals.forEach(meal => {
      const recipe = allRecipes.find(r => r.id === meal.recipe_id);
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
              amount: ingredient.amount,
              recipes: [recipe.name],
            });
          }
        });
      }
    });

    if (ingredients.length > 0) {
      await addItems(ingredients);
      toast({
        title: "Success",
        description: `${ingredients.length} ingredients added to shopping list`,
      });
    }
  };

  const handleMarkAsCooked = async (recipeId: string, mealPlanId: string) => {
    await incrementTimesCooked(recipeId);
    await deleteMealPlan(mealPlanId);
    toast({
      title: "Success",
      description: "Marked as cooked!",
    });
  };

  const handleDeleteMeal = () => {
    if (mealToDelete) {
      deleteMealPlan(mealToDelete.id);
      setMealToDelete(null);
    }
  };

  const handleClearAll = async () => {
    await clearAllMealPlans(keepPastMeals);
    setShowClearDialog(false);
    setKeepPastMeals(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">This Week's Meals</h3>
                  <p className="text-sm text-muted-foreground">{upcomingMeals.length} meals planned</p>
                </div>
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setShowClearDialog(true)}
                >
                  Clear Meal Plan
                </Button>
              </div>
              <Button 
                onClick={handleAddToShoppingList} 
                className="w-full bg-primary hover:bg-primary/90"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Shopping List
              </Button>
            </CardContent>
          </Card>
        )}

      <div className="space-y-3">
        {sortedMealPlans.map(meal => {
          const recipe = allRecipes.find(r => r.id === meal.recipe_id);
          if (!recipe) return null;

          const isPastMeal = isPast(new Date(meal.scheduled_date)) && !isToday(new Date(meal.scheduled_date));

          return (
            <Card 
              key={meal.id} 
              className={`border-0 cursor-pointer transition-opacity ${isPastMeal ? 'opacity-60' : ''}`}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
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
                    {isPastMeal ? (
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
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-4 right-4 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </div>

      {/* Individual Meal Delete Confirmation */}
      <AlertDialog open={!!mealToDelete} onOpenChange={() => setMealToDelete(null)}>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
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
            <AlertDialogCancel onClick={() => setKeepPastMeals(true)}>Cancel</AlertDialogCancel>
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
