import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import CookingMode from "@/components/CookingMode";
import { ingredientsToShoppingItems, deduplicateShoppingList } from "@/utils/shoppingListUtils";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);

  useEffect(() => {
    if (id) {
      const foundRecipe = recipeStorage.getRecipeById(id);
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
      <div className="relative h-64 overflow-hidden">
        <img 
          src={recipe.image || recipe.imageUrl || getRecipeImage(recipe)} 
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const title = recipe.name?.toLowerCase() || '';
            if (title.includes('cheesecake') || title.includes('cake')) {
              target.src = 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800';
            } else {
              target.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800';
            }
          }}
        />
        <Button
          onClick={() => navigate('/generate')}
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 glass-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            onClick={toggleFavorite}
            variant="secondary"
            size="icon"
            className="glass-card"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
                <p className="text-muted-foreground">{recipe.description}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {recipe.difficulty}
              </Badge>
              <Badge variant="outline">{recipe.cuisine}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{recipe.prepTime}</p>
                <p className="text-sm text-muted-foreground">Prep Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{recipe.cookTime}</p>
                <p className="text-sm text-muted-foreground">Cook Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{adjustedServings}</p>
                <p className="text-sm text-muted-foreground">Servings</p>
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
              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
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
                      <span className="text-primary mr-2">•</span>
                      <span>{adjustIngredientAmount(ingredientText)}</span>
                    </li>
                  );
                })}
              </ul>
              <Button
                onClick={addToShoppingList}
                className="w-full mt-4 bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Shopping List
              </Button>
            </div>

            <button
              onClick={() => setCookingMode(true)}
              className="w-full py-4 bg-primary text-black font-bold text-lg rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <ChefHat className="w-5 h-5" />
              Start Cooking Mode
            </button>

            <div>
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
