import { Home, Sparkles, Heart, ShoppingCart, User, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useClientRouter } from "@/hooks/useClientRouter";

export const BottomNav = () => {
  const handleNavigate = useClientRouter();
  const location = useLocation();
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    setIsDeveloper(localStorage.getItem('developerMode') === 'true');
  }, []);

  const baseNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Sparkles, label: "Discover", path: "/generate" },
    { icon: Heart, label: "Saved", path: "/favorites" },
    { icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const navItems = isDeveloper 
    ? [...baseNavItems, { icon: Settings, label: "Admin", path: "/admin" }]
    : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              type="button"
              onClick={(e) => {
                console.log('Navigating to:', item.path);
                handleNavigate(item.path, e);
              }}
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
