import { User, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { recipeStorage } from "@/utils/recipeStorage";

const Profile = () => {
  const recipes = recipeStorage.getRecipes();
  const favorites = recipeStorage.getFavorites();
  const shoppingList = recipeStorage.getShoppingList();

  const stats = [
    { label: "Recipes Generated", value: recipes.length, icon: ChefHat },
    { label: "Favorites", value: favorites.length, icon: User },
    { label: "Shopping Lists", value: shoppingList.length, icon: User },
  ];

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Your cooking journey with QuickDish AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="glass-card">
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">About QuickDish AI</h2>
            <p className="text-muted-foreground mb-4">
              QuickDish AI uses advanced artificial intelligence to generate personalized 
              recipes based on your available ingredients. Get creative cooking ideas, 
              save your favorites, and build shopping lists effortlessly.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• AI-powered recipe generation</p>
              <p>• Adjustable serving sizes</p>
              <p>• Save favorite recipes</p>
              <p>• Smart shopping lists</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
