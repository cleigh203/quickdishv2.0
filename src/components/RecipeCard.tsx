import { Clock, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { getRecipeImage } from "@/utils/recipeImages";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="recipe-card border-0"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={recipe.image}
          alt={recipe.name}
          className="recipe-card-image"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
          }}
        />
        {recipe.isPremium && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              PREMIUM
            </span>
          </div>
        )}
      </div>
      <CardContent className="recipe-card-content">
        <div className="flex items-center gap-2 mb-3">
          <span className="recipe-badge capitalize">
            {recipe.difficulty}
          </span>
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
