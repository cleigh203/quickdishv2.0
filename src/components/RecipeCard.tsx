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
  const imageUrl = getRecipeImage(recipe);

  return (
    <Card 
      className="premium-card cursor-pointer overflow-hidden border-0"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={imageUrl}
          alt={recipe.name}
          className="w-full h-44 object-cover"
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
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold capitalize">
            {recipe.difficulty}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-snug">{recipe.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
