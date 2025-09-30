import { useNavigate } from "react-router-dom";
import { ChefHat, Sparkles, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI Recipe Generation",
      description: "Enter your ingredients and get 5 unique recipes instantly",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Keep track of your favorite recipes for quick access",
    },
    {
      icon: ShoppingCart,
      title: "Smart Shopping Lists",
      description: "Automatically create shopping lists from recipes",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <ChefHat className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4">QuickDish AI</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your ingredients into delicious recipes with AI
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
