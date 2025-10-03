import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeName: string;
  recipeId: string;
  userId: string | undefined;
  onRatingSubmitted?: () => void;
}

export const RatingModal = ({
  open,
  onOpenChange,
  recipeName,
  recipeId,
  userId,
  onRatingSubmitted
}: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch existing rating when modal opens
  useEffect(() => {
    if (open && userId) {
      fetchExistingRating();
    }
  }, [open, userId, recipeId]);

  const fetchExistingRating = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('rating')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle();

    if (!error && data) {
      setExistingRating(data.rating);
      setRating(data.rating);
    } else {
      setExistingRating(null);
      setRating(0);
    }
  };

  const handleSubmit = async () => {
    if (!userId || rating === 0) return;

    setIsSubmitting(true);

    try {
      // Check if rating already exists
      if (existingRating !== null) {
        // Update existing rating
        const { error } = await supabase
          .from('recipe_ratings')
          .update({ rating, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('recipe_id', recipeId);

        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('recipe_ratings')
          .insert({
            user_id: userId,
            recipe_id: recipeId,
            rating
          });

        if (error) throw error;
      }

      toast({
        title: "Rating saved! ⭐",
        description: `You rated ${recipeName} ${rating} out of 5 stars`,
      });

      onRatingSubmitted?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Failed to save rating",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = () => {
    const currentRating = hoveredRating || rating;
    if (currentRating === 0) return "Select a rating";
    return `${currentRating} out of 5 stars`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {recipeName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Text */}
          <p className="text-sm text-muted-foreground">
            {getRatingText()}
          </p>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Saving..." : existingRating !== null ? "Update Rating" : "Submit Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
