import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RatingData {
  averageRating: number;
  totalRatings: number;
}

export const useRecipeRating = (recipeId: string) => {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchRatings = async () => {
    setIsLoading(true);
    try {
      // Query the recipe_ratings table directly to get aggregated stats
      const { data, error } = await supabase
        .from('recipe_ratings')
        .select('rating')
        .eq('recipe_id', recipeId);

      if (error) throw error;

      if (data && data.length > 0) {
        const ratings = data.map(r => r.rating);
        const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        const totalRatings = ratings.length;

        setRatingData({
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          totalRatings
        });
      } else {
        setRatingData({
          averageRating: 0,
          totalRatings: 0
        });
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [recipeId]);

  return {
    ...ratingData,
    isLoading,
    refetch: fetchRatings
  };
};
