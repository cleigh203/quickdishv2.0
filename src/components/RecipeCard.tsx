import { Clock, ChefHat, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import { useRecipeRating } from "@/hooks/useRecipeRating";
import { RatingStars } from "@/components/RatingStars";
import { useNavigate } from "react-router-dom";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showSaveButton?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  showMealPlanButton?: boolean;
  onMealPlanClick?: () => void;
}

export const RecipeCard = ({ recipe, onClick, showSaveButton = true, showRemoveButton = false, onRemove, showMealPlanButton = false, onMealPlanClick }: RecipeCardProps) => {
  const { averageRating, totalRatings } = useRecipeRating(recipe.id);
  const navigate = useNavigate();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const imageUrl = getRecipeImage(recipe, false);
    console.error('❌ Image failed to load:', {
      recipeName: recipe.name,
      recipeId: recipe.id,
      attemptedUrl: imageUrl,
      hasImageUrl: !!recipe.imageUrl,
      hasImage: !!recipe.image,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    });
    
    // MOBILE FIX: Retry with cache-busting if not already tried
    if (!target.dataset.retried) {
      target.dataset.retried = 'true';
      const separator = imageUrl.includes('?') ? '&' : '?';
      target.src = `${imageUrl}${separator}retry=${Date.now()}`;
      console.log('🔄 Retrying image load with cache-bust:', target.src);
      return;
    }
    
    // Set fallback image after retry attempt
    if (!target.src.includes('unsplash')) {
      target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=180&q=18&fm=webp";
      console.log('🖼️ Using fallback image');
    }
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', recipe.name);
  };

  return (
    <Card
      className="recipe-card border-0"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      data-recipe-card
    >
      <div className="relative">
        {recipe.isAiGenerated ? (
          <div className="recipe-card-image bg-muted flex items-center justify-center text-muted-foreground">
            <span className="text-sm">AI Recipe</span>
          </div>
        ) : (
          <img
            key={recipe.imageUrl || recipe.image}
            src={getRecipeImage(recipe, false)}
            alt={recipe.name}
            className="recipe-card-image transition-opacity duration-300"
            loading="eager"
            crossOrigin="anonymous"
            width="400"
            height="300"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        {recipe.isPremium && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              PREMIUM
            </span>
          </div>
        )}
        {showRemoveButton && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            aria-label="Remove recipe"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <CardContent className="recipe-card-content">
        <div className="flex flex-col items-center gap-2 mb-4 mt-2">
          <span className="recipe-badge capitalize">{recipe.difficulty}</span>
          {totalRatings > 0 && (
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              <RatingStars value={averageRating} />
              {averageRating} ({totalRatings})
            </span>
          )}
        </div>
        <h3 className="recipe-card-title line-clamp-2 leading-snug text-center mb-3">{recipe.name}</h3>
        <div className="flex items-center justify-between small-text mb-3">
          <span className="flex items-center gap-1">
            🕐 {recipe.cookTime}
          </span>
          <span className="flex items-center gap-1">
            🍽️ {recipe.cuisine}
          </span>
        </div>
        {showMealPlanButton && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onMealPlanClick) {
                onMealPlanClick();
              }
            }}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
          >
            Add to Meal Plan
          </button>
        )}
      </CardContent>
    </Card>
  );
};
