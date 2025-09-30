import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (id) {
      const foundRecipe = recipeStorage.getRecipeById(id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setIsFavorite(recipeStorage.isFavorite(id));
        
        // Check if coming from "Cook Now" button
        const params = new URLSearchParams(window.location.search);
        if (params.get('cook') === 'true') {
          setIsCookingMode(true);
          setCurrentStep(0);
          // Clean up URL
          window.history.replaceState({}, '', `/recipe/${id}`);
        }
      } else {
        navigate('/generate');
      }
    }
  }, [id, navigate]);

  // Keep screen awake during cooking
  useEffect(() => {
    if (isCookingMode && 'wakeLock' in navigator) {
      let wakeLock: any = null;
      (navigator as any).wakeLock.request('screen')
        .then((wl: any) => wakeLock = wl)
        .catch((err: any) => console.log('Wake Lock error:', err));
      
      return () => wakeLock?.release();
    }
  }, [isCookingMode]);

  // Keyboard shortcuts for cooking mode
  useEffect(() => {
    if (!isCookingMode || !recipe) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentStep(prev => Math.min(recipe.instructions.length - 1, prev + 1));
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentStep(prev => Math.max(0, prev - 1));
      }
      if (e.key === 'Escape') {
        setIsCookingMode(false);
        setCurrentStep(0);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCookingMode, currentStep, recipe]);

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
    
    recipe.ingredients.forEach(ing => {
      const ingredientText = ing.item || `${ing.amount} ${ing.unit} ${ing.item}`.trim();
      const cleaned = ingredientText.toLowerCase().trim();
      
      // Extract core item name (remove quantities and descriptors)
      const itemMatch = cleaned.match(/(?:\d+[\s\w\/]*\s+)?(?:of\s+)?(.+)/);
      let itemName = itemMatch ? itemMatch[1] : cleaned;
      
      // Normalize common variations
      itemName = itemName
        .replace(/tomatoes?/i, 'tomato')
        .replace(/onions?/i, 'onion')
        .replace(/peppers?/i, 'pepper')
        .replace(/cloves?/i, 'clove')
        .replace(/cups?|tbsp|tsp|oz|lb|g|kg|ml|l/gi, '')
        .trim();
      
      // Check if base item already exists
      const existingItem = currentList.find((item: any) => {
        const existingBase = item.item.toLowerCase()
          .replace(/tomatoes?/i, 'tomato')
          .replace(/onions?/i, 'onion')
          .replace(/peppers?/i, 'pepper');
        return existingBase === itemName || item.item.toLowerCase() === itemName;
      });
      
      if (existingItem) {
        // Update existing item with combined amounts
        if (!existingItem.recipes.includes(recipe.name)) {
          existingItem.recipes.push(recipe.name);
          existingItem.combinedAmounts = existingItem.combinedAmounts || [existingItem.amount];
          existingItem.combinedAmounts.push(ingredientText);
        }
      } else {
        // Add new item
        currentList.push({
          id: Date.now() + Math.random(),
          item: itemName.charAt(0).toUpperCase() + itemName.slice(1),
          amount: ingredientText,
          combinedAmounts: [ingredientText],
          checked: false,
          recipes: [recipe.name]
        });
      }
    });
    
    localStorage.setItem('shoppingList', JSON.stringify(currentList));
    toast({
      title: "Added to shopping list! 🛒",
      description: `${recipe.name} ingredients added`,
    });
  };

  if (!recipe) {
    return null;
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
          onClick={() => navigate(-1)}
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
                  // Handle full text ingredients (e.g., "2 cups rice")
                  const ingredientText = ing.item || `${ing.amount} ${ing.unit} ${ing.item}`.trim();
                  
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

            <Button
              onClick={() => {
                setIsCookingMode(true);
                setCurrentStep(0);
              }}
              className="w-full py-6 bg-gradient-to-r from-primary to-primary/80 text-white text-lg font-bold rounded-xl mb-6 shadow-lg hover:from-primary/90 hover:to-primary/70 transition-all"
            >
              🍳 Start Cooking Hands-Free
            </Button>

            <div>
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4 font-bold">
                      {index + 1}
                    </span>
                    <p className="flex-1 pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hands-Free Cooking Mode Overlay */}
      {isCookingMode && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Progress bar */}
          <div className="p-4 bg-gray-900">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{width: `${((currentStep + 1) / recipe.instructions.length) * 100}%`}}
              />
            </div>
            <p className="text-gray-400 text-center mt-2 text-sm">
              Step {currentStep + 1} of {recipe.instructions.length}
            </p>
          </div>
          
          {/* Current step display */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <h2 className="text-primary text-4xl mb-8 font-bold">Step {currentStep + 1}</h2>
              <p className="text-white text-3xl md:text-4xl leading-relaxed font-light">
                {recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '')}
              </p>
            </div>
          </div>
          
          {/* Navigation buttons - HUGE for elbow tapping */}
          <div className="p-4 bg-gray-900">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="py-8 bg-gray-700 text-white text-2xl rounded-xl disabled:opacity-30 active:bg-gray-600 transition-colors"
                disabled={currentStep === 0}
              >
                ← BACK
              </button>
              <button 
                onClick={() => {
                  if (currentStep < recipe.instructions.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    setIsCookingMode(false);
                    setCurrentStep(0);
                    toast({ title: "Cooking complete! Enjoy! 🎉" });
                  }
                }}
                className="py-8 bg-primary text-white text-2xl rounded-xl font-bold active:bg-primary/80 transition-colors"
              >
                {currentStep === recipe.instructions.length - 1 ? 'DONE!' : 'NEXT →'}
              </button>
            </div>
            
            {/* Small exit button */}
            <button 
              onClick={() => {
                setIsCookingMode(false);
                setCurrentStep(0);
              }}
              className="w-full py-3 text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              Exit Cooking Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
