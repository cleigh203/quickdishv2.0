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

const CACHE_DURATION = 60 * 1000; // 60 seconds
const QUERY_TIMEOUT = 30000; // 30 seconds
const SAVE_DEBOUNCE = 1000; // 1 second debounce
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 2000;

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
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<ShoppingItem[] | null>(null);
  const cacheRef = useRef<ShoppingListCache | null>(null);
  const fetchInProgressRef = useRef(false);
  const isSavingRef = useRef(false); // Prevent overlapping saves

  // Retry logic with exponential backoff
  const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        const isLastAttempt = attempt === retries - 1;
        const isTimeout = error?.message?.includes('timeout') || error?.code === '57014';
        
        if (isLastAttempt || !isTimeout) {
          throw error;
        }
        
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  };

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

    if (fetchInProgressRef.current) return;

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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);
      
      const fetchOperation = async () => {
        const { data: lists, error: fetchError } = await supabase
          .from('shopping_lists')
          .select('id, items')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .abortSignal(controller.signal);

        if (fetchError) throw fetchError;
        return lists;
      };

      const lists = await retryWithBackoff(fetchOperation);
      clearTimeout(timeoutId);

      if (!lists || lists.length === 0) {
        const { data: newList, error: createError } = await supabase
          .from('shopping_lists')
          .insert({
            user_id: user.id,
            items: [] as any
          })
          .select('id, items')
          .single();

        if (createError) throw createError;
        
        console.log('✨ Created new shopping list');
        setListId(newList.id);
        setShoppingList([]);
        setSyncError(null);
        
        cacheRef.current = {
          items: [],
          listId: newList.id,
          timestamp: now,
        };
      } else {
        setListId(lists[0].id);
        const items = lists[0].items;
        let itemsArray = Array.isArray(items) ? items as unknown as ShoppingItem[] : [];
        
        // Apply deduplication when loading from database
        itemsArray = deduplicateShoppingList(itemsArray);
        
        console.log('📥 Loaded shopping list from DB');
        setShoppingList(itemsArray);
        setSyncError(null);
        
        cacheRef.current = {
          items: itemsArray,
          listId: lists[0].id,
          timestamp: now,
        };
      }
    } catch (err: any) {
      console.error('Error fetching shopping list:', err);
      
      const isTimeout = err?.code === '57014' || err?.message?.includes('timeout');
      
      if (cacheRef.current) {
        console.log('📦 Using cached data');
        setShoppingList(cacheRef.current.items);
        setListId(cacheRef.current.listId);
        setSyncError(isTimeout ? 'timeout' : 'error');
        
        toast({
          title: "Couldn't load shopping list",
          description: isTimeout 
            ? "Database timeout. Using cached data." 
            : "Using cached data. Check connection.",
          variant: "destructive",
        });
      } else {
        setSyncError('no-cache');
        toast({
          title: "Failed to load shopping list",
          description: "No cached data available. Check connection and try again.",
          variant: "destructive",
        });
      }
    } finally {
      fetchInProgressRef.current = false;
      setLoading(false);
    }
  };

  // FIXED: Simplified save without version conflict checking
  const debouncedSave = useCallback(async (items: ShoppingItem[]) => {
    if (!user || !listId) return;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Store pending update
    pendingUpdateRef.current = items;

    // Debounce the actual save
    debounceTimerRef.current = setTimeout(async () => {
      if (!pendingUpdateRef.current || isSavingRef.current) return;

      const itemsToSave = pendingUpdateRef.current;
      pendingUpdateRef.current = null;

      setSaving(true);
      isSavingRef.current = true;
      
      try {
        // Apply deduplication before saving
        const deduplicatedItems = deduplicateShoppingList(itemsToSave);
        
        const saveOperation = async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);
          
          // FIXED: Remove version-based conflict detection - just save
          const { error } = await supabase
            .from('shopping_lists')
            .update({
              items: deduplicatedItems as any,
              updated_at: new Date().toISOString()
            })
            .eq('id', listId)
            .eq('user_id', user.id) // Security check
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);

          if (error) throw error;
        };

        await retryWithBackoff(saveOperation);
        
        console.log('✅ Shopping list saved successfully');
        setSyncError(null);
        
        // Update cache
        if (cacheRef.current) {
          cacheRef.current.items = deduplicatedItems;
          cacheRef.current.timestamp = Date.now();
        }
      } catch (err: any) {
        console.error('Error saving shopping list:', err);
        
        const isTimeout = err?.code === '57014' || err?.message?.includes('timeout');
        
        // Rollback on error
        if (cacheRef.current) {
          setShoppingList(cacheRef.current.items);
          setSyncError(isTimeout ? 'timeout' : 'error');
          
          toast({
            title: "Couldn't save changes",
            description: isTimeout 
              ? "Database timeout. Changes reverted."
              : "Changes reverted. Check connection.",
            variant: "destructive",
          });
        }
      } finally {
        setSaving(false);
        isSavingRef.current = false;
      }
    }, SAVE_DEBOUNCE);
  }, [user, listId, toast]);

  // Initialize
  useEffect(() => {
    if (user) {
      fetchShoppingList();
      
      // Set up realtime subscription - simplified
      const channel = supabase
        .channel('shopping-list-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'shopping_lists',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('📡 Shopping list changed remotely');
            
            // Only apply remote changes if we're not currently saving
            if (!isSavingRef.current && payload.new) {
              const remoteItems = (payload.new as any).items || [];
              const deduplicatedRemoteItems = deduplicateShoppingList(remoteItems);
              
              setShoppingList(deduplicatedRemoteItems);
              
              if (cacheRef.current) {
                cacheRef.current.items = deduplicatedRemoteItems;
                cacheRef.current.timestamp = Date.now();
              }
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

  // Optimistic update
  const updateShoppingList = useCallback((updater: (prev: ShoppingItem[]) => ShoppingItem[]) => {
    setShoppingList(prev => {
      const newList = updater(prev);
      
      if (user) {
        // Optimistic UI: Update immediately, queue save
        debouncedSave(newList);
      } else {
        // Save to localStorage for guests
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

  // Set shopping list directly
  const setList = useCallback((newList: ShoppingItem[]) => {
    updateShoppingList(() => newList);
  }, [updateShoppingList]);

  // Replace list completely
  const replaceList = useCallback(async (newList: ShoppingItem[]) => {
    if (!user || !listId) {
      setList(newList);
      return;
    }

    setSaving(true);
    isSavingRef.current = true;
    
    try {
      const deduplicatedItems = deduplicateShoppingList(newList);
      
      const { error } = await supabase
        .from('shopping_lists')
        .update({
          items: deduplicatedItems as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('✅ Shopping list replaced successfully');
      setShoppingList(deduplicatedItems);
      setSyncError(null);

      if (cacheRef.current) {
        cacheRef.current.items = deduplicatedItems;
        cacheRef.current.timestamp = Date.now();
      }
    } catch (err: any) {
      console.error('Error replacing shopping list:', err);
      toast({
        title: "Couldn't update shopping list",
        description: "Please try again.",
        variant: "destructive",
      });
      await fetchShoppingList();
    } finally {
      setSaving(false);
      isSavingRef.current = false;
    }
  }, [user, listId, toast, fetchShoppingList, setList]);

  // Force sync
  const forceSync = useCallback(async () => {
    console.log('Force sync initiated - clearing cache');
    cacheRef.current = null;
    setSyncError(null);
    await fetchShoppingList();
    toast({
      title: "Synced successfully",
      description: "Shopping list refreshed from database",
    });
  }, [fetchShoppingList, toast]);

  return {
    shoppingList,
    loading,
    saving,
    syncError,
    addItems,
    toggleItem,
    removeItem,
    clearCompleted,
    clearAll,
    setList,
    replaceList,
    refetch: fetchShoppingList,
    forceSync,
  };
};