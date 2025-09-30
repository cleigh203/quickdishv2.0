import { Clock, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: string;
  prepTime: string;
  difficulty: string;
  cuisine: string;
  imageUrl: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="glass-card smooth-transition hover:scale-[1.02] cursor-pointer overflow-hidden"
      onClick={onClick}
      style={{ boxShadow: '0 10px 40px rgba(255, 107, 53, 0.2)' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge 
            variant="secondary" 
            className="bg-primary text-primary-foreground"
          >
            {recipe.difficulty}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 text-foreground">{recipe.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.cuisine}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
