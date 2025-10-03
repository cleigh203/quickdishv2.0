import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError, retryOperation } from '@/utils/errorHandling';

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
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

    try {
      setLoading(true);
      
      // Get or create shopping list for user
      const { data: lists, error: fetchError } = await retryOperation(async () => {
        const result = await supabase
          .from('shopping_lists')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (result.error) throw result.error;
        return result;
      });

      if (fetchError) throw fetchError;

      if (!lists || lists.length === 0) {
        // Create new shopping list
        const { data: newList, error: createError } = await retryOperation(async () => {
          const result = await supabase
            .from('shopping_lists')
            .insert({
              user_id: user.id,
              items: [] as any
            })
            .select()
            .single();
          
          if (result.error) throw result.error;
          return result;
        });

        if (createError) throw createError;
        
        setListId(newList.id);
        setShoppingList([]);
      } else {
        setListId(lists[0].id);
        const items = lists[0].items;
        setShoppingList(Array.isArray(items) ? items as unknown as ShoppingItem[] : []);
      }
    } catch (err: any) {
      console.error('Error fetching shopping list:', err);
      toast({
        title: "Couldn't load shopping list",
        description: "Check connection and try again",
        variant: "destructive",
      });
    } finally {
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
        const { error } = await retryOperation(async () => {
          const result = await supabase
            .from('shopping_lists')
            .update({
              items: pendingUpdateRef.current as any,
              updated_at: new Date().toISOString()
            })
            .eq('id', listId);
          
          if (result.error) throw result.error;
          return result;
        });

        if (error) throw error;
        
        pendingUpdateRef.current = null;
      } catch (err: any) {
        console.error('Error saving shopping list:', err);
        const errorInfo = handleSupabaseError(err);
        toast({
          title: errorInfo.title,
          description: errorInfo.description,
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
