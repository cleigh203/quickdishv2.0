import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ingredientsToShoppingItems, deduplicateShoppingList } from "@/utils/shoppingListUtils";
import { allRecipes } from "@/data/recipes";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (id) {
      // Load from source recipes first (hardcoded recipes with correct images)
      let foundRecipe = allRecipes.find(r => r.id === id);
      
      // Fall back to localStorage for user-generated recipes
      if (!foundRecipe) {
        foundRecipe = recipeStorage.getRecipeById(id);
      }
      
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setIsFavorite(recipeStorage.isFavorite(id));
        
        // Check if coming from "Cook Now" button
        const params = new URLSearchParams(window.location.search);
        if (params.get('cook') === 'true') {
          setCookingMode(true);
          // Clean up URL
          window.history.replaceState({}, '', `/recipe/${id}`);
        }
      } else {
        navigate('/generate');
      }
    }
  }, [id, navigate]);

  const toggleFavorite = () => {
    if (!recipe) return;
    
    if (isFavorite) {
      recipeStorage.removeFavorite(recipe.id);
      setIsFavorite(false);
      toast({ 
        title: "Removed from favorites",
        duration: 2000
      });
    } else {
      recipeStorage.addFavorite(recipe.id);
      setIsFavorite(true);
      toast({ 
        title: "Added to favorites",
        duration: 2000
      });
    }
  };

  const addToShoppingList = () => {
    if (!recipe) return;
    
    // Get current shopping list from localStorage
    const currentList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    
    // Convert recipe ingredients to shopping items
    const newItems = ingredientsToShoppingItems(recipe.ingredients, recipe.name);
    
    // Combine with existing list and deduplicate
    const combinedList = [...currentList, ...newItems];
    const deduplicatedList = deduplicateShoppingList(combinedList);
    
    localStorage.setItem('shoppingList', JSON.stringify(deduplicatedList));
    toast({
      title: "Added to shopping list! 🛒",
      description: `${recipe.name} ingredients added`,
    });
  };

  if (!recipe) {
    return null;
  }

  if (cookingMode) {
    return <CookingMode recipe={recipe} onExit={() => setCookingMode(false)} />;
  }

  const adjustedServings = recipe.servings * servingMultiplier;

  return (
    <div className="min-h-screen pb-8">
      <div className="relative min-h-[400px] overflow-hidden">
        <img 
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error('Image failed to load for:', recipe.name, 'Original src:', target.src);
            console.log('Recipe image path:', recipe.image);
          }}
        />
        <Button
          onClick={() => navigate('/generate')}
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
          >
            <span className="text-xl">⋮</span>
          </Button>
        </div>
      </div>

      <div className="relative -mt-20 bg-white rounded-t-3xl px-5 pt-4 pb-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
                <p className="body-text text-muted-foreground">{recipe.description}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {recipe.difficulty}
              </Badge>
              <Badge variant="outline">{recipe.cuisine}</Badge>
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
              <h2 className="text-3xl font-bold mb-4">Ingredients</h2>
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
                    <li key={index} className="flex items-start text-foreground">
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
              <h2 className="text-3xl font-bold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4 font-bold">
                      {index + 1}
                    </span>
                    <p className="flex-1 pt-1">{instruction.replace(/\[|\]/g, '')}</p>
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
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] p-6 max-h-[80vh] overflow-y-auto pb-24">
            {/* Handle Bar */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            
            {/* Add to Shopping List */}
            <button
              onClick={() => {
                addToShoppingList();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-xl">
                🛒
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Add to Shopping List</div>
                <div className="text-sm text-gray-500">Add all ingredients</div>
              </div>
            </button>
            
            {/* Add to Saved */}
            <button
              onClick={() => {
                toggleFavorite();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-xl">
                {isFavorite ? '❤️' : '🤍'}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{isFavorite ? 'Remove from' : 'Add to'} Saved</div>
                <div className="text-sm text-gray-500">Save for later</div>
              </div>
            </button>
            
            {/* Start Cooking Mode */}
            <button
              onClick={() => {
                setCookingMode(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-xl">
                👨‍🍳
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Start Cooking Mode</div>
                <div className="text-sm text-gray-500">Step-by-step with voice control</div>
              </div>
            </button>
            
            {/* Nutritional Facts - Premium */}
            <button
              onClick={() => {
                alert('Nutritional Facts is a premium feature. Upgrade to unlock!');
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-xl">
                📊
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Nutritional Facts</div>
                <div className="text-sm text-gray-500">Calories, macros, vitamins</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                PREMIUM
              </div>
            </button>
            
            {/* Save as PDF */}
            <button
              onClick={() => {
                alert('PDF export coming soon!');
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">
                📄
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Save as PDF</div>
                <div className="text-sm text-gray-500">Export recipe</div>
              </div>
            </button>
            
            {/* Add Notes */}
            <button
              onClick={() => {
                alert('Notes feature coming soon!');
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-xl">
                📝
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Add Notes</div>
                <div className="text-sm text-gray-500">Personal recipe notes</div>
              </div>
            </button>
            
            {/* Rate & Review */}
            <button
              onClick={() => {
                alert('Rating feature coming soon!');
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-xl">
                ⭐
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Rate & Review</div>
                <div className="text-sm text-gray-500">Share your experience</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeDetail;
