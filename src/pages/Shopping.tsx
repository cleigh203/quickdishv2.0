import { useState, useEffect, useMemo, useRef } from "react";
import { Printer, Store, Loader2, CheckCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { StoreSelectionDialog } from "@/components/StoreSelectionDialog";
import { useToast } from "@/hooks/use-toast";
import { useShoppingList } from "@/hooks/useShoppingList";
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
  const { shoppingList, loading, toggleItem, removeItem: removeFromList, clearCompleted, clearAll } = useShoppingList();
  
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const { toast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for all items checked with debounce
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const allChecked = shoppingList.length > 0 && shoppingList.every(item => item.checked);
    
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
  }, [shoppingList, showClearDialog]);

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
    
    shoppingList.forEach(item => {
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
  }, [shoppingList]);

  const totalItems = shoppingList.length;
  const checkedItems = shoppingList.filter(item => item.checked).length;
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