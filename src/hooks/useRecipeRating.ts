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
      const { data, error } = await supabase
        .from('recipe_ratings')
        .select('rating')
        .eq('recipe_id', recipeId);

      if (error) throw error;

      if (data && data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        const average = total / data.length;
        
        setRatingData({
          averageRating: Math.round(average * 10) / 10, // Round to 1 decimal
          totalRatings: data.length
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
