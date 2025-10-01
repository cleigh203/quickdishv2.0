import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Generate from "./pages/Generate";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import Shopping from "./pages/Shopping";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
// ... other imports

const App = () => {
  // ADD THE DIAGNOSTIC CODE HERE
  useEffect(() => {
    // Check what's capturing events
    const originalAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(...args) {
      if (args[0] === 'click') {
        console.trace('Click listener added by:', args);
      }
      return originalAdd.apply(this, args);
    };
    
    // Log what happens on click
    window.addEventListener('click', (e) => {
      console.log('Click captured:', {
        target: e.target,
        defaultPrevented: e.defaultPrevented,
        bubbles: e.bubbles,
        eventPhase: e.eventPhase
      });
    }, true);
    
    // Check for service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        console.log('Service workers:', regs);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      // ... rest of your app
    </QueryClientProvider>
  );
};
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
