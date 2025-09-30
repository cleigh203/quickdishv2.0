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
  imageUrl?: string;
  image?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const getRecipeImage = () => {
    if (recipe.image || recipe.imageUrl) return recipe.image || recipe.imageUrl;
    
    const fallbackImages = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ];
    
    const index = parseInt(recipe.id) % fallbackImages.length;
    return fallbackImages[index];
  };

  return (
    <Card 
      className="glass-card smooth-transition hover:scale-[1.02] cursor-pointer overflow-hidden"
      onClick={onClick}
      style={{ boxShadow: '0 10px 40px rgba(255, 107, 53, 0.2)' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getRecipeImage()} 
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
