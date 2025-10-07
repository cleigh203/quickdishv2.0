import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { deduplicateShoppingList } from '@/utils/shoppingListUtils';

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

const CACHE_DURATION = 60 * 1000; // 60 seconds (improved cache)
const QUERY_TIMEOUT = 10000; // 10 seconds
const REALTIME_DEBOUNCE = 500; // 500ms debounce for realtime updates

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
  
  // Request queue for serializing updates
  const updateQueueRef = useRef<Promise<void>>(Promise.resolve());
  const realtimeDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const hasPendingLocalChangesRef = useRef(false);

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

  // Serialized save with request queue
  const queuedSave = useCallback(async (items: ShoppingItem[]) => {
    if (!user || !listId) return;

    // Mark that we have pending local changes
    hasPendingLocalChangesRef.current = true;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Store pending update
    pendingUpdateRef.current = items;

    // Debounce the actual save
    debounceTimerRef.current = setTimeout(() => {
      // Add to queue to serialize requests
      updateQueueRef.current = updateQueueRef.current.then(async () => {
        if (!pendingUpdateRef.current) return;

        const itemsToSave = pendingUpdateRef.current;
        pendingUpdateRef.current = null;

        setSaving(true);
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);
          
          const { error } = await supabase
            .from('shopping_lists')
            .update({
              items: itemsToSave as any,
              updated_at: new Date().toISOString()
            })
            .eq('id', listId)
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);

          if (error) throw error;
          
          // Update cache on success
          if (cacheRef.current) {
            cacheRef.current.items = itemsToSave;
            cacheRef.current.timestamp = Date.now();
          }
          
          hasPendingLocalChangesRef.current = false;
        } catch (err: any) {
          console.error('Error saving shopping list:', err);
          
          // Rollback on error - restore from cache
          if (cacheRef.current) {
            setShoppingList(cacheRef.current.items);
            toast({
              title: "Couldn't save changes",
              description: "Changes reverted. Check connection.",
              variant: "destructive",
            });
          }
        } finally {
          setSaving(false);
        }
      });
    }, 1000); // 1 second debounce
  }, [user, listId, toast]);

  // Initialize
  useEffect(() => {
    if (user) {
      fetchShoppingList();
      
      // Set up realtime subscription with debouncing
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
            
            // Clear existing debounce timer
            if (realtimeDebounceRef.current) {
              clearTimeout(realtimeDebounceRef.current);
            }
            
            // Debounce realtime updates to prevent rapid-fire overwrites
            realtimeDebounceRef.current = setTimeout(() => {
              // Only apply remote changes if no local changes are pending
              if (!hasPendingLocalChangesRef.current && payload.eventType === 'UPDATE' && payload.new) {
                const newItems = (payload.new as any).items || [];
                setShoppingList(newItems);
                
                // Update cache
                if (cacheRef.current) {
                  cacheRef.current.items = newItems;
                  cacheRef.current.timestamp = Date.now();
                }
              }
            }, REALTIME_DEBOUNCE);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        if (realtimeDebounceRef.current) {
          clearTimeout(realtimeDebounceRef.current);
        }
      };
    } else {
      loadFromLocalStorage();
      setLoading(false);
    }
  }, [user]);

  // Optimistic update with rollback on error
  const updateShoppingList = useCallback((updater: (prev: ShoppingItem[]) => ShoppingItem[]) => {
    setShoppingList(prev => {
      const newList = updater(prev);
      
      if (user) {
        // Optimistic UI: Update immediately, queue save
        queuedSave(newList);
      } else {
        // Immediate save to localStorage for guests
        try {
          localStorage.setItem('shoppingList', JSON.stringify(newList));
        } catch (error) {
          console.error('Failed to save to localStorage:', error);
        }
      }
      
      return newList;
    });
  }, [user, queuedSave]);

  // Add items to shopping list
  const addItems = useCallback((newItems: Omit<ShoppingItem, 'id' | 'checked'>[]) => {
    updateShoppingList(prev => {
      const maxId = prev.length > 0 ? Math.max(...prev.map(i => i.id)) : 0;
      const itemsWithIds = newItems.map((item, index) => ({
        ...item,
        id: maxId + index + 1,
        checked: false,
      }));
      // Combine and deduplicate
      const combined = [...prev, ...itemsWithIds];
      const deduplicated = deduplicateShoppingList(combined);
      return deduplicated;
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
