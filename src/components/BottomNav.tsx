import { Home, Sparkles, BookMarked, ShoppingCart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Sparkles, label: "Discover", path: "/generate" },
    { icon: BookMarked, label: "My Kitchen", path: "/saved" },
    { icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    >
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
            const Icon = item?.icon || Home;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full smooth-transition ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
