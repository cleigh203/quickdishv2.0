import { useRecipeRating } from '@/hooks/useRecipeRating';
import { RatingStars } from '@/components/RatingStars';

export function InlineRating({ recipeId, className = '' }: { recipeId: string; className?: string }) {
  const { averageRating, totalRatings } = useRecipeRating(recipeId);
  if (!totalRatings || totalRatings <= 0) return null;
  return (
    <div className={`flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
      <RatingStars value={averageRating} />
      <span>{averageRating}</span>
      <span>({totalRatings})</span>
    </div>
  );
}

export default InlineRating;

