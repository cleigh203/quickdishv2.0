import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PantryItem } from "@/types/pantry";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface PantryCache {
  items: PantryItem[];
  timestamp: number;
}

export const usePantryItems = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<PantryCache | null>(null);

  const fetchPantryItems = useCallback(async (): Promise<PantryItem[]> => {
    if (!user) {
      return [];
    }

    // Check cache first
    const now = Date.now();
    if (cacheRef.current && (now - cacheRef.current.timestamp) < CACHE_DURATION) {
      return cacheRef.current.items;
    }

    // Fetch from Supabase
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('pantry_items')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const pantryItems: PantryItem[] = (data?.pantry_items || []).map((name: string) => ({
        id: `pantry-${name}`,
        name,
        quantity: 1,
        unit: 'unit',
        category: 'other' as const,
        addedDate: new Date().toISOString(),
      }));

      // Update cache
      cacheRef.current = {
        items: pantryItems,
        timestamp: now,
      };

      return pantryItems;
    } catch (error) {
      console.error('Error fetching pantry items:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearCache = useCallback(() => {
    cacheRef.current = null;
  }, []);

  return {
    fetchPantryItems,
    clearCache,
    loading,
  };
};
