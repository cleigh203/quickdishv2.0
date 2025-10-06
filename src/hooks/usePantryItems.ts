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
  const fetchInProgressRef = useRef(false);

  const fetchPantryItems = useCallback(async (): Promise<PantryItem[]> => {
    // Prevent duplicate simultaneous requests
    if (fetchInProgressRef.current) {
      return cacheRef.current?.items || [];
    }
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
    fetchInProgressRef.current = true;
    
    try {
      // Add 3-second timeout (pantry is less critical)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 3000)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('pantry_items')
        .eq('id', user.id)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

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
    } catch (error: any) {
      console.error('Error fetching pantry items:', error);
      // Return cached items if available on timeout/error
      return cacheRef.current?.items || [];
    } finally {
      fetchInProgressRef.current = false;
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
