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
    <div className="min-h-screen pb-20 bg-background">
      {/* Full-width Hero */}
      <div 
        className="relative h-[420px] mb-8 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80)`
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Turn Ingredients Into Magic
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-lg">
            Real recipes. Real food. Zero waste.
          </p>
          
          {/* Glassmorphic Search Bar */}
          <div 
            className="w-full max-w-xl glass-card rounded-2xl p-2 flex items-center gap-2 cursor-pointer hover:shadow-xl transition-all"
            onClick={() => navigate('/generate')}
          >
            <div className="flex-1 px-4 py-3 text-left text-muted-foreground">
              What's in your fridge?
            </div>
            <Button size="lg" className="rounded-xl">
              <Sparkles className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Halloween Banner - Compact */}
        {!showHalloweenRecipes && (
          <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl p-6 mb-8 cursor-pointer hover:shadow-lg transition-all"
               onClick={() => setShowHalloweenRecipes(true)}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎃</span>
                  <h2 className="text-2xl font-bold text-white">Halloween Recipe Drop</h2>
                </div>
                <p className="text-white/90 text-sm">
                  Vampire brownies that ooze • Black pasta that goes viral
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Halloween Recipes Grid */}
        {showHalloweenRecipes && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">🦇 Spooky Specials</h3>
              <Button variant="ghost" onClick={() => setShowHalloweenRecipes(false)}>
                Hide
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Featured Collections - 2x2 Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Quick & Easy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
              { name: 'Healthy Bowls', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
              { name: 'Comfort Food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
              { name: 'Fresh & Light', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80' },
            ].map((collection) => (
              <div 
                key={collection.name}
                className="premium-card overflow-hidden cursor-pointer"
                onClick={() => navigate('/generate')}
              >
                <div 
                  className="h-36 bg-cover bg-center"
                  style={{ backgroundImage: `url(${collection.image})` }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm">{collection.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="premium-card border-0">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
