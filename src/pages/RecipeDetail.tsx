import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus, ChefHat } from "lucide-react";
import { halloweenRecipes } from "@/data/halloweenRecipes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import CookingMode from "@/components/CookingMode";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true);
        
        if (!id) {
          // No ID provided, check for currentRecipe
          const currentRecipe = localStorage.getItem('currentRecipe');
          if (currentRecipe) {
            const parsed = JSON.parse(currentRecipe);
            setRecipe(parsed);
            setIsFavorite(recipeStorage.isFavorite(parsed.id));
            return;
          }
          navigate('/discover');
          return;
        }

        // Check multiple sources for the recipe
        let foundRecipe = recipeStorage.getRecipeById(id);
        
        // Check Halloween recipes
        if (!foundRecipe) {
          foundRecipe = halloweenRecipes.find(r => r.id === id);
        }
        
        // Check favorites
        if (!foundRecipe) {
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          foundRecipe = favorites.find((r: Recipe) => r.id === id);
        }
        
        // Check generated recipes
        if (!foundRecipe) {
          const generated = JSON.parse(localStorage.getItem('generatedRecipes') || '[]');
          foundRecipe = generated.find((r: Recipe) => r.id === id);
        }
        
        // Check currentRecipe as last resort
        if (!foundRecipe) {
          const currentRecipe = localStorage.getItem('currentRecipe');
          if (currentRecipe) {
            const parsed = JSON.parse(currentRecipe);
            if (parsed.id === id) {
              foundRecipe = parsed;
            }
          }
        }
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
          setIsFavorite(recipeStorage.isFavorite(id));
          
          // Check if coming from "Cook Now" button
          const params = new URLSearchParams(window.location.search);
          if (params.get('cook') === 'true') {
            setCookingMode(true);
            window.history.replaceState({}, '', `/recipe/${id}`);
          }
        } else {
          console.error('Recipe not found:', id);
          navigate('/discover');
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        navigate('/discover');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipe();
  }, [id, navigate]);

  const toggleFavorite = () => {
    if (!recipe) return;
    
    if (isFavorite) {
      recipeStorage.removeFavorite(recipe.id);
      setIsFavorite(false);
      toast({ title: "Removed from favorites" });
    } else {
      recipeStorage.addFavorite(recipe.id);
      setIsFavorite(true);
      toast({ title: "Added to favorites" });
    }
  };

  const addToShoppingList = () => {
    if (!recipe) return;
    
    const currentList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    
    // Normalize text for comparison (remove plurals, lowercase, trim)
    const normalizeForMatching = (text: string) => {
      return text.toLowerCase().trim()
        .replace(/tomatoes?/gi, 'tomato')
        .replace(/onions?/gi, 'onion')
        .replace(/peppers?/gi, 'pepper')
        .replace(/potatoes?/gi, 'potato')
        .replace(/cloves?/gi, 'clove')
        .replace(/\s+/g, ' ');
    };
    
    recipe.ingredients.forEach(ing => {
      const ingredientText = `${ing.amount} ${ing.unit} ${ing.item}`.trim();
      const normalizedIngredient = normalizeForMatching(ing.item);
      
      // Find existing item by normalized name
      const existingItem = currentList.find((item: any) => 
        normalizeForMatching(item.item) === normalizedIngredient
      );
      
      if (existingItem) {
        // Item exists - update recipes list if not already included
        if (!existingItem.recipes?.includes(recipe.name)) {
          existingItem.recipes = existingItem.recipes || [];
          existingItem.recipes.push(recipe.name);
        }
      } else {
        // Add new item
        currentList.push({
          id: Date.now() + Math.random(),
          item: ing.item.charAt(0).toUpperCase() + ing.item.slice(1),
          amount: ingredientText,
          checked: false,
          recipes: [recipe.name]
        });
      }
    });
    
    localStorage.setItem('shoppingList', JSON.stringify(currentList));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Added to shopping list! 🛒",
      description: `${recipe.name} ingredients added`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

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
                onClick={(e) => {
                  e.currentTarget.disabled = true;
                  addToShoppingList();
                  setTimeout(() => {
                    e.currentTarget.disabled = false;
                  }, 1000);
                }}
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
