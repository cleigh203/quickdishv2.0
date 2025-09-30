import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";

const Generate = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateRecipes = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Please enter ingredients",
        description: "Add some ingredients to generate recipes",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: { ingredients: ingredients.trim() }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      // Add unique IDs and fetch images
      const recipesWithImages = await Promise.all(
        data.recipes.map(async (recipe: any, index: number) => {
          const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(recipe.cuisine)},food&sig=${Date.now()}-${index}`;
          return {
            ...recipe,
            id: `recipe-${Date.now()}-${index}`,
            imageUrl,
          };
        })
      );

      setRecipes(recipesWithImages);
      recipeStorage.setRecipes(recipesWithImages);

      toast({
        title: "Recipes generated!",
        description: `Found ${recipesWithImages.length} delicious recipes for you`,
      });
    } catch (error: any) {
      console.error('Error generating recipes:', error);
      toast({
        title: "Failed to generate recipes",
        description: error.message || "Please try again",
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
          <h1 className="text-4xl font-bold mb-2">AI Recipe Generator</h1>
          <p className="text-muted-foreground">
            Enter your ingredients and let AI create amazing recipes
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl mb-8">
          <Input
            type="text"
            placeholder="e.g., chicken, tomatoes, garlic, pasta"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="mb-4 bg-background/50 border-border text-lg"
            onKeyPress={(e) => e.key === 'Enter' && generateRecipes()}
          />
          <Button
            onClick={generateRecipes}
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
        </div>

        {recipes.length > 0 && (
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
