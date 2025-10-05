import { Home, Sparkles, BookMarked, ShoppingCart, User, Bot } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PremiumBadge } from "@/components/PremiumBadge";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isPremium } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Sparkles, label: "Discover", path: "/generate" },
    ...(user ? [{ icon: Bot, label: "AI Chef", path: "/ai-chat", premium: true }] : []),
    { icon: BookMarked, label: "My Kitchen", path: "/saved" },
    { icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border z-50">
      <div className="max-w-lg mx-auto">
        {/* Guest mode banner */}
        {!user && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 flex items-center justify-between">
            <span className="text-black text-sm font-medium">Sign up to save recipes & more!</span>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs bg-white text-orange-600 hover:bg-white/90"
              onClick={() => navigate('/auth')}
            >
              Sign Up
            </Button>
          </div>
        )}
        
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isPremiumFeature = 'premium' in item && item.premium;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full smooth-transition relative ${
                  isActive 
                    ? isPremiumFeature 
                      ? "text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text" 
                      : "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${isActive && isPremiumFeature ? 'text-purple-500' : ''}`} />
                  {isPremiumFeature && (
                    <PremiumBadge 
                      variant="compact" 
                      text="Pro" 
                      showIcon={false}
                      className="absolute -top-1 -right-3 scale-75"
                    />
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
