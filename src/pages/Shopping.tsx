import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { toast } = useToast();

  // ✅ Save to localStorage in useEffect only (v7 compliant)
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

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

  const totalItems = shoppingList.length;
  const checkedItems = shoppingList.filter(item => item.checked).length;

  return (
    <>
      <div className="min-h-screen pb-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Shopping List</h1>
            <p className="text-muted-foreground">
              Your grocery list from recipes
            </p>
          </div>

        {totalItems > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {checkedItems} of {totalItems} items checked
                </span>
                <div className="flex gap-2">
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
        ) : (
          <div className="space-y-3">
            {shoppingList.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <div className={item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}>
                        <div className="font-medium">
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
      
      <BottomNav />
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
