import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

const CACHE_DURATION = 30 * 1000; // 30 seconds
const QUERY_TIMEOUT = 5000; // 5 seconds

interface ShoppingListCache {
  items: ShoppingItem[];
  listId: string | null;
  timestamp: number;
}

export const useShoppingList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listId, setListId] = useState<string | null>(null);
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<ShoppingItem[] | null>(null);
  const cacheRef = useRef<ShoppingListCache | null>(null);
  const fetchInProgressRef = useRef(false);

  // Load from localStorage for guests
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('shoppingList');
      const items: ShoppingItem[] = saved ? JSON.parse(saved) : [];
      setShoppingList(items);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      setShoppingList([]);
    }
  };

  // Fetch shopping list from Supabase
  const fetchShoppingList = async () => {
    if (!user) return;

    // Prevent duplicate simultaneous requests
    if (fetchInProgressRef.current) return;

    // Check cache first
    const now = Date.now();
    if (cacheRef.current && (now - cacheRef.current.timestamp) < CACHE_DURATION) {
      setShoppingList(cacheRef.current.items);
      setListId(cacheRef.current.listId);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      fetchInProgressRef.current = true;
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);
      
      // Get or create shopping list for user - optimized query
      const { data: lists, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('id, items')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (fetchError) throw fetchError;

      if (!lists || lists.length === 0) {
        // Create new shopping list
        const { data: newList, error: createError } = await supabase
          .from('shopping_lists')
          .insert({
            user_id: user.id,
            items: [] as any
          })
          .select('id, items')
          .single();

        if (createError) throw createError;
        
        setListId(newList.id);
        setShoppingList([]);
        
        // Update cache
        cacheRef.current = {
          items: [],
          listId: newList.id,
          timestamp: now,
        };
      } else {
        setListId(lists[0].id);
        const items = lists[0].items;
        const itemsArray = Array.isArray(items) ? items as unknown as ShoppingItem[] : [];
        setShoppingList(itemsArray);
        
        // Update cache
        cacheRef.current = {
          items: itemsArray,
          listId: lists[0].id,
          timestamp: now,
        };
      }
    } catch (err: any) {
      console.error('Error fetching shopping list:', err);
      
      // Use cached data if available, even if stale
      if (cacheRef.current) {
        setShoppingList(cacheRef.current.items);
        setListId(cacheRef.current.listId);
      }
      
      toast({
        title: "Couldn't load shopping list",
        description: "Using cached data. Check connection.",
        variant: "destructive",
      });
    } finally {
      fetchInProgressRef.current = false;
      setLoading(false);
    }
  };

  // Debounced save to Supabase
  const debouncedSave = useCallback(async (items: ShoppingItem[]) => {
    if (!user || !listId) return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Store pending update
    pendingUpdateRef.current = items;

    // Set new timer
    debounceTimerRef.current = setTimeout(async () => {
      if (!pendingUpdateRef.current) return;

      setSaving(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);
        
        const { error } = await supabase
          .from('shopping_lists')
          .update({
            items: pendingUpdateRef.current as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', listId)
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (error) throw error;
        
        // Update cache
        if (cacheRef.current) {
          cacheRef.current.items = pendingUpdateRef.current;
          cacheRef.current.timestamp = Date.now();
        }
        
        pendingUpdateRef.current = null;
      } catch (err: any) {
        console.error('Error saving shopping list:', err);
        toast({
          title: "Couldn't save changes",
          description: "Will retry automatically",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    }, 1000); // 1 second debounce
  }, [user, listId, toast]);

  // Initialize
  useEffect(() => {
    if (user) {
      fetchShoppingList();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('shopping-list-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'shopping_lists',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Shopping list changed:', payload);
            if (payload.eventType === 'UPDATE' && payload.new) {
              setShoppingList((payload.new as any).items || []);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    } else {
      loadFromLocalStorage();
      setLoading(false);
    }
  }, [user]);

  // Update shopping list (with debounce for Supabase, immediate for localStorage)
  const updateShoppingList = useCallback((updater: (prev: ShoppingItem[]) => ShoppingItem[]) => {
    setShoppingList(prev => {
      const newList = updater(prev);
      
      if (user) {
        // Debounced save to Supabase
        debouncedSave(newList);
      } else {
        // Immediate save to localStorage
        try {
          localStorage.setItem('shoppingList', JSON.stringify(newList));
        } catch (error) {
          console.error('Failed to save to localStorage:', error);
        }
      }
      
      return newList;
    });
  }, [user, debouncedSave]);

  // Add items to shopping list
  const addItems = useCallback((newItems: Omit<ShoppingItem, 'id' | 'checked'>[]) => {
    updateShoppingList(prev => {
      const maxId = prev.length > 0 ? Math.max(...prev.map(i => i.id)) : 0;
      const itemsWithIds = newItems.map((item, index) => ({
        ...item,
        id: maxId + index + 1,
        checked: false,
      }));
      return [...prev, ...itemsWithIds];
    });
  }, [updateShoppingList]);

  // Toggle item checked status
  const toggleItem = useCallback((id: number) => {
    updateShoppingList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, [updateShoppingList]);

  // Remove item
  const removeItem = useCallback((id: number) => {
    updateShoppingList(prev => prev.filter(item => item.id !== id));
  }, [updateShoppingList]);

  // Clear completed items
  const clearCompleted = useCallback(() => {
    updateShoppingList(prev => prev.filter(item => !item.checked));
  }, [updateShoppingList]);

  // Clear all items
  const clearAll = useCallback(() => {
    updateShoppingList(() => []);
  }, [updateShoppingList]);

  // Set shopping list directly (for pantry filtering, etc.)
  const setList = useCallback((newList: ShoppingItem[]) => {
    updateShoppingList(() => newList);
  }, [updateShoppingList]);

  return {
    shoppingList,
    loading,
    saving,
    addItems,
    toggleItem,
    removeItem,
    clearCompleted,
    clearAll,
    setList,
    refetch: fetchShoppingList,
  };
};
