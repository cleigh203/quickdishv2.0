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
    const list = recipeStorage.getShoppingList();
    setShoppingList(list);
  }, []);

  const removeItem = (recipeId: string) => {
    recipeStorage.removeFromShoppingList(recipeId);
    setShoppingList(recipeStorage.getShoppingList());
    toast({ title: "Removed from shopping list" });
  };

  const clearAll = () => {
    shoppingList.forEach(item => {
      recipeStorage.removeFromShoppingList(item.recipeId);
    });
    setShoppingList([]);
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

            <div className="space-y-6">
              {shoppingList.map((item) => {
                const recipe = recipeStorage.getRecipeById(item.recipeId);
                return (
                  <Card key={item.recipeId} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{recipe?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {recipe?.servings} servings
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.recipeId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      <ul className="space-y-2">
                        {item.ingredients.map((ing: any, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>
                              {ing.amount} {ing.unit} {ing.item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
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
