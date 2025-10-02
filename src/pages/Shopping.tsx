import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, Trash2, Printer, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { PantryDialog } from "@/components/PantryDialog";
import { StoreSelectionDialog } from "@/components/StoreSelectionDialog";
import { StoreShoppingView } from "@/components/StoreShoppingView";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

const Shopping = () => {
  // ✅ Lazy initialization for localStorage (v7 compliant)
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('shoppingList');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pantryItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [hidePantryItems, setHidePantryItems] = useState(false);
  const [isPantryDialogOpen, setIsPantryDialogOpen] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [showShoppingOverlay, setShowShoppingOverlay] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string>("");
  const { toast } = useToast();

  // ✅ Save to localStorage in useEffect only (v7 compliant)
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // ✅ Load pantry changes (v7 compliant)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('pantryItems');
        if (saved) {
          setPantryItems(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load pantry items:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ Check for all items checked in useEffect (v7 compliant)
  useEffect(() => {
    const allChecked = shoppingList.length > 0 && shoppingList.every(item => item.checked);
    if (allChecked && !showClearDialog) {
      setShowClearDialog(true);
    }
  }, [shoppingList, showClearDialog]);

  const toggleItem = (id: number) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
    toast({ title: "Removed from shopping list" });
  };

  const clearCompleted = () => {
    setShoppingList(prev => prev.filter(item => !item.checked));
    toast({ title: "Cleared completed items" });
  };

  const clearAll = () => {
    setShoppingList([]);
    setShowClearDialog(false);
    toast({ title: "Shopping list cleared!" });
  };

  const handlePrint = () => {
    window.print();
    toast({ title: "Print dialog opened" });
  };

  const handleAddAllToPantry = () => {
    const newPantryItems = shoppingItemsToPantry(shoppingList.filter(item => item.checked));
    const updatedPantry = [...pantryItems, ...newPantryItems];
    
    localStorage.setItem('pantryItems', JSON.stringify(updatedPantry));
    setPantryItems(updatedPantry);
    
    // Remove checked items from shopping list
    setShoppingList(prev => prev.filter(item => !item.checked));
    
    toast({ 
      title: `Added ${newPantryItems.length} items to pantry`,
      description: "Checked items removed from shopping list"
    });
  };

  const handleShopOnline = () => {
    setShowStoreDialog(true);
  };

  const handleStoreSelected = (url: string) => {
    setStoreUrl(url);
    setShowShoppingOverlay(true);
  };

  const handleItemChecked = (id: number) => {
    toggleItem(id);
  };

  const handleCloseShoppingView = () => {
    setShowShoppingOverlay(false);
    setStoreUrl("");
  };

  // Filter shopping list by pantry using useMemo
  const { displayList, hiddenCount } = useMemo(() => {
    if (!hidePantryItems) {
      return { 
        displayList: shoppingList, 
        hiddenCount: 0 
      };
    }

    const { filtered, removed } = filterShoppingListByPantry(shoppingList, pantryItems);
    return { 
      displayList: filtered, 
      hiddenCount: removed.length 
    };
  }, [shoppingList, pantryItems, hidePantryItems]);

  const totalItems = displayList.length;
  const checkedItems = displayList.filter(item => item.checked).length;

  return (
    <>
      <div className="min-h-screen pb-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center justify-center gap-4 mb-2">
              <h1 className="text-4xl font-bold">Shopping List</h1>
              {shoppingList.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShopOnline}
                  className="text-primary hover:text-primary"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Shop Online
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">
              Your grocery list from recipes
            </p>
          </div>

        {shoppingList.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4 mb-3">
                <span className="text-sm text-muted-foreground">
                  {checkedItems} of {totalItems} items checked
                </span>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPantryDialogOpen(true)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Pantry
                  </Button>
                  {checkedItems > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddAllToPantry}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Add to Pantry
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  {checkedItems > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCompleted}
                    >
                      Clear completed
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-3">
                  <Switch 
                    id="hide-pantry"
                    checked={hidePantryItems}
                    onCheckedChange={setHidePantryItems}
                  />
                  <Label htmlFor="hide-pantry" className="text-sm font-medium cursor-pointer">
                    Hide pantry staples
                  </Label>
                </div>
                {hidePantryItems && hiddenCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {hiddenCount} {hiddenCount === 1 ? 'item' : 'items'} in pantry - hidden
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {shoppingList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Your shopping list is empty. Add recipes with ingredients to get started!
              </p>
            </CardContent>
          </Card>
        ) : displayList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                All items are already in your pantry! 🎉
              </p>
              <p className="text-xs text-muted-foreground">
                Toggle off "Hide pantry staples" to see all items
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {displayList.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        <div className={item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}>
                          <div className="font-medium flex items-center gap-2">
                            {item.amount && <span className="text-muted-foreground">{item.amount} </span>}
                            {item.item}
                          </div>
                          {item.recipes && item.recipes.length > 0 && (
                            <div className="text-xs text-primary mt-1">
                              For: {item.recipes.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        )}
      </div>
      
      <PantryDialog 
        open={isPantryDialogOpen} 
        onOpenChange={setIsPantryDialogOpen}
      />

      <StoreSelectionDialog
        open={showStoreDialog}
        onOpenChange={setShowStoreDialog}
        onStoreSelected={handleStoreSelected}
      />

      {showShoppingOverlay && storeUrl && (
        <StoreShoppingView
          storeUrl={storeUrl}
          items={shoppingList}
          onClose={handleCloseShoppingView}
          onItemChecked={handleItemChecked}
        />
      )}
      
      {!showShoppingOverlay && <BottomNav />}
    </div>

    <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>All items checked! 🎉</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to clear your shopping list?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep List</AlertDialogCancel>
          <AlertDialogAction onClick={clearAll}>Clear List</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default Shopping;
