import { Home, Sparkles, Heart, ShoppingCart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Sparkles, label: "Quick Cook", path: "/generate" },
    { icon: Heart, label: "Saved", path: "/favorites" },
    { icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
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
    </nav>
  );
};
