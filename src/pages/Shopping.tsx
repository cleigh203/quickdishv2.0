import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Download, Package, Plus, X, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

const DEFAULT_PANTRY_ITEMS = ["Salt", "Black pepper", "Olive oil", "Garlic", "Onions"];
const QUICK_ADD_ITEMS = ["Flour", "Sugar", "Eggs", "Milk", "Butter", "Bread"];

const STORE_SECTIONS = [
  "Produce",
  "Fruits", 
  "Bakery",
  "Dairy",
  "Meat & Seafood",
  "Frozen",
  "Grains & Pasta",
  "Canned & Jarred",
  "Baking",
  "Spices & Seasonings",
  "Oils & Condiments",
  "Snacks",
  "Beverages",
  "Other"
];

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
  combinedAmounts?: string[];
}

const Shopping = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [newPantryItem, setNewPantryItem] = useState("");
  const [hidePantryItems, setHidePantryItems] = useState(true);
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadList = () => {
      const list = JSON.parse(localStorage.getItem('shoppingList') || '[]');
      setShoppingList(list);
    };
    
    const loadPantry = () => {
      const stored = localStorage.getItem('pantryItems');
      setPantryItems(stored ? JSON.parse(stored) : DEFAULT_PANTRY_ITEMS);
    };
    
    const loadFilter = () => {
      const stored = localStorage.getItem('hidePantryItems');
      setHidePantryItems(stored !== null ? JSON.parse(stored) : true);
    };
    
    loadList();
    loadPantry();
    loadFilter();
    
    window.addEventListener('storage', loadList);
    window.addEventListener('focus', loadList);
    
    return () => {
      window.removeEventListener('storage', loadList);
      window.removeEventListener('focus', loadList);
    };
  }, []);

  const parseQuantity = (amount: string): { value: number; unit: string; rest: string } => {
    if (!amount) return { value: 0, unit: '', rest: '' };
    
    const match = amount.match(/^(\d+\.?\d*|\d*\.?\d+)\s*([a-zA-Z]*)\s*(.*)/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2].toLowerCase(),
        rest: match[3]
      };
    }
    return { value: 0, unit: '', rest: amount };
  };

  const deduplicateItems = (items: ShoppingItem[]): ShoppingItem[] => {
    const itemMap = new Map<string, ShoppingItem>();
    
    items.forEach(item => {
      const normalizedName = item.item.toLowerCase().trim();
      
      if (itemMap.has(normalizedName)) {
        const existing = itemMap.get(normalizedName)!;
        
        // Combine recipes
        const recipes = [...new Set([...(existing.recipes || []), ...(item.recipes || [])])];
        
        // Try to combine amounts
        if (item.amount && existing.amount) {
          const parsed1 = parseQuantity(existing.amount);
          const parsed2 = parseQuantity(item.amount);
          
          if (parsed1.unit === parsed2.unit && parsed1.unit !== '') {
            const combined = parsed1.value + parsed2.value;
            existing.amount = `${combined} ${parsed1.unit} ${parsed1.rest}`.trim();
            existing.combinedAmounts = [...(existing.combinedAmounts || [existing.amount]), item.amount];
          } else {
            existing.combinedAmounts = [...(existing.combinedAmounts || [existing.amount]), item.amount];
          }
        }
        
        existing.recipes = recipes;
      } else {
        itemMap.set(normalizedName, { ...item });
      }
    });
    
    return Array.from(itemMap.values());
  };

  const categorizeItem = (itemName: string): string => {
    const name = itemName.toLowerCase();
    
    // Produce
    if (/(onion|garlic|potato|tomato|lettuce|carrot|celery|pepper|cucumber|spinach|kale|broccoli|cauliflower|cabbage|mushroom|zucchini|squash|eggplant|asparagus|green bean|pea)/i.test(name)) {
      return "Produce";
    }
    
    // Fruits
    if (/(apple|banana|orange|lemon|lime|berry|grape|melon|peach|pear|plum|cherry|mango|pineapple|avocado)/i.test(name)) {
      return "Fruits";
    }
    
    // Bakery
    if (/(bread|baguette|roll|croissant|bagel|muffin|tortilla|pita)/i.test(name)) {
      return "Bakery";
    }
    
    // Dairy
    if (/(milk|cream|cheese|butter|yogurt|egg|sour cream)/i.test(name)) {
      return "Dairy";
    }
    
    // Meat & Seafood
    if (/(chicken|beef|pork|turkey|lamb|fish|salmon|tuna|shrimp|prawn|crab|lobster|sausage|bacon|ham)/i.test(name)) {
      return "Meat & Seafood";
    }
    
    // Frozen
    if (/(frozen|ice cream)/i.test(name)) {
      return "Frozen";
    }
    
    // Grains & Pasta
    if (/(pasta|spaghetti|noodle|rice|quinoa|couscous|orzo|macaroni|penne|fettuccine)/i.test(name)) {
      return "Grains & Pasta";
    }
    
    // Canned & Jarred
    if (/(canned|jarred|can of|jar of|tomato sauce|tomato paste|broth|stock)/i.test(name)) {
      return "Canned & Jarred";
    }
    
    // Baking
    if (/(flour|sugar|baking powder|baking soda|yeast|vanilla|cocoa|chocolate chip)/i.test(name)) {
      return "Baking";
    }
    
    // Spices & Seasonings
    if (/(salt|pepper|spice|cumin|paprika|oregano|basil|thyme|rosemary|cinnamon|nutmeg|ginger|curry|chili)/i.test(name)) {
      return "Spices & Seasonings";
    }
    
    // Oils & Condiments
    if (/(oil|olive oil|vegetable oil|vinegar|soy sauce|ketchup|mustard|mayo|mayonnaise|sauce|dressing)/i.test(name)) {
      return "Oils & Condiments";
    }
    
    // Snacks
    if (/(chip|cracker|cookie|candy|popcorn|nut|pretzel)/i.test(name)) {
      return "Snacks";
    }
    
    // Beverages
    if (/(juice|soda|water|coffee|tea|wine|beer)/i.test(name)) {
      return "Beverages";
    }
    
    return "Other";
  };

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

  const clearCompleted = () => {
    const updated = shoppingList.filter(item => !item.checked);
    setShoppingList(updated);
    localStorage.setItem('shoppingList', JSON.stringify(updated));
    toast({ title: "Cleared completed items" });
  };

  const addPantryItem = () => {
    if (!newPantryItem.trim()) return;
    const updated = [...pantryItems, newPantryItem.trim()];
    setPantryItems(updated);
    localStorage.setItem('pantryItems', JSON.stringify(updated));
    setNewPantryItem("");
    toast({ title: "Added to pantry" });
  };

  const removePantryItem = (item: string) => {
    const updated = pantryItems.filter(i => i !== item);
    setPantryItems(updated);
    localStorage.setItem('pantryItems', JSON.stringify(updated));
  };

  const togglePantryFilter = (enabled: boolean) => {
    setHidePantryItems(enabled);
    localStorage.setItem('hidePantryItems', JSON.stringify(enabled));
  };

  const isPantryItem = (itemName: string) => {
    return pantryItems.some(p => 
      itemName.toLowerCase().includes(p.toLowerCase()) || 
      p.toLowerCase().includes(itemName.toLowerCase())
    );
  };

  const exportList = () => {
    const uncheckedItems = shoppingList.filter(item => !item.checked);
    const deduplicated = deduplicateItems(uncheckedItems);
    const filtered = hidePantryItems 
      ? deduplicated.filter(item => !isPantryItem(item.item))
      : deduplicated;
    
    // Organize by store sections
    const itemsBySection: { [key: string]: ShoppingItem[] } = {};
    
    filtered.forEach(item => {
      const section = categorizeItem(item.item);
      if (!itemsBySection[section]) {
        itemsBySection[section] = [];
      }
      itemsBySection[section].push(item);
    });

    const date = new Date().toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const totalItems = filtered.length;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>QuickDish Shopping List</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #1a1a1a;
            }
            .header {
              background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
              color: white;
              padding: 30px;
              border-radius: 16px;
              margin-bottom: 30px;
            }
            .header h1 {
              font-size: 32px;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .header .meta {
              font-size: 16px;
              opacity: 0.9;
              display: flex;
              gap: 20px;
            }
            .section {
              margin-bottom: 30px;
              break-inside: avoid;
            }
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #FF6B35;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px solid #FF6B35;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .item {
              display: flex;
              align-items: flex-start;
              padding: 12px;
              margin-bottom: 8px;
              background: #f8f8f8;
              border-radius: 8px;
              border-left: 3px solid #FF6B35;
            }
            .checkbox {
              width: 20px;
              height: 20px;
              border: 2px solid #FF6B35;
              border-radius: 4px;
              margin-right: 12px;
              flex-shrink: 0;
              margin-top: 2px;
            }
            .item-text {
              flex: 1;
              font-size: 16px;
              line-height: 1.5;
            }
            .amount {
              color: #666;
              font-weight: 500;
            }
            .recipes {
              color: #999;
              font-size: 14px;
              font-style: italic;
              margin-top: 4px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px dashed #ddd;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body { padding: 20px; }
              .header { break-inside: avoid; }
              .section { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🛒 QuickDish Shopping List</h1>
            <div class="meta">
              <span>📅 ${date}</span>
              <span>📦 ${totalItems} ${totalItems === 1 ? 'item' : 'items'} (duplicates combined)</span>
            </div>
          </div>

          ${STORE_SECTIONS
            .filter(section => itemsBySection[section]?.length > 0)
            .map(section => {
              const icon = {
                'Produce': '🥬',
                'Fruits': '🍎',
                'Bakery': '🥖',
                'Dairy': '🥛',
                'Meat & Seafood': '🥩',
                'Frozen': '❄️',
                'Grains & Pasta': '🍝',
                'Canned & Jarred': '🥫',
                'Baking': '🧁',
                'Spices & Seasonings': '🧂',
                'Oils & Condiments': '🫗',
                'Snacks': '🍿',
                'Beverages': '🥤',
                'Other': '📦'
              }[section] || '📦';
              
              return `
                <div class="section">
                  <div class="section-title">${icon} ${section.toUpperCase()}</div>
                  ${itemsBySection[section].map(item => `
                    <div class="item">
                      <div class="checkbox"></div>
                      <div class="item-text">
                        ${item.amount ? `<span class="amount">${item.amount}</span> ` : ''}${item.item}
                        ${item.recipes && item.recipes.length > 0 ? `
                          <div class="recipes">for: ${item.recipes.join(', ')}</div>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}

          ${hidePantryItems && pantryItems.length > 0 ? `
            <div class="footer">
              ✓ Pantry items excluded: ${pantryItems.join(', ')}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      
      printWindow.onload = () => {
        printWindow.print();
      };
    }

    toast({ title: "Opening print dialog..." });
  };

  const deduplicated = deduplicateItems(shoppingList);
  const filteredList = hidePantryItems 
    ? deduplicated.filter(item => !isPantryItem(item.item))
    : deduplicated;

  const hiddenCount = deduplicated.length - filteredList.length;
  const totalItems = filteredList.length;
  const checkedItems = filteredList.filter(item => item.checked).length;
  const progressPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
  const allComplete = totalItems > 0 && checkedItems === totalItems;

  return (
    <div className="min-h-screen pb-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShoppingCart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Shopping List</h1>
          <p className="text-muted-foreground">
            Smart deduplication • Organized by store sections
          </p>
        </div>

        {shoppingList.length > 0 && (
          <div className="flex gap-2 mb-4">
            <Button
              onClick={exportList}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsPantryOpen(!isPantryOpen)}
            >
              <Package className="mr-2 h-4 w-4" />
              Pantry
            </Button>
          </div>
        )}

        <Collapsible open={isPantryOpen} onOpenChange={setIsPantryOpen}>
          <CollapsibleContent>
            <Card className="mb-4 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Pantry Staples</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Items you always have at home - these will be hidden from your shopping list
                </p>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add pantry item..."
                    value={newPantryItem}
                    onChange={(e) => setNewPantryItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPantryItem()}
                  />
                  <Button onClick={addPantryItem} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {pantryItems.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current pantry:</p>
                    <div className="flex flex-wrap gap-2">
                      {pantryItems.map(item => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                          <button
                            onClick={() => removePantryItem(item)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ADD_ITEMS.filter(item => !pantryItems.includes(item)).map(item => (
                      <Button
                        key={item}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = [...pantryItems, item];
                          setPantryItems(updated);
                          localStorage.setItem('pantryItems', JSON.stringify(updated));
                          toast({ title: `Added ${item} to pantry` });
                        }}
                      >
                        + {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {shoppingList.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4 p-4 bg-card rounded-xl">
              <span className="text-sm font-medium">Hide pantry staples</span>
              <Switch
                checked={hidePantryItems}
                onCheckedChange={togglePantryFilter}
              />
            </div>

            {totalItems > 0 && (
              <Card className="mb-4 bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {checkedItems}/{totalItems}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </CardContent>
              </Card>
            )}

            {allComplete && (
              <Card className="mb-4 bg-primary/10 border-primary/20">
                <CardContent className="p-6 text-center">
                  <PartyPopper className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">🎉 Shopping Complete!</h3>
                  <p className="text-muted-foreground mb-4">
                    All items have been checked off
                  </p>
                  <Button onClick={clearCompleted} variant="outline">
                    Clear Completed Items
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {filteredList.map((item) => (
                <Card key={item.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <input 
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleItem(item.id)}
                          className="w-5 h-5 rounded border-border accent-primary cursor-pointer"
                        />
                        <div className={item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}>
                          <div className="font-medium">
                            {item.amount && <span className="text-muted-foreground">{item.amount} </span>}
                            {item.item}
                          </div>
                          {item.combinedAmounts && item.combinedAmounts.length > 1 && (
                            <div className="text-sm text-muted-foreground">
                              Combined: {item.combinedAmounts.join(' + ')}
                            </div>
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

            {hiddenCount > 0 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                ({hiddenCount} pantry {hiddenCount === 1 ? 'item' : 'items'} hidden)
              </div>
            )}

            {!allComplete && checkedItems > 0 && (
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={clearCompleted}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Completed ({checkedItems})
                </Button>
              </div>
            )}
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
