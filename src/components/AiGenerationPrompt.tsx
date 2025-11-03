import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Zap, Crown } from 'lucide-react';
import { useAiRecipeGeneration } from '@/hooks/useAiRecipeGeneration';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import { PremiumModal } from '@/components/PremiumModal';
import { useAIUsage } from '@/hooks/useSubscription';

interface AiGenerationPromptProps {
  searchTerm: string;
  onRecipeGenerated: (recipe: Recipe) => void;
}

// Ingredient emoji mapping
const ingredientEmojis: Record<string, string> = {
  chicken: '🍗',
  beef: '🥩',
  pork: '🥓',
  fish: '🐟',
  shrimp: '🦐',
  pasta: '🍝',
  rice: '🍚',
  potato: '🥔',
  tomato: '🍅',
  cheese: '🧀',
  egg: '🥚',
  milk: '🥛',
  bread: '🍞',
  onion: '🧅',
  garlic: '🧄',
  carrot: '🥕',
  broccoli: '🥦',
  spinach: '🥬',
  pepper: '🌶️',
  mushroom: '🍄',
  avocado: '🥑',
  lemon: '🍋',
  lime: '🍈',
};

const getIngredientEmoji = (ingredient: string): string => {
  const lower = ingredient.toLowerCase();
  for (const [key, emoji] of Object.entries(ingredientEmojis)) {
    if (lower.includes(key)) {
      return emoji;
    }
  }
  return '🥘';
};

export const AiGenerationPrompt = ({ searchTerm, onRecipeGenerated }: AiGenerationPromptProps) => {
  const { generateRecipe, isGenerating, checkRateLimit } = useAiRecipeGeneration();
  const { user, isPremium } = useAuth();
  const { data: aiUsage } = useAIUsage('recipe_generation');
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Parse ingredients from search term
  const ingredients = searchTerm
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(term => term.length > 2)
    .slice(0, 5); // Limit to 5 ingredients for display

  // Use AI usage from hook if available (preferred)
  useEffect(() => {
    if (aiUsage) {
      setRemaining(aiUsage.limit - aiUsage.count);
      setLimitReached(!aiUsage.canUse);
    } else if (user) {
      // Fallback to checkRateLimit
      checkRateLimit().then(({ allowed, remaining }) => {
        setRemaining(remaining);
        setLimitReached(!allowed);
      });
    }
  }, [user, aiUsage, checkRateLimit]);

  const handleGenerate = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (limitReached) {
      setShowPremiumModal(true);
      return;
    }

    try {
      const recipe = await generateRecipe(searchTerm);
      if (recipe) {
        onRecipeGenerated(recipe);
      }
    } catch (error) {
      console.error('Failed to generate recipe:', error);
    }
  };

  const remainingText = remaining !== null 
    ? `${remaining} AI generation${remaining !== 1 ? 's' : ''} left today`
    : 'Checking...';

  return (
    <>
      <div className="max-w-[450px] mx-auto bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        {/* AI POWERED Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            ✨ AI POWERED
          </span>
        </div>

        {/* Gradient Icon with Sparkle */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative w-[70px] h-[70px] rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
            {/* Sparkle emoji in top right */}
            <span className="absolute -top-1 -right-1 text-2xl animate-spin" style={{ animationDuration: '3s' }}>
              ✨
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Create Your Custom Recipe
        </h3>

        {/* Subtitle */}
        <p className="text-[15px] text-gray-600 dark:text-gray-400 text-center mb-6">
          Our AI chef will craft a personalized{' '}
          <span className="font-medium text-green-600 dark:text-green-400">{searchTerm}</span> recipe just for you
        </p>

        {/* Ingredient Chips */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
              >
                <span>{getIngredientEmoji(ingredient)}</span>
                <span className="capitalize">{ingredient}</span>
              </span>
            ))}
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || limitReached}
          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 mb-4"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span className="animate-pulse">🔮 Creating your recipe...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              ✨ Generate Recipe with AI
            </>
          )}
        </Button>

        {/* Generation Limits */}
        {user && (
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            {isPremium ? (
              <>
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  👑 {remainingText}
                </span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  ⚡ {remainingText}
                </span>
              </>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Browse Collections Button */}
        <Button
          onClick={() => navigate('/discover')}
          variant="outline"
          className="w-full h-11 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
        >
          Browse Recipe Collections
        </Button>

        {/* Sign in prompt for non-authenticated users */}
        {!user && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => navigate('/auth')}
              variant="ghost"
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Sign in to generate recipes
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Free: 1 AI generation/day • Premium: 5/day
            </p>
          </div>
        )}
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        feature="ai-recipes"
      />
    </>
  );
};
