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
      // Use the aggregated view for public rating stats (no user_id exposure)
      const { data, error } = await supabase
        .from('recipe_rating_stats')
        .select('average_rating, total_ratings')
        .eq('recipe_id', recipeId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRatingData({
          averageRating: data.average_rating,
          totalRatings: data.total_ratings
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
