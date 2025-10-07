import { useState, useEffect, useMemo, useRef } from "react";
import { Printer, Store, Loader2, CheckCircle, Package, RefreshCw, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { StoreSelectionDialog } from "@/components/StoreSelectionDialog";
import { useToast } from "@/hooks/use-toast";
import { useShoppingList } from "@/hooks/useShoppingList";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { PantryItem } from "@/types/pantry";
import { filterShoppingListByPantry } from "@/utils/pantryUtils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

interface Category {
  emoji: string;
  name: string;
  items: ShoppingItem[];
}

const categorizeItem = (itemName: string): { emoji: string; name: string } => {
  const name = itemName.toLowerCase();
  
  if (name.includes('beef') || name.includes('chicken') || name.includes('pork') || name.includes('steak') || name.includes('fish') || name.includes('shrimp') || name.includes('salmon') || name.includes('turkey') || name.includes('lamb')) {
    return { emoji: '🥩', name: 'PROTEINS' };
  }
  if (name.includes('cheese') || name.includes('milk') || name.includes('butter') || name.includes('cream') || name.includes('yogurt') || name.includes('sour cream')) {
    return { emoji: '🧀', name: 'DAIRY' };
  }
  if (name.includes('lettuce') || name.includes('tomato') || name.includes('pepper') || name.includes('onion') || name.includes('apple') || name.includes('banana') || name.includes('carrot') || name.includes('broccoli') || name.includes('spinach') || name.includes('avocado') || name.includes('cucumber') || name.includes('mushroom')) {
    return { emoji: '🥬', name: 'PRODUCE' };
  }
  if (name.includes('pasta') || name.includes('rice') || name.includes('bread') || name.includes('tortilla') || name.includes('noodle') || name.includes('bun')) {
    return { emoji: '🌾', name: 'GRAINS & BREAD' };
  }
  if (name.includes('salt') || name.includes('pepper') || name.includes('garlic') || name.includes('basil') || name.includes('cumin') || name.includes('oregano') || name.includes('thyme') || name.includes('paprika') || name.includes('cinnamon')) {
    return { emoji: '🌶️', name: 'SPICES & HERBS' };
  }
  if (name.includes('oil') || name.includes('sauce') || name.includes('flour') || name.includes('sugar') || name.includes('vinegar') || name.includes('stock') || name.includes('broth') || name.includes('can')) {
    return { emoji: '🥫', name: 'PANTRY' };
  }
  return { emoji: '🍖', name: 'OTHER' };
};

const Shopping = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    shoppingList, 
    loading, 
    syncError, 
    toggleItem, 
    removeItem: removeFromList, 
    clearCompleted, 
    clearAll, 
    setList,
    forceSync 
  } = useShoppingList();
  
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [hidePantryItems, setHidePantryItems] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const { toast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shoppingListRef = useRef(shoppingList);

  // Keep ref in sync with shopping list
  useEffect(() => {
    shoppingListRef.current = shoppingList;
  }, [shoppingList]);

  // Load pantry items AFTER shopping list loads (non-blocking)
  useEffect(() => {
    let isMounted = true;
    
    const loadPantryItems = async () => {
      if (!user) {
        setPantryItems([]);
        return;
      }
      
      // Wait until shopping list finishes loading
      if (loading) return;
      
      try {
        // Shorter timeout for pantry (non-critical data)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Pantry query timeout')), 3000)
        );
        
        const queryPromise = supabase
          .from('profiles')
          .select('pantry_items')
          .eq('id', user.id)
          .single();

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

        if (error) throw error;
        
        if (isMounted) {
          setPantryItems(data?.pantry_items || []);
        }
      } catch (error) {
        console.error('Error loading pantry items:', error);
        if (isMounted) {
          setPantryItems([]);
        }
      }
    };

    // Only load pantry after shopping list completes
    loadPantryItems();

    // Set up real-time subscription for pantry changes
    if (user) {
      const channel = supabase
        .channel('pantry-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            console.log('Pantry updated:', payload);
            if (payload.new && isMounted) {
              const newPantryItems = (payload.new as any).pantry_items || [];
              const oldPantryItems = pantryItems;
              
              setPantryItems(newPantryItems);
              
              // Auto-remove matching items from shopping list
              if (newPantryItems.length > oldPantryItems.length) {
                // Items were added to pantry, remove them from shopping list
                const pantryItemsFormatted: PantryItem[] = newPantryItems.map((name: string) => ({
                  id: `pantry-${name}`,
                  name,
                  quantity: 1,
                  unit: 'unit',
                  category: 'other' as const,
                  addedDate: new Date().toISOString(),
                }));

                const { filtered, removed } = filterShoppingListByPantry(shoppingListRef.current, pantryItemsFormatted);
                
                if (removed.length > 0) {
                  // Update shopping list to remove pantry items
                  setList(filtered);
                  
                  toast({
                    title: "Shopping list updated",
                    description: `Removed ${removed.length} item${removed.length > 1 ? 's' : ''} already in pantry`,
                  });
                }
              }
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, loading, toast]);

  // Auto-filter shopping list by pantry (always on) + track hidden count
  const { displayList, hiddenCount } = useMemo(() => {
    // Always filter pantry items by default
    const pantryItemsFormatted: PantryItem[] = pantryItems.map(name => ({
      id: `pantry-${name}`,
      name,
      quantity: 1,
      unit: 'unit',
      category: 'other' as const,
      addedDate: new Date().toISOString(),
    }));

    const { filtered, removed } = filterShoppingListByPantry(shoppingList, pantryItemsFormatted);
    
    // If toggle is OFF, show all items but still track what could be hidden
    if (!hidePantryItems) {
      return { 
        displayList: shoppingList, 
        hiddenCount: removed.length 
      };
    }

    // If toggle is ON, actually filter them out
    return { 
      displayList: filtered, 
      hiddenCount: removed.length 
    };
  }, [shoppingList, pantryItems, hidePantryItems]);

  // Check for all items checked with debounce (memoized to prevent loops)
  const allChecked = useMemo(() => 
    displayList.length > 0 && displayList.every(item => item.checked),
    [displayList]
  );

  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (allChecked && !showClearDialog) {
      // Wait 1 second before showing modal
      debounceTimerRef.current = setTimeout(() => {
        setShowClearDialog(true);
      }, 1000);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [allChecked]); // Only depend on allChecked, not showClearDialog to prevent loop

  const removeItem = (id: number) => {
    removeFromList(id);
    toast({ title: "Removed from shopping list" });
  };

  const handleClearCompleted = () => {
    clearCompleted();
    toast({ title: "Cleared completed items" });
  };

  const handleClearAll = () => {
    clearAll();
    setShowClearDialog(false);
    toast({ title: "Shopping list cleared!" });
  };

  const handlePrint = () => {
    window.print();
    toast({ title: "Print dialog opened" });
  };

  const handleShopOnline = () => {
    setShowStoreDialog(true);
  };

  // Group items by category
  const categorizedItems = useMemo(() => {
    const categories: { [key: string]: Category } = {};
    
    displayList.forEach(item => {
      const category = categorizeItem(item.item);
      const key = category.name;
      
      if (!categories[key]) {
        categories[key] = {
          emoji: category.emoji,
          name: category.name,
          items: []
        };
      }
      categories[key].items.push(item);
    });
    
    return Object.values(categories).sort((a, b) => a.name.localeCompare(b.name));
  }, [displayList]);

  const totalItems = displayList.length;
  const checkedItems = displayList.filter(item => item.checked).length;
  const progressPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <>
      <div className="min-h-screen pb-20 bg-gray-50">
        {/* Header with Orange Gradient */}
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white px-5 py-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold">Shopping List</h1>
            
            {/* Force Sync Button - shows when there's a sync error */}
            {syncError && (
              <button
                onClick={forceSync}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
                title="Force refresh from database"
              >
                <RefreshCw className="w-4 h-4" />
                Force Sync
              </button>
            )}
          </div>
          
          {/* Sync Error Warning */}
          {syncError && (
            <div className="mb-3 p-2.5 bg-red-500/20 border border-red-300/30 rounded-lg flex items-start gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">
                  {syncError === 'timeout' && 'Database Timeout'}
                  {syncError === 'conflict' && 'Data Conflict Detected'}
                  {syncError === 'error' && 'Sync Error'}
                  {syncError === 'no-cache' && 'No Cached Data'}
                </div>
                <div className="text-xs opacity-90">
                  {syncError === 'timeout' && 'Using cached data. Click Force Sync to retry.'}
                  {syncError === 'conflict' && 'List was modified on another device.'}
                  {syncError === 'error' && 'Changes may not be saved. Check connection.'}
                  {syncError === 'no-cache' && 'Unable to load list. Check connection and retry.'}
                </div>
              </div>
            </div>
          )}
          
          {/* Progress Bar */}
          {totalItems > 0 && (
            <>
              <div className="bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-white h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              {/* Stats */}
              <p className="text-sm opacity-90">
                {checkedItems} of {totalItems} items checked
              </p>
            </>
          )}
        </div>

        {shoppingList.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-lg">
              Your shopping list is empty. Add recipes with ingredients to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="bg-white px-5 py-4 flex gap-3 border-b border-gray-200">
              <button
                onClick={handleShopOnline}
                className="flex-1 h-12 bg-[#FF6B35] text-white rounded-xl font-semibold text-base shadow-md hover:bg-[#E55A2B] transition-all"
              >
                <Store className="w-4 h-4 inline mr-2" />
                Shop Online
              </button>
              <button
                onClick={handlePrint}
                className="h-12 px-6 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Printer className="w-4 h-4 inline mr-2" />
                Print
              </button>
            </div>

            {/* Pantry Toggle */}
            <div className="bg-orange-50 px-5 py-3.5 border-b border-orange-200 flex items-center justify-between" data-pantry-toggle>
              <div className="flex items-center gap-3">
                <Switch
                  id="hide-pantry"
                  checked={hidePantryItems}
                  onCheckedChange={setHidePantryItems}
                  className="data-[state=checked]:bg-[#FF6B35]"
                />
                <span className="text-sm font-medium text-orange-800">
                  Hide pantry items {hiddenCount > 0 && `(${hiddenCount})`}
                </span>
              </div>
              <button
                onClick={() => navigate('/pantry')}
                className="text-sm font-medium text-[#FF6B35] hover:text-[#E55A2B] transition-colors"
              >
                <Package className="w-4 h-4 inline mr-1" />
                Adjust in Profile
              </button>
            </div>

            {loading ? (
              // Show skeleton loaders while loading
              <div className="px-5 py-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-7 h-7 rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayList.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-gray-600 text-lg mb-2">
                  All items are already in your pantry! 🎉
                </p>
                <p className="text-sm text-gray-500">
                  Toggle off "Hide pantry items" to see all items
                </p>
              </div>
            ) : (
              <>
                {/* Category Sections */}
                {categorizedItems.map((category) => (
              <div key={category.name}>
                {/* Category Header - Sticky */}
                <div className="bg-gray-50 px-5 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 border-t-2 border-gray-200 border-b border-gray-200 sticky top-0 z-10">
                  {category.emoji} {category.name} ({category.items.length})
                </div>

                {/* Items in Category */}
                <div className="bg-white">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Checkbox - 22px */}
                      <div
                        onClick={() => toggleItem(item.id)}
                        className={`
                          w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0
                          ${item.checked 
                            ? 'bg-[#FF6B35] border-[#FF6B35]' 
                            : 'border-gray-300 hover:border-[#FF6B35]'
                          }
                        `}
                      >
                        {item.checked && (
                          <span className="text-white text-base font-bold">✓</span>
                        )}
                      </div>
                      
                      {/* Item Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-base font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {item.amount && <span className="text-gray-500">{item.amount} </span>}
                          {item.item}
                        </div>
                        {item.recipes && item.recipes.length > 0 && (
                          <div className="inline-block mt-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">
                            For: {item.recipes.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions at Bottom */}
            {checkedItems > 0 && (
              <div className="bg-white px-5 py-4 border-t-2 border-gray-200">
                <button
                  onClick={handleClearCompleted}
                  className="w-full h-11 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Clear Completed ({checkedItems})
                </button>
              </div>
            )}
          </>
        )}
          </>
        )}
      </div>
      
      <StoreSelectionDialog
        open={showStoreDialog}
        onOpenChange={setShowStoreDialog}
      />
      
      <BottomNav />

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <AlertDialogTitle className="text-2xl">Shopping Complete!</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              All items checked off. Clear your list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">
              Keep List
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAll}
              className="bg-[#FF6B35] text-white hover:bg-[#E55A2B]"
            >
              Clear List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Shopping;