import { useNavigate } from "react-router-dom";
import { ChefHat, Sparkles, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { featuredHalloweenRecipe, getFreeHalloweenRecipes } from "@/data/halloweenRecipes";
import { RecipeCard } from "@/components/RecipeCard";
import { recipeStorage } from "@/utils/recipeStorage";

const Index = () => {
  const navigate = useNavigate();
  const [showHalloweenRecipes, setShowHalloweenRecipes] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: "Smart Recipe Creator",
      description: "Tell us what's in your fridge, we'll handle the rest",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Keep track of your favorite recipes for quick access",
    },
    {
      icon: ShoppingCart,
      title: "Smart Shopping Lists",
      description: "Automatically create shopping lists from recipes for instore use",
    },
  ];

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const freeHalloweenRecipes = getFreeHalloweenRecipes();

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        {/* Halloween Hero Section - Compact */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎃</span>
                <h2 className="text-2xl font-bold text-white">Halloween Recipe Drop</h2>
              </div>
              <p className="text-white/90 text-sm mb-0 md:mb-4">
                Vampire brownies that ooze • Black pasta that goes viral • Not your basic Halloween
              </p>
            </div>
            <button
              onClick={() => setShowHalloweenRecipes(!showHalloweenRecipes)}
              className="bg-black/20 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold hover:bg-black/30 transition-all flex items-center gap-2"
            >
              {showHalloweenRecipes ? 'Hide' : 'View'}
              <ChevronRight className={`w-4 h-4 transition-transform ${showHalloweenRecipes ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Halloween Recipes - Only show when toggled */}
        {showHalloweenRecipes && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">🦇 Spooky Specials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {freeHalloweenRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <ChefHat className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4">QuickDish</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your ingredients into delicious recipes in just one click!
          </p>
          <Button
            onClick={() => navigate('/generate')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
          >
            <Sparkles className="mr-2 h-6 w-6" />
            Start Cooking
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Enter Your Ingredients</h3>
                  <p className="text-muted-foreground text-sm">
                    List what you have in your kitchen
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Generates Recipes</h3>
                  <p className="text-muted-foreground text-sm">
                    Get 5 diverse recipes tailored to your ingredients
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cook & Enjoy</h3>
                  <p className="text-muted-foreground text-sm">
                    Follow step-by-step instructions and adjust servings
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
