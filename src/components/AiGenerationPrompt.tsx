import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap, Loader2 } from 'lucide-react';
import { useAiRecipeGeneration } from '@/hooks/useAiRecipeGeneration';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '@/types/recipe';

interface AiGenerationPromptProps {
  searchTerm: string;
  onRecipeGenerated: (recipe: Recipe) => void;
}

export const AiGenerationPrompt = ({ searchTerm, onRecipeGenerated }: AiGenerationPromptProps) => {
  const { generateRecipe, isGenerating, generationsRemaining, checkRateLimit } = useAiRecipeGeneration();
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (user) {
      checkRateLimit().then(({ allowed, remaining }) => {
        setRemaining(remaining);
        setLimitReached(!allowed);
      });
    }
  }, [user]);

  const handleGenerate = async () => {
    console.log('🎯 1. Starting AI generation for:', searchTerm);
    console.log('🎯 2. User authenticated:', user?.id);
    console.log('🎯 3. Rate limit check:', { limitReached, remaining });
    
    if (!user) {
      console.log('🎯 4. User not authenticated, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (limitReached) {
      console.log('🎯 5. Rate limit reached, isPremium:', isPremium);
      if (!isPremium) {
        navigate('/premium');
      }
      return;
    }

    console.log('🎯 6. Calling generateRecipe...');
    const recipe = await generateRecipe(searchTerm);
    console.log('🎯 7. Recipe generated:', recipe);
    console.log('🎯 8. Recipe ID:', recipe?.id);
    
    if (recipe) {
      console.log('🎯 9. About to call onRecipeGenerated');
      onRecipeGenerated(recipe);
    } else {
      console.log('🎯 9. Recipe generation failed - no recipe returned');
    }
  };

  return (
    <Card className="p-6 border-2 border-dashed">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">
            This recipe doesn't exist in our database yet.
          </h3>
          <p className="text-sm text-muted-foreground">
            Our AI can create a custom <span className="font-medium text-foreground">{searchTerm}</span> recipe for you
          </p>
        </div>

        {user ? (
          <>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || limitReached}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating recipe...
                </>
              ) : limitReached ? (
                <>
                  {isPremium ? 'Daily limit reached' : 'Upgrade for more generations'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3" />
              <span>
                {limitReached ? (
                  isPremium ? (
                    'Come back tomorrow for more generations'
                  ) : (
                    'Upgrade to Premium for 5 generations/day'
                  )
                ) : (
                  isPremium 
                    ? `${remaining ?? '...'} of 5 AI generation${remaining === 1 ? '' : 's'} remaining today`
                    : `${remaining ?? '...'} of 2 free generation${remaining === 1 ? '' : 's'} remaining today`
                )}
              </span>
            </div>

            {limitReached && !isPremium && (
              <Button
                variant="outline"
                onClick={() => navigate('/premium')}
                className="w-full"
              >
                View Premium Plans
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate('/auth')}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sign in to generate recipes
            </Button>
            <p className="text-xs text-muted-foreground">
              Free: 2 AI generations/day • Premium: 5/day
            </p>
          </>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Or try browsing our <button onClick={() => navigate('/discover')} className="text-primary underline">recipe collections</button>
          </p>
        </div>
      </div>
    </Card>
  );
};
