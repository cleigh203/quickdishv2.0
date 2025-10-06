import { useState, useEffect, useMemo, useRef } from "react";
import { Printer, Package, Store, Loader2, CheckCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PantryDialog } from "@/components/PantryDialog";
import { StoreSelectionDialog } from "@/components/StoreSelectionDialog";
import { useToast } from "@/hooks/use-toast";
import { useShoppingList } from "@/hooks/useShoppingList";
import { Switch } from "@/components/ui/switch";
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
import { PantryItem } from "@/types/pantry";
import { filterShoppingListByPantry, shoppingItemsToPantry } from "@/utils/pantryUtils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { shoppingList, loading, saving, toggleItem, removeItem: removeFromList, clearCompleted, clearAll, setList } = useShoppingList();
  
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [hidePantryItems, setHidePantryItems] = useState(false);
  const [isPantryDialogOpen, setIsPantryDialogOpen] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const { toast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load pantry items from Supabase
  useEffect(() => {
    const loadPantryItems = async () => {
      if (!user) {
        setPantryItems([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pantry_items')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setPantryItems(data?.pantry_items || []);
      } catch (error) {
        console.error('Error loading pantry items:', error);
      }
    };

    loadPantryItems();
  }, [user]);

  // Reload pantry when dialog closes
  const handlePantryDialogChange = async (open: boolean) => {
    setIsPantryDialogOpen(open);
    
    if (!open && user) {
      // Reload pantry items when dialog closes
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pantry_items')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setPantryItems(data?.pantry_items || []);
      } catch (error) {
        console.error('Error reloading pantry items:', error);
      }
    }
  };

  // Filter shopping list by pantry using useMemo
  const { displayList, hiddenCount } = useMemo(() => {
    if (!hidePantryItems) {
      return { 
        displayList: shoppingList, 
        hiddenCount: 0 
      };
    }

    // Convert string array to PantryItem format for filtering
    const pantryItemsFormatted: PantryItem[] = pantryItems.map(name => ({
      id: `pantry-${name}`,
      name,
      quantity: 1,
      unit: 'unit',
      category: 'other' as const,
      addedDate: new Date().toISOString(),
    }));

    const { filtered, removed } = filterShoppingListByPantry(shoppingList, pantryItemsFormatted);
    return { 
      displayList: filtered, 
      hiddenCount: removed.length 
    };
  }, [shoppingList, pantryItems, hidePantryItems]);

  // Check for all items checked with debounce
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const allChecked = displayList.length > 0 && displayList.every(item => item.checked);
    
    if (allChecked && !showClearDialog) {
      // Wait 1 second before showing modal
      debounceTimerRef.current = setTimeout(() => {
        setShowClearDialog(true);
      }, 1000);
    } else if (!allChecked && showClearDialog) {
      // Auto-close modal if user unchecks an item
      setShowClearDialog(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [displayList, showClearDialog]);

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

  const handleAddAllToPantry = async () => {
    if (!user) return;

    const checkedItems = shoppingList.filter(item => item.checked);
    const newPantryItemNames = checkedItems.map(item => item.item);
    const updatedPantry = [...pantryItems, ...newPantryItemNames];
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ pantry_items: updatedPantry })
        .eq('id', user.id);

      if (error) throw error;

      setPantryItems(updatedPantry);
      
      // Remove checked items from shopping list
      setList(shoppingList.filter(item => !item.checked));
      
      toast({ 
        title: `Added ${newPantryItemNames.length} items to pantry`,
        description: "Checked items removed from shopping list"
      });
    } catch (error) {
      console.error('Error adding to pantry:', error);
      toast({
        title: "Failed to add to pantry",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-gray-50">
        {/* Header with Orange Gradient */}
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white px-5 py-6">
          <h1 className="text-3xl font-bold mb-3">Shopping List</h1>
          
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
            <div className="bg-orange-50 px-5 py-3.5 border-b border-orange-200 flex items-center justify-between">
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
                onClick={() => setIsPantryDialogOpen(true)}
                className="text-sm font-medium text-[#FF6B35] hover:text-[#E55A2B] transition-colors"
              >
                <Package className="w-4 h-4 inline mr-1" />
                Manage Pantry
              </button>
            </div>

            {displayList.length === 0 ? (
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

                          {/* Add to Pantry Button - Only for checked items */}
                          {item.checked && (
                            <button
                              onClick={async () => {
                                if (!user) return;

                                const updatedPantry = [...pantryItems, item.item];
                                
                                try {
                                  const { error } = await supabase
                                    .from('profiles')
                                    .update({ pantry_items: updatedPantry })
                                    .eq('id', user.id);

                                  if (error) throw error;

                                  setPantryItems(updatedPantry);
                                  removeItem(item.id);
                                  toast({ 
                                    title: "Added to pantry",
                                    description: `${item.item} moved to your pantry`
                                  });
                                } catch (error) {
                                  console.error('Error adding to pantry:', error);
                                  toast({
                                    title: "Failed to add to pantry",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="text-xs text-[#FF6B35] font-medium hover:text-[#E55A2B] transition-colors flex-shrink-0"
                            >
                              <Package className="w-4 h-4 inline" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quick Actions at Bottom */}
                {checkedItems > 0 && (
                  <div className="bg-white px-5 py-4 border-t-2 border-gray-200 flex gap-3">
                  <button
                    onClick={handleClearCompleted}
                    className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    Clear Completed ({checkedItems})
                  </button>
                    <button
                      onClick={handleAddAllToPantry}
                      className="flex-1 h-11 bg-[#FF6B35] text-white rounded-xl font-medium hover:bg-[#E55A2B] transition-all"
                    >
                      <Package className="w-4 h-4 inline mr-2" />
                      Add All to Pantry
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      <PantryDialog 
        open={isPantryDialogOpen} 
        onOpenChange={handlePantryDialogChange}
      />

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
