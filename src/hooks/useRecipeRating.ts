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
      // Call the SECURITY DEFINER function to get aggregated stats
      const { data, error } = await supabase
        .rpc('get_recipe_rating_stats', { recipe_id_param: recipeId });

      if (error) throw error;

      if (data && data.length > 0) {
        setRatingData({
          averageRating: data[0].average_rating,
          totalRatings: data[0].total_ratings
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
