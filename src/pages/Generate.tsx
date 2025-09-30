import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";

const OPENAI_API_KEY = 'sk-proj-YOUR_KEY_HERE'; // TODO: Replace with actual key

const Generate = () => {
  const [ingredientInput, setIngredientInput] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipesGeneratedToday, setRecipesGeneratedToday] = useState(() => {
    const count = parseInt(localStorage.getItem('recipesGenerated') || '0');
    return count;
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const findExistingRecipe = (input: string): Recipe | null => {
    const normalized = input.toLowerCase().split(',').map(i => i.trim()).sort().join(',');
    const cached = JSON.parse(localStorage.getItem('generatedRecipes') || '[]');
    return cached.find((r: any) => r.ingredientKey === normalized) || null;
  };

  const parseRecipeText = (text: string): Recipe => {
    const lines = text.split('\n');
    const recipe: any = {
      id: Date.now().toString(),
      name: '',
      prepTime: '0 minutes',
      cookTime: '0 minutes',
      ingredients: [],
      instructions: [],
      description: '',
      difficulty: 'Medium',
      servings: 4,
      cuisine: 'Various',
      imageUrl: ''
    };
    
    let section = '';
    lines.forEach(line => {
      if (line.startsWith('Title:')) {
        recipe.name = line.replace('Title:', '').trim();
      }
      if (line.includes('Prep Time:')) {
        const mins = parseInt(line.match(/\d+/)?.[0] || '0');
        recipe.prepTime = `${mins} minutes`;
      }
      if (line.includes('Cook Time:')) {
        const mins = parseInt(line.match(/\d+/)?.[0] || '0');
        recipe.cookTime = `${mins} minutes`;
      }
      if (line.includes('Ingredients:')) section = 'ingredients';
      else if (line.includes('Instructions:')) section = 'instructions';
      else if (section === 'ingredients' && line.trim().startsWith('-')) {
        const ingredient = line.replace('-', '').trim();
        recipe.ingredients.push({
          amount: '',
          unit: '',
          item: ingredient
        });
      }
      else if (section === 'instructions' && line.trim().match(/^\d+\./)) {
        recipe.instructions.push(line.trim());
      }
    });
    
    return recipe;
  };

  const saveToFavorites = (recipe: Recipe) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    toast({
      title: "Saved to your recipes!",
    });
  };

  const handleGenerateRecipe = async () => {
    if (!ingredientInput.trim()) {
      toast({
        title: "Hey! Add some ingredients first 😊",
        variant: "destructive",
      });
      return;
    }
    
    // Reset daily limit at midnight
    const lastReset = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    if (lastReset !== today) {
      localStorage.setItem('recipesGenerated', '0');
      localStorage.setItem('lastResetDate', today);
      setRecipesGeneratedToday(0);
    }
    
    // Check cache FIRST
    const cached = findExistingRecipe(ingredientInput);
    if (cached) {
      console.log('CACHE HIT:', cached.name);
      setGeneratedRecipe(cached);
      setRecipes([cached]);
      recipeStorage.setRecipes([cached]);
      toast({
        title: "Found a perfect match in my cookbook!",
      });
      return;
    }
    
    // Check daily limit
    const currentCount = parseInt(localStorage.getItem('recipesGenerated') || '0');
    if (currentCount >= 5) {
      toast({
        title: "You've cooked up 5 recipes today! Come back tomorrow for more 🍳",
        variant: "destructive",
      });
      return;
    }
    
    // Call OpenAI
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly home cook sharing recipes like texting a friend. Use casual language like "toss in", "a splash of", "until it smells amazing". Add personality like "my kids devour this" or "perfect for lazy Sundays". Never sound robotic or use AI terminology.'
            },
            {
              role: 'user',
              content: `Create a delicious recipe using: ${ingredientInput}.
              
              Format exactly like this:
              Title: [Fun, appetizing name - not generic but not silly]
              Prep Time: [X] minutes
              Cook Time: [Y] minutes
              
              Ingredients:
              - [amount] [ingredient]
              
              Instructions:
              1. [Casual step like "Grab your biggest pan and heat it up"]
              2. [Include measurements inline like "Toss in [2 cups rice]"]`
            }
          ],
          max_tokens: 500,
          temperature: 0.8
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate');
      
      const data = await response.json();
      const recipeText = data.choices[0].message.content;
      
      // Parse recipe
      const recipe = parseRecipeText(recipeText);
      recipe.imageUrl = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(recipe.name)},food`;
      
      // Cache it
      const cachedRecipes = JSON.parse(localStorage.getItem('generatedRecipes') || '[]');
      cachedRecipes.push({
        ...recipe,
        ingredientKey: ingredientInput.toLowerCase().split(',').map(i => i.trim()).sort().join(','),
        timestamp: Date.now()
      });
      if (cachedRecipes.length > 100) cachedRecipes.shift();
      localStorage.setItem('generatedRecipes', JSON.stringify(cachedRecipes));
      
      // Update daily count
      const newCount = currentCount + 1;
      localStorage.setItem('recipesGenerated', String(newCount));
      setRecipesGeneratedToday(newCount);
      
      // Display recipe
      setGeneratedRecipe(recipe);
      setRecipes([recipe]);
      recipeStorage.setRecipes([recipe]);
      console.log('NEW RECIPE GENERATED:', recipe.name);
      toast({
        title: "Your recipe is ready! 👨‍🍳",
      });
      
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Oops! My kitchen brain froze. Try again?",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">What's Cooking?</h1>
          <p className="text-muted-foreground">
            Tell me what's in your fridge, I'll make it delicious
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl mb-8">
          <Input
            type="text"
            placeholder="What do you have? chicken, rice, that leftover bell pepper..."
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            className="mb-4 bg-background/50 border-border text-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleGenerateRecipe()}
          />
          <Button
            onClick={handleGenerateRecipe}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Recipes...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Recipes
              </>
            )}
          </Button>
          <p className="text-gray-400 text-sm text-center mt-2">
            {5 - recipesGeneratedToday} free recipes left today
          </p>
        </div>

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Cooking up something special...</p>
          </div>
        )}

        {generatedRecipe && !isLoading && (
          <div className="mt-6 p-6 glass-card rounded-2xl">
            <img 
              src={generatedRecipe.imageUrl} 
              alt={generatedRecipe.name} 
              className="w-full h-48 object-cover rounded-xl mb-4" 
            />
            <h3 className="text-2xl font-bold mb-2">{generatedRecipe.name}</h3>
            <div className="flex gap-4 text-sm text-muted-foreground mb-4">
              <span>⏱ Prep: {generatedRecipe.prepTime}</span>
              <span>🔥 Cook: {generatedRecipe.cookTime}</span>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-primary font-semibold mb-2">You'll need:</h4>
                <ul className="text-foreground space-y-1">
                  {generatedRecipe.ingredients.map((ing, i) => (
                    <li key={i}>• {ing.item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-primary font-semibold mb-2">Let's cook:</h4>
                <ol className="text-foreground space-y-2">
                  {generatedRecipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <Button 
              onClick={() => saveToFavorites(generatedRecipe)} 
              className="mt-6 w-full bg-primary hover:bg-primary/90"
            >
              ❤️ Save to My Recipes
            </Button>
          </div>
        )}

        {recipes.length > 0 && !generatedRecipe && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Generate;
