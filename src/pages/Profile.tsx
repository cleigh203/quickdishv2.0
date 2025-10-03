import { useState } from "react";
import { User, ChefHat, Settings, Package, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { PantryDialog } from "@/components/PantryDialog";
import { recipeStorage } from "@/utils/recipeStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useShoppingList } from "@/hooks/useShoppingList";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isPantryDialogOpen, setIsPantryDialogOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('premiumUser') === 'true';
  });
  const [devMode, setDevMode] = useState(() => {
    return localStorage.getItem('developerMode') === 'true';
  });
  const [tapCount, setTapCount] = useState(0);

  const recipes = recipeStorage.getRecipes();
  const { savedRecipes } = useSavedRecipes();
  const { shoppingList } = useShoppingList();
  
  // Lazy load pantry count
  const pantryCount = (() => {
    try {
      const saved = localStorage.getItem('pantryItems');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  })();

  const togglePremium = () => {
    const newStatus = !isPremium;
    setIsPremium(newStatus);
    localStorage.setItem('premiumUser', newStatus.toString());
    
    // Reset daily limits when enabling premium
    if (newStatus) {
      localStorage.setItem('recipesGenerated', '0');
      toast({
        title: "Premium activated! Unlimited recipes enabled 🎉",
      });
    } else {
      toast({
        title: "Switched to free tier (5 recipes/day)",
      });
    }
  };

  // Secret activation: tap version number 7 times
  const handleVersionTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount === 7) {
      setDevMode(true);
      localStorage.setItem('developerMode', 'true');
      toast({
        title: "Developer mode activated! 🛠️",
      });
      setTapCount(0);
    }
  };

  const stats = [
    { label: "Recipes Generated", value: recipes.length, icon: ChefHat },
    { label: "Favorites", value: savedRecipes.length, icon: User },
    { label: "Shopping Lists", value: shoppingList.length, icon: User },
  ];

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
    });
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            {user ? user.email : 'Your cooking journey with QuickDish AI'}
          </p>
        </div>

        {user && (
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Account</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.user_metadata?.display_name && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.user_metadata.display_name}
                    </p>
                  )}
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Not Logged In</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to save your recipes and sync across devices
                </p>
                <Button onClick={() => navigate('/auth')} className="w-full">
                  Sign In / Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
            <h2 className="text-2xl font-bold mb-4">About QuickDish </h2>
            <p className="text-muted-foreground mb-4">
             Turn whatever's in your kitchen into delicious meals. Get inspired, cook confidently, and never waste food again.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• - Instant recipes from your ingredients</p>
              <p>• - Cook hands-free with messy hands mode</p>
              <p>• - Scale recipes for any party size  </p>
              <p>• - Smart shopping lists that save you money</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  My Pantry
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {pantryCount} {pantryCount === 1 ? 'item' : 'items'} in pantry
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsPantryDialogOpen(true)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Package className="w-4 h-4 mr-2" />
              Manage Pantry Items
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card mt-6">
          <CardContent className="p-6">
            <div className="text-xs text-muted-foreground mb-3">Developer Testing</div>
            <Button
              onClick={togglePremium}
              className={`w-full ${
                isPremium 
                  ? 'bg-gradient-to-r from-primary to-pink-500 text-white hover:opacity-90' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              size="lg"
            >
              {isPremium ? '⭐ Premium Active' : '🔓 Activate Premium (Testing)'}
            </Button>
            {isPremium && (
              <div className="mt-3 text-center text-sm text-green-400">
                <div>✓ Unlimited recipes</div>
                <div>✓ All features unlocked</div>
              </div>
            )}
          </CardContent>
        </Card>

        {devMode && (
          <Card className="glass-card mt-6 border-red-500/50">
            <CardContent className="p-6">
              <p className="text-red-400 text-xs mb-3">⚠️ Developer Tools</p>
              <Button
                onClick={() => navigate('/admin')}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Open Admin Panel
              </Button>
            </CardContent>
          </Card>
        )}

        <div 
          onClick={handleVersionTap}
          className="text-xs text-muted-foreground text-center mt-8 cursor-pointer"
        >
          Version 1.0.0
        </div>
      </div>
      
      <PantryDialog 
        open={isPantryDialogOpen} 
        onOpenChange={setIsPantryDialogOpen}
      />
      
      <BottomNav />
    </div>
  );
};

export default Profile;
