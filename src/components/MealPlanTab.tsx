import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, ChefHat, Trash2, Calendar, RefreshCw } from "lucide-react";
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
import { useAllRecipes } from "@/hooks/useAllRecipes";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";
import { toast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isPast, addDays, startOfDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { filterShoppingListByPantry } from "@/utils/pantryUtils";
import { usePantryItems } from "@/hooks/usePantryItems";
import { LoadingScreen } from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";

export const MealPlanTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allRecipes } = useAllRecipes();
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

  // Map of DB recipe UUID -> basic recipe info (from Supabase)
  const [dbRecipesById, setDbRecipesById] = useState<Record<string, { id: string; recipe_id: string; name: string; image_url: string | null; cook_time: string | null }>>({});

  useEffect(() => {
    const fetchDbRecipes = async () => {
      if (!mealPlans || mealPlans.length === 0) return;
      const ids = Array.from(new Set(mealPlans.map(m => m.recipe_id).filter(Boolean)));
      // Skip if we already have them all
      const missing = ids.filter(id => !dbRecipesById[id as string]);
      if (missing.length === 0) return;

      const { data, error } = await supabase
        .from('recipes')
        .select('id, recipe_id, name, image_url, cook_time')
        .in('id', missing as string[]);

      if (!error && data) {
        const next: Record<string, any> = { ...dbRecipesById };
        data.forEach((r) => { next[r.id] = r; });
        setDbRecipesById(next);
      }
    };
    fetchDbRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealPlans]);

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

  // Export upcoming meals to ICS
  const exportCalendarICS = () => {
    if (upcomingMeals.length === 0) {
      toast({ title: 'No upcoming meals', description: 'Add meals to your plan first.' });
      return;
    }
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QuickDish//MealPlan//EN'
    ];
    upcomingMeals.forEach(meal => {
      const db = dbRecipesById[meal.recipe_id];
      const recipe = allAvailableRecipes.find(r => r.id === (db?.recipe_id || meal.recipe_id));
      const name = (recipe?.name || db?.name || 'Meal').replace(/\r?\n/g, ' ');
      const dt = new Date(meal.scheduled_date + 'T00:00:00');
      const y = dt.getUTCFullYear();
      const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
      const d = String(dt.getUTCDate()).padStart(2, '0');
      const dtstamp = `${y}${m}${d}`;
      lines.push(
        'BEGIN:VEVENT',
        `UID:${meal.id}@quickdish`,
        `DTSTAMP:${dtstamp}T000000Z`,
        `DTSTART;VALUE=DATE:${dtstamp}`,
        `SUMMARY:${name} (${meal.meal_type})`,
        'END:VEVENT'
      );
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quickdish-mealplan.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print-friendly meal plan
  const printMealPlan = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const rows = sortedMealPlans.map(meal => {
      const db = dbRecipesById[meal.recipe_id];
      const recipe = allAvailableRecipes.find(r => r.id === (db?.recipe_id || meal.recipe_id));
      const name = recipe?.name || db?.name || '';
      const date = new Date(meal.scheduled_date + 'T00:00:00');
      const dateText = date.toLocaleDateString();
      const type = meal.meal_type;
      return `<tr><td>${dateText}</td><td>${type}</td><td>${name}</td></tr>`;
    }).join('');
    w.document.write(`
      <html><head><title>QuickDish Meal Plan</title>
      <style>body{font-family:system-ui,Segoe UI,Arial} table{border-collapse:collapse;width:100%} td,th{border:1px solid #ddd;padding:8px} th{background:#f3f4f6;text-align:left}</style>
      </head><body>
      <h2>QuickDish Meal Plan</h2>
      <table>
        <thead><tr><th>Date</th><th>Meal</th><th>Recipe</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <script>window.onload=() => window.print()</script>
      </body></html>
    `);
    w.document.close();
  };

  // Open a prefilled Google Calendar event for a single meal
  const addMealToGoogleCalendar = (meal: { id: string; recipe_id: string; scheduled_date: string; meal_type: string }) => {
    const db = dbRecipesById[meal.recipe_id];
    const recipe = allAvailableRecipes.find(r => r.id === (db?.recipe_id || meal.recipe_id));
    const name = recipe?.name || db?.name || 'Meal';
    const origin = window.location.origin;
    const navId = recipe?.id || db?.recipe_id || '';
    const link = `${origin}/recipe/${navId}`;

    const start = new Date(meal.scheduled_date + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + 1); // all-day event end date is exclusive

    const fmt = (d: Date) => {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const da = String(d.getUTCDate()).padStart(2, '0');
      return `${y}${m}${da}`;
    };

    const text = encodeURIComponent(`${name} (${meal.meal_type})`);
    const dates = `${fmt(start)}/${fmt(end)}`; // all-day
    const details = encodeURIComponent(`Planned via QuickDish\n${link}`);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
    window.open(url, '_blank');
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
              <div className="flex gap-2 flex-wrap">
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
                  onClick={() => printMealPlan()}
                >
                  Print Plan
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={refreshMealPlans}
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
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
              </div>
            </CardContent>
          </Card>
        )}

      <div className="space-y-3">
        {sortedMealPlans.map(meal => {
          // Try local/static sources first, otherwise fall back to DB recipe by UUID
          const db = dbRecipesById[meal.recipe_id];
          const recipe = allAvailableRecipes.find(r => r.id === (db?.recipe_id || meal.recipe_id));
          const displayName = recipe?.name || db?.name;
          const displayImage = recipe?.image || db?.image_url || undefined;
          const cookTime = recipe?.cookTime || db?.cook_time || '';
          const navigateId = recipe?.id || db?.recipe_id; // use external id for routing
          if (!displayName || !navigateId) return null;

          // Use startOfDay for proper local timezone comparison
          const mealDate = startOfDay(new Date(meal.scheduled_date + 'T00:00:00'));
          const today = startOfDay(new Date());
          const isPastMeal = mealDate < today;

          return (
            <Card 
              key={meal.id} 
              className={`relative border-0 cursor-pointer transition-opacity ${isPastMeal ? 'opacity-60' : ''}`}
              onClick={() => navigate(`/recipe/${navigateId}`)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={displayImage as string | undefined} 
                    alt={displayName}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/96x96/10b981/ffffff?text=Meal';
                    }}
                  />
                  <div className="flex-1 min-w-0 pr-10">
                    <p className="text-sm text-muted-foreground mb-1">{formatDate(meal.scheduled_date)}</p>
                    <h3 className="font-semibold mb-2 line-clamp-1">{displayName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getMealTypeColor(meal.meal_type)}>
                        <ChefHat className="w-3 h-3 mr-1" />
                        {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {cookTime}
                      </span>
                    </div>
                    {isPastMeal && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsCooked(navigateId, meal.id);
                        }}
                      >
                        Mark as Cooked
                      </Button>
                    )}
                    {!isPastMeal && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          addMealToGoogleCalendar(meal);
                        }}
                      >
                        Add to Google Calendar
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
