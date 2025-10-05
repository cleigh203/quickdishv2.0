import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { PremiumGuard } from '@/components/PremiumGuard';
import { AIRecipeChat } from '@/components/AIRecipeChat';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { allRecipes } from '@/data/recipes';
import { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { trackChatOpened } from '@/lib/aiChatAnalytics';

const AIChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSavedRecipes();
      trackChatOpened(user.id);
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const loadSavedRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', user?.id);

      if (fetchError) throw fetchError;

      const recipes = data
        .map(sr => allRecipes.find(r => r.id === sr.recipe_id))
        .filter((r): r is Recipe => r !== undefined);

      setSavedRecipes(recipes);
    } catch (err) {
      console.error('Error loading saved recipes:', err);
      setError('Failed to load your saved recipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PremiumGuard>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 glass-card border-b border-border/40">
          <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-xl font-bold">AI Recipe Chef</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Chat about your saved recipes with AI
              </p>
            </div>
            <div className="w-6" />
          </div>
          
          {/* Usage Badge */}
          <div className="flex justify-center pb-3">
            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
              <span className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Unlimited chats • Premium
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex flex-col">
              <div className="container max-w-4xl py-6 px-4 space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-2/3 ml-auto" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">😕</div>
                <h3 className="text-xl font-semibold">Oops!</h3>
                <p className="text-muted-foreground max-w-md">{error}</p>
                <Button onClick={loadSavedRecipes}>Try Again</Button>
              </div>
            </div>
          ) : savedRecipes.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-8 max-w-md">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">No Saved Recipes Yet</h3>
                <p className="text-muted-foreground">
                  Save some recipes first so the AI can help you with meal planning and cooking questions!
                </p>
                <Button onClick={() => navigate('/generate')} className="mt-4">
                  Browse Recipes
                </Button>
              </div>
            </div>
          ) : (
            <AIRecipeChat />
          )}
        </div>

        <BottomNav />
      </div>
    </PremiumGuard>
  );
};

export default AIChat;
