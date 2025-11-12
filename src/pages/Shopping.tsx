import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { Printer, Store, Loader2, CheckCircle, Package, RefreshCw, AlertTriangle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useInstacart } from "@/hooks/useInstacart";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { PantryItem } from "@/types/pantry";
import { filterShoppingListByPantry } from "@/utils/pantryUtils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";
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

const StoreSelectionDialog = lazy(() => import("@/components/StoreSelectionDialog").then(m => ({ default: m.StoreSelectionDialog })));
const InstacartButton = lazy(() => import("@/components/InstacartButton").then(m => ({ default: m.InstacartButton })));
const InstacartAttribution = lazy(() => import("@/components/InstacartAttribution").then(m => ({ default: m.InstacartAttribution })));

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
    forceSync,
    addItems
  } = useShoppingList();
  
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [pantryLoading, setPantryLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [hidePantryItems, setHidePantryItems] = useState(true);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [creatingInstacartList, setCreatingInstacartList] = useState(false);
  const [swipedItemId, setSwipedItemId] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { toast } = useToast();
  const { createShoppingListLink } = useInstacart();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shoppingListRef = useRef(shoppingList);

  // Keep ref in sync with shopping list
  useEffect(() => {
    shoppingListRef.current = shoppingList;
  }, [shoppingList]);

  // Auto-remove specific recipes on mount
  useEffect(() => {
    const recipesToRemove = [
      "20 minute beef and broccoli recipe",
      "stuffed bell peppers x2"
    ];
    
    recipesToRemove.forEach(recipeTitle => {
      const itemsToRemove = shoppingList.filter(item => 
        item.recipes?.includes(recipeTitle)
      );
      
      if (itemsToRemove.length > 0) {
        itemsToRemove.forEach(item => removeFromList(item.id));
      }
    });
  }, []);

  // Load pantry items immediately (in parallel with shopping list)
  useEffect(() => {
    let isMounted = true;
    
    const loadPantryItems = async () => {
      console.log('🔄 === LOADING PANTRY ITEMS ===');
      console.log('🔄 User:', user?.id);
      
      if (!user) {
        console.log('❌ No user, clearing pantry');
        setPantryItems([]);
        setPantryLoading(false);
        return;
      }
      
      setPantryLoading(true);
      try {
        console.log('🔍 Fetching pantry from DB for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('pantry_items')
          .eq('id', user.id)
          .single();

        console.log('📦 Raw DB response:', data);
        console.log('📦 Raw pantry_items from DB:', data?.pantry_items);
        console.log('📦 DB error:', error);

        if (error) {
          console.error('❌ Error loading pantry:', error);
          throw error;
        }
        
        if (isMounted) {
          const items = data?.pantry_items || [];
          console.log('✅ Extracted items array:', items);
          console.log('✅ Items type:', typeof items, 'isArray:', Array.isArray(items));
          console.log('✅ Items length:', items.length);
          console.log('✅ Items contents:', JSON.stringify(items));
          
          console.log('🎯 CALLING setPantryItems with:', items);
          setPantryItems(items);
          
          console.log('🎯 CALLING setPantryLoading(false)');
          setPantryLoading(false);
        }
      } catch (error) {
        console.error('❌ Failed to load pantry items:', error);
        if (isMounted) {
          setPantryItems([]);
          setPantryLoading(false);
        }
      }
    };

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
              
              // Auto-remove matching items from shopping list (always sync on any pantry change)
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
                
                console.log(`Shopping list synced: removed ${removed.length} pantry items`);
                
                toast({
                  title: "Shopping list updated",
                  description: `Removed ${removed.length} item${removed.length > 1 ? 's' : ''} already in pantry`,
                });
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
  }, [user, toast, setList]);

  // Auto-filter shopping list by pantry (always on) + track hidden count
  const { displayList, hiddenCount } = useMemo(() => {
    console.log('');
    console.log('=== 📊 SHOPPING LIST FILTERING useMemo TRIGGERED ===');
    console.log('📊 pantryItems state:', pantryItems);
    console.log('📊 pantryItems length:', pantryItems?.length);
    console.log('📊 pantryItems type:', typeof pantryItems);
    console.log('📊 pantryItems is array?:', Array.isArray(pantryItems));
    console.log('📊 pantryItems contents:', JSON.stringify(pantryItems));
    console.log('📊 shoppingList length:', shoppingList?.length);
    console.log('📊 shoppingList items:', shoppingList.map(i => i.item));
    console.log('📊 hidePantryItems toggle:', hidePantryItems);
    
    // Always filter pantry items by default
    const pantryItemsFormatted: PantryItem[] = pantryItems.map(name => ({
      id: `pantry-${name}`,
      name,
      quantity: 1,
      unit: 'unit',
      category: 'other' as const,
      addedDate: new Date().toISOString(),
    }));

    console.log('🏪 Formatted pantry items:', pantryItemsFormatted.length, 'items');
    console.log('🏪 Formatted pantry names:', pantryItemsFormatted.map(p => p.name));

    console.log('🔧 Calling filterShoppingListByPantry...');
    const { filtered, removed } = filterShoppingListByPantry(shoppingList, pantryItemsFormatted);
    
    console.log('✅ Filter result - Kept:', filtered.length, filtered.map(i => i.item));
    console.log('❌ Filter result - Removed:', removed.length, removed.map(i => i.item));
    console.log('=== 📊 END FILTERING ===');
    console.log('');
    
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

  const handleSelectAll = () => {
    const allItemsChecked = displayList.every(item => item.checked);
    displayList.forEach(item => {
      if (allItemsChecked && item.checked) {
        toggleItem(item.id); // Uncheck all
      } else if (!allItemsChecked && !item.checked) {
        toggleItem(item.id); // Check all
      }
    });
  };

  const removeItem = (id: number) => {
    removeFromList(id);
    toast({ title: "Removed from shopping list" });
  };

  const removeRecipe = (recipeTitle: string) => {
    const itemsToRemove = shoppingList.filter(item => 
      item.recipes?.includes(recipeTitle)
    );
    
    itemsToRemove.forEach(item => removeFromList(item.id));
    
    toast({ 
      title: `Removed ${recipeTitle}`, 
      description: `${itemsToRemove.length} ingredient${itemsToRemove.length !== 1 ? 's' : ''} removed`
    });
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

  const handleShopOnline = async () => {
    // Create Instacart shopping list link
    if (displayList.length === 0) {
      toast({
        title: "Empty list",
        description: "Add items to your shopping list first",
        variant: "destructive"
      });
      return;
    }

    setCreatingInstacartList(true);
    try {
      const instacartUrl = await createShoppingListLink(displayList, "QuickDish Shopping List");
      
      if (instacartUrl) {
        // Open Instacart in new tab
        window.open(instacartUrl, '_blank');
        toast({
          title: "Opening Instacart",
          description: "Your shopping list has been loaded on Instacart",
        });
      }
    } catch (error) {
      console.error('Failed to create Instacart list:', error);
    } finally {
      setCreatingInstacartList(false);
    }
  };

  const handleShopOnlineOtherStores = () => {
    setShowStoreDialog(true);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent, itemId: number) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent, itemId: number) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (itemId: number) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Minimum swipe distance
    
    if (isLeftSwipe) {
      setSwipedItemId(itemId);
    } else {
      setSwipedItemId(null);
    }
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
  const isIndeterminate = checkedItems > 0 && checkedItems < totalItems;
  const isAllChecked = totalItems > 0 && checkedItems === totalItems;

  // Show loading screen immediately on first load
  if (loading && shoppingList.length === 0) {
    return <LoadingScreen message="Loading your shopping list..." delay={0} />;
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
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
            <div className="mb-3 p-2.5 bg-yellow-500/20 border border-yellow-300/30 rounded-lg flex items-start gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">
                  {syncError === 'timeout' && 'Working Offline'}
                  {syncError === 'conflict' && 'Data Conflict Detected'}
                  {syncError === 'error' && 'Working Offline'}
                  {syncError === 'no-cache' && 'Connection Issue'}
                </div>
                <div className="text-xs opacity-90">
                  {syncError === 'timeout' && 'Connection slow. Changes will sync when connection improves.'}
                  {syncError === 'conflict' && 'List was modified on another device. Click Force Sync to reload.'}
                  {syncError === 'error' && 'Changes will sync when connection improves.'}
                  {syncError === 'no-cache' && 'You can still add items. They\'ll sync when connection improves.'}
                </div>
              </div>
            </div>
          )}
          
          {/* Progress Bar */}
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
            {/* Shopping Modes Explanation */}
            <div className="px-5 pt-5">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded">
                <p className="text-sm font-semibold text-gray-800 mb-2">📋 Two ways to shop:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>
                      <strong>In-Store Shopping:</strong> Check off items as you collect them in the store
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🛒</span>
                    <span>
                      <strong>Instacart Delivery:</strong> Click the green button below to order everything online
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-card px-5 py-4 flex gap-3 border-b border-border">
              <div className="flex-1">
                <Suspense fallback={<Skeleton className="w-full h-10" />}>
                  <InstacartButton
                    onClick={handleShopOnline}
                    loading={creatingInstacartList}
                    disabled={displayList.length === 0}
                    className="w-full"
                  />
                </Suspense>
              </div>
              <button
                onClick={handlePrint}
                className="h-12 px-6 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all dark:bg-card dark:border-border dark:text-foreground dark:hover:bg-muted/50"
              >
                <Printer className="w-4 h-4 inline mr-2" />
                Print
              </button>
            </div>

            {/* Instacart Attribution */}
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-center">
                <Suspense fallback={<Skeleton className="w-10 h-10" />}>
                  <InstacartAttribution size="sm" />
                </Suspense>
              </div>
            </div>

            {/* In-Store Checklist Header */}
            <div className="px-5">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">🏪 In-Store Shopping Checklist</h2>
                <p className="text-sm text-gray-600 mb-4">Check items off as you shop</p>
              </div>
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
                Adjust Pantry
              </button>
            </div>

            {totalItems > 0 && (
              <div className="px-5 pt-3">
                <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-[#FF6B35] h-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {checkedItems} of {totalItems} items checked
                </p>
              </div>
            )}

            {/* Pantry Loading Screen */}
            {pantryLoading && user && <LoadingScreen message="Loading your pantry..." delay={0} />}

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
                <p className="text-muted-foreground text-lg mb-2">
                  All items are already in your pantry! 🎉
                </p>
                <p className="text-sm text-muted-foreground">
                  Toggle off "Hide pantry items" to see all items
                </p>
              </div>
            ) : (
              <>
                {/* Select All Checkbox */}
                <div className="bg-card px-5 py-4 border-b-2 border-border sticky top-0 z-20">
                  <div 
                    onClick={handleSelectAll}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`
                        w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                        ${isAllChecked
                          ? 'bg-[#FF6B35] border-[#FF6B35]' 
                          : isIndeterminate
                          ? 'bg-[#FF6B35]/50 border-[#FF6B35]'
                          : 'border-border group-hover:border-[#FF6B35]'
                        }
                      `}
                    >
                      {isAllChecked && (
                        <span className="text-white text-base font-bold">✓</span>
                      )}
                      {isIndeterminate && (
                        <span className="text-white text-base font-bold">−</span>
                      )}
                    </div>
                    <span className="text-base font-semibold text-foreground">
                      {isAllChecked ? 'Uncheck All' : 'Check All Items'}
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {checkedItems}/{totalItems}
                    </span>
                  </div>
                </div>

                {/* Category Sections */}
                {categorizedItems.map((category) => (
              <div key={category.name}>
                {/* Category Header - Sticky */}
                <div className="bg-muted px-5 py-3 font-bold text-xs uppercase tracking-wide text-muted-foreground border-t-2 border-border border-b border-border sticky top-0 z-10">
                  {category.emoji} {category.name} ({category.items.length})
                </div>

                {/* Items in Category */}
                <div className="bg-card">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden"
                    >
                      {/* Delete button background */}
                      {swipedItemId === item.id && (
                        <div 
                          className="absolute right-0 top-0 bottom-0 bg-red-500 flex items-center justify-center px-6 cursor-pointer"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      {/* Item content with swipe */}
                      <div
                        className={`flex items-center gap-4 px-5 py-4 border-b border-border hover:bg-muted/50 transition-all bg-card ${
                          swipedItemId === item.id ? '-translate-x-20' : 'translate-x-0'
                        }`}
                        onTouchStart={(e) => handleTouchStart(e, item.id)}
                        onTouchMove={(e) => handleTouchMove(e, item.id)}
                        onTouchEnd={() => handleTouchEnd(item.id)}
                      >
                        {/* Checkbox - 22px */}
                        <div
                          onClick={() => toggleItem(item.id)}
                          className={`
                            w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0
                            ${item.checked 
                              ? 'bg-[#FF6B35] border-[#FF6B35]' 
                              : 'border-border hover:border-[#FF6B35]'
                            }
                          `}
                        >
                          {item.checked && (
                            <span className="text-white text-base font-bold">✓</span>
                          )}
                        </div>
                        
                        {/* Item Content */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-base font-medium ${item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.amount && <span className="text-muted-foreground">{item.amount} </span>}
                            {item.item}
                          </div>
                          {item.recipes && item.recipes.length > 0 && (
                            <div className="inline-block mt-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs rounded">
                              For: {item.recipes.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions at Bottom */}
            {checkedItems > 0 && (
              <div className="bg-card px-5 py-4 border-t-2 border-border">
                <button
                  onClick={handleClearCompleted}
                  className="w-full h-11 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-all"
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
      
      <Suspense fallback={<LoadingScreen message="Loading store selection..." delay={0} />}>
        <StoreSelectionDialog
          open={showStoreDialog}
          onOpenChange={setShowStoreDialog}
        />
      </Suspense>
      
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