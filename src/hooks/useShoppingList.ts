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
const QUERY_TIMEOUT = 30000; // 30 seconds (increased for critical data)
const REALTIME_DEBOUNCE = 500; // 500ms debounce for realtime updates
const MAX_RETRIES = 3; // Maximum retry attempts
const RETRY_BASE_DELAY = 2000; // 2 seconds base delay for exponential backoff

interface ShoppingListCache {
  items: ShoppingItem[];
  listId: string | null;
  timestamp: number;
  version: number; // Track version for conflict detection
}

export const useShoppingList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listId, setListId] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<ShoppingItem[] | null>(null);
  const cacheRef = useRef<ShoppingListCache | null>(null);
  const fetchInProgressRef = useRef(false);
  
  // Request queue for serializing updates
  const updateQueueRef = useRef<Promise<void>>(Promise.resolve());
  const realtimeDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const hasPendingLocalChangesRef = useRef(false);

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
        
        // Exponential backoff: 2s, 4s, 8s
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
      
      // Get or create shopping list for user - with retry logic
      const fetchOperation = async () => {
        const { data: lists, error: fetchError } = await supabase
          .from('shopping_lists')
          .select('id, items, version')
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
        // Create new shopping list
        const { data: newList, error: createError } = await supabase
          .from('shopping_lists')
          .insert({
            user_id: user.id,
            items: [] as any
          })
          .select('id, items, version')
          .single();

        if (createError) throw createError;
        
        setListId(newList.id);
        setShoppingList([]);
        setCurrentVersion(newList.version || 1);
        setSyncError(null);
        
        // Update cache
        cacheRef.current = {
          items: [],
          listId: newList.id,
          timestamp: now,
          version: newList.version || 1,
        };
      } else {
        setListId(lists[0].id);
        const items = lists[0].items;
        let itemsArray = Array.isArray(items) ? items as unknown as ShoppingItem[] : [];
        
        // CRITICAL FIX #3: Apply deduplication when loading FROM database
        itemsArray = deduplicateShoppingList(itemsArray);
        
        setShoppingList(itemsArray);
        setCurrentVersion(lists[0].version || 1);
        setSyncError(null);
        
        // Update cache
        cacheRef.current = {
          items: itemsArray,
          listId: lists[0].id,
          timestamp: now,
          version: lists[0].version || 1,
        };
      }
    } catch (err: any) {
      console.error('Error fetching shopping list:', err);
      
      // CRITICAL FIX #2: Check for data corruption
      const isTimeout = err?.code === '57014' || err?.message?.includes('timeout');
      
      if (cacheRef.current) {
        // Use cached data but warn user
        setShoppingList(cacheRef.current.items);
        setListId(cacheRef.current.listId);
        setCurrentVersion(cacheRef.current.version);
        setSyncError(isTimeout ? 'timeout' : 'error');
        
        toast({
          title: "Couldn't load shopping list",
          description: isTimeout 
            ? "Database timeout. Using cached data. Try Force Sync." 
            : "Using cached data. Check connection.",
          variant: "destructive",
        });
      } else {
        // No cache available - critical error
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
          // CRITICAL FIX #3: Apply deduplication before saving TO database
          const deduplicatedItems = deduplicateShoppingList(itemsToSave);
          
          // CRITICAL FIX #5: Retry with exponential backoff
          const saveOperation = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);
            
            // CRITICAL FIX #4: Version-based conflict detection
            const { data, error } = await supabase
              .from('shopping_lists')
              .update({
                items: deduplicatedItems as any,
                updated_at: new Date().toISOString()
              })
              .eq('id', listId)
              .eq('version', currentVersion) // Check version to prevent conflicts
              .select('version')
              .abortSignal(controller.signal);

            clearTimeout(timeoutId);

            if (error) throw error;
            return data;
          };

          const result = await retryWithBackoff(saveOperation);
          
          if (!result || result.length === 0) {
            // Version conflict detected - data changed by another client
            throw new Error('Version conflict');
          }
          
          // Update version and cache on success
          const newVersion = result[0].version;
          setCurrentVersion(newVersion);
          setSyncError(null);
          
          if (cacheRef.current) {
            cacheRef.current.items = deduplicatedItems;
            cacheRef.current.timestamp = Date.now();
            cacheRef.current.version = newVersion;
          }
          
          hasPendingLocalChangesRef.current = false;
        } catch (err: any) {
          console.error('Error saving shopping list:', err);
          
          const isVersionConflict = err?.message === 'Version conflict';
          const isTimeout = err?.code === '57014' || err?.message?.includes('timeout');
          
          if (isVersionConflict) {
            // CRITICAL FIX #4: Handle version conflict - refetch and merge
            setSyncError('conflict');
            toast({
              title: "List changed by another device",
              description: "Refreshing to get latest version...",
              variant: "destructive",
            });
            // Force refetch to get latest version
            await fetchShoppingList();
          } else {
            // CRITICAL FIX #2: Rollback on error with clear messaging
            if (cacheRef.current) {
              setShoppingList(cacheRef.current.items);
              setSyncError(isTimeout ? 'timeout' : 'error');
              
              toast({
                title: "Couldn't save changes",
                description: isTimeout 
                  ? "Database timeout. Changes reverted. Try Force Sync."
                  : "Changes reverted. Check connection.",
                variant: "destructive",
              });
            }
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
              // CRITICAL FIX #4: Version-based conflict detection for realtime
              if (!hasPendingLocalChangesRef.current && payload.eventType === 'UPDATE' && payload.new) {
                const remoteVersion = (payload.new as any).version || 1;
                const remoteItems = (payload.new as any).items || [];
                
                // Only apply if remote version is newer
                if (remoteVersion > currentVersion) {
                  console.log(`Applying remote update (v${currentVersion} → v${remoteVersion})`);
                  
                  // Apply deduplication to remote data
                  const deduplicatedRemoteItems = deduplicateShoppingList(remoteItems);
                  
                  setShoppingList(deduplicatedRemoteItems);
                  setCurrentVersion(remoteVersion);
                  
                  // Update cache
                  if (cacheRef.current) {
                    cacheRef.current.items = deduplicatedRemoteItems;
                    cacheRef.current.timestamp = Date.now();
                    cacheRef.current.version = remoteVersion;
                  }
                } else {
                  console.log(`Ignoring stale remote update (v${remoteVersion} <= v${currentVersion})`);
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

  // CRITICAL FIX #2: Force sync to clear cache and refetch
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
    refetch: fetchShoppingList,
    forceSync,
  };
};
