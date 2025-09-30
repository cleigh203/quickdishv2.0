import { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { recipeStorage } from "@/utils/recipeStorage";
import { useToast } from "@/hooks/use-toast";

const Shopping = () => {
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadList = () => {
      const list = JSON.parse(localStorage.getItem('shoppingList') || '[]');
      setShoppingList(list);
    };
    
    loadList();
    window.addEventListener('storage', loadList);
    window.addEventListener('focus', loadList);
    
    return () => {
      window.removeEventListener('storage', loadList);
      window.removeEventListener('focus', loadList);
    };
  }, []);

  const toggleItem = (id: number) => {
    const updated = shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updated);
    localStorage.setItem('shoppingList', JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = shoppingList.filter(item => item.id !== id);
    setShoppingList(updated);
    localStorage.setItem('shoppingList', JSON.stringify(updated));
    toast({ title: "Removed from shopping list" });
  };

  const clearAll = () => {
    setShoppingList([]);
    localStorage.setItem('shoppingList', JSON.stringify([]));
    toast({ title: "Shopping list cleared" });
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShoppingCart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Shopping List</h1>
          <p className="text-muted-foreground">
            All your recipe ingredients in one place
          </p>
        </div>

        {shoppingList.length > 0 ? (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={clearAll}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>

            <div className="space-y-3">
              {shoppingList.map((item) => (
                <Card key={item.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <input 
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleItem(item.id)}
                          className="w-5 h-5 rounded border-border"
                        />
                        <div className={item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}>
                          <div className="font-medium">{item.item}</div>
                          {item.combinedAmounts && item.combinedAmounts.length > 1 ? (
                            <div className="text-sm text-muted-foreground">
                              {item.combinedAmounts.join(' + ')}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">{item.amount}</div>
                          )}
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
          </>
        ) : (
          <div className="text-center py-12 glass-card rounded-2xl">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Shopping list is empty</p>
            <p className="text-muted-foreground mt-2">
              Add ingredients from recipes to build your list
            </p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Shopping;
