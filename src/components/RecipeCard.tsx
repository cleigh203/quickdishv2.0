import { useState } from "react";
import { Clock, ChefHat, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import { useRecipeRating } from "@/hooks/useRecipeRating";
import { RatingStars } from "@/components/RatingStars";
import { RecipeImage } from "@/components/RecipeImage";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showSaveButton?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export const RecipeCard = ({ recipe, onClick, showSaveButton = true, showRemoveButton = false, onRemove }: RecipeCardProps) => {
  const { averageRating, totalRatings } = useRecipeRating(recipe.id);

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
          <div className="recipe-card-image overflow-hidden">
            <RecipeImage
              src={getRecipeImage(recipe, import.meta.env.DEV)}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
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
        <div className="flex items-center justify-between mb-3">
          <span className="recipe-badge capitalize">{recipe.difficulty}</span>
          {totalRatings > 0 && (
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              <RatingStars value={averageRating} />
              {averageRating} ({totalRatings})
            </span>
          )}
        </div>
        <h3 className="recipe-card-title line-clamp-2 leading-snug">{recipe.name}</h3>
        <p className="small-text mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between small-text">
          <span className="flex items-center gap-1">
            🕐 {recipe.cookTime}
          </span>
          <span className="flex items-center gap-1">
            🍽️ {recipe.cuisine}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
