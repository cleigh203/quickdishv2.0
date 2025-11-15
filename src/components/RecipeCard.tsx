import { useState } from "react";
import { Clock, ChefHat, Trash2, Calendar, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";
import { useRecipeRating } from "@/hooks/useRecipeRating";
import { RatingStars } from "@/components/RatingStars";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showSaveButton?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
  showMealPlanButton?: boolean;
  onMealPlanClick?: () => void;
  index?: number; // For progressive loading (first 6 eager, rest lazy)
}

export const RecipeCard = ({ recipe, onClick, showSaveButton = true, showRemoveButton = false, onRemove, showEditButton = false, onEdit, showMealPlanButton = false, onMealPlanClick, index = 0 }: RecipeCardProps) => {
  const { averageRating, totalRatings } = useRecipeRating(recipe.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Progressive loading: first 6 images eager, rest lazy
  const shouldLoadEager = index < 6;

  return (
    <Card
      className="recipe-card border-0 h-full flex flex-col"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', minHeight: '300px' }}
      data-recipe-card
    >
      <div className="relative">
        {/* Check if this is a custom recipe (ID starts with 'custom-') */}
        {recipe.id?.startsWith('custom-') ? (
          /* Custom Recipe - show image or placeholder */
          recipe.imageUrl || recipe.image ? (
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
              {/* Loading skeleton placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse z-0" />
              )}
              <img
                key={recipe.imageUrl || recipe.image}
                src={recipe.imageUrl || recipe.image}
                alt={recipe.name}
                className={`relative w-full h-full object-cover transition-opacity duration-300 z-10 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading={shouldLoadEager ? "eager" : "lazy"}
                fetchpriority={index < 3 ? "high" : index < 6 ? "auto" : "low"}
                decoding={shouldLoadEager ? "sync" : "async"}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                width="400"
                height="300"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Fallback to placeholder if image fails to load
                  target.src = "https://via.placeholder.com/400x300/f97316/ffffff?text=My+Recipe";
                  setImageLoaded(true);
                }}
              />
            </div>
          ) : (
            /* Custom Recipe without image - show placeholder */
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white">
              <span className="text-sm font-bold">My Recipe</span>
            </div>
          )
        ) : recipe.isAiGenerated ? (
          /* AI Recipe without image - show placeholder */
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground">
            <span className="text-sm">AI Recipe</span>
          </div>
        ) : (
          /* Regular recipe with image */
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
            {/* Loading skeleton placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse z-0" />
            )}
            <img
              key={recipe.imageUrl || recipe.image}
              src={getRecipeImage(recipe, import.meta.env.DEV)}
              alt={recipe.name}
              className={`relative w-full h-full object-cover transition-opacity duration-300 z-10 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading={shouldLoadEager ? "eager" : "lazy"}
              fetchpriority={index < 3 ? "high" : index < 6 ? "auto" : "low"}
              decoding={shouldLoadEager ? "sync" : "async"}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              width="400"
              height="300"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/400x300/10b981/ffffff?text=QuickDish";
                setImageLoaded(true);
              }}
            />
          </div>
        )}
        {/* Custom Recipe Badge */}
        {recipe.id?.startsWith('custom-') && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              Custom
            </span>
          </div>
        )}
        {recipe.isPremium && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              PREMIUM
            </span>
          </div>
        )}
        {(showRemoveButton && onRemove) || (showEditButton && onEdit) ? (
          <div className="absolute top-2 right-2 flex gap-2 z-20">
            {showEditButton && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="w-8 h-8 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full flex items-center justify-center shadow-lg transition-colors z-20"
                aria-label="Edit recipe"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {showRemoveButton && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transition-colors z-20"
                aria-label="Remove recipe"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : null}
      </div>
      <CardContent className="recipe-card-content flex-1 flex flex-col">
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
        {showMealPlanButton && onMealPlanClick && (
          <div className="flex justify-center mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMealPlanClick();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-full text-xs font-medium transition-colors"
            >
              <Calendar className="w-3 h-3" />
              Add to Meal Plan
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
