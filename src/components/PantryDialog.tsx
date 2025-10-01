import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PantryItem, PANTRY_CATEGORIES } from "@/types/pantry";
import { groupPantryByCategory } from "@/utils/pantryUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PantryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PantryDialog = ({ open, onOpenChange }: PantryDialogProps) => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pantryItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("unit");
  const [newItemCategory, setNewItemCategory] = useState<PantryItem['category']>("other");
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
  }, [pantryItems]);

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

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast({ title: "Please enter an item name", variant: "destructive" });
      return;
    }

    const newItem: PantryItem = {
      id: `pantry-${Date.now()}-${Math.random()}`,
      name: newItemName.trim(),
      quantity: parseFloat(newItemQuantity) || 1,
      unit: newItemUnit,
      category: newItemCategory,
      addedDate: new Date().toISOString(),
    };

    setPantryItems(prev => [...prev, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemUnit("unit");
    setNewItemCategory("other");
    toast({ title: "Item added to pantry" });
  };

  const handleDeleteItem = (id: string) => {
    setPantryItems(prev => prev.filter(item => item.id !== id));
    toast({ title: "Removed from pantry" });
  };

  const filteredItems = pantryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = groupPantryByCategory(filteredItems);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            My Pantry ({pantryItems.length} items)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pantry items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Add New Item */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Add New Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="w-20"
                  />
                  <Input
                    placeholder="Unit"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Select value={newItemCategory} onValueChange={(value: any) => setNewItemCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PANTRY_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddItem} className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pantry Items by Category */}
          {Object.keys(groupedItems).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No items found" : "Your pantry is empty. Add items to get started!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([category, items]) => {
                const categoryLabel = PANTRY_CATEGORIES.find(c => c.value === category)?.label || category;
                return (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        {categoryLabel}
                        <Badge variant="secondary">{items.length}</Badge>
                      </h3>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({item.quantity} {item.unit})
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
