import { useState, useEffect } from "react";
import { Package, Plus, Search, Trash2, Minus, Camera, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PantryItem, PANTRY_CATEGORIES, PantryCategory } from "@/types/pantry";
import { groupPantryByCategory } from "@/utils/pantryUtils";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ManualBarcodeEntry } from "@/components/ManualBarcodeEntry";
import { useProductLookup } from "@/hooks/useProductLookup";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";

const Pantry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { lookupProduct, loading: lookingUpProduct } = useProductLookup();

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isManualBarcodeOpen, setIsManualBarcodeOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "1",
    unit: "unit",
    category: "other" as PantryCategory,
    barcode: "",
  });

  // Load pantry items from Supabase on mount
  useEffect(() => {
    const loadPantryItems = async () => {
      if (!user) {
        setPantryItems([]);
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Loading pantry items from database for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('pantry_items')
          .eq('id', user.id)
          .single();

        console.log('📦 Raw pantry data from DB:', data);

        if (error) throw error;

        // Convert string array from DB to PantryItem objects
        const items = (data?.pantry_items || []).map((name: string, index: number) => ({
          id: `pantry-${Date.now()}-${index}`,
          name,
          quantity: 1,
          unit: 'unit',
          category: 'other' as PantryCategory,
          addedDate: new Date().toISOString(),
        }));

        console.log('✅ Loaded pantry items:', items.length, 'items');
        setPantryItems(items);
      } catch (error) {
        console.error('❌ Error loading pantry items:', error);
        setPantryItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadPantryItems();
  }, [user]);

  // Save pantry items to Supabase whenever they change
  useEffect(() => {
    const savePantryItems = async () => {
      if (!user || loading) return; // Don't save during initial load

      try {
        // Convert PantryItem objects to simple string array for DB
        const itemNames = pantryItems.map(item => item.name);
        
        console.log('💾 Saving pantry items to DB:', itemNames);

        const { data, error } = await supabase
          .from('profiles')
          .update({ pantry_items: itemNames })
          .eq('id', user.id)
          .select();

        if (error) throw error;

        console.log('💾 Save result - success:', data);
      } catch (error) {
        console.error('❌ Error saving pantry items:', error);
        toast({
          title: "Error saving pantry",
          description: "Your changes may not be saved. Please try again.",
          variant: "destructive",
        });
      }
    };

    savePantryItems();
  }, [pantryItems, user, loading]);

  // Event handlers
  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({ title: "Please enter an item name", variant: "destructive" });
      return;
    }

    const item: PantryItem = {
      id: `pantry-${Date.now()}-${Math.random()}`,
      name: newItem.name.trim(),
      quantity: parseFloat(newItem.quantity) || 1,
      unit: newItem.unit,
      category: newItem.category,
      addedDate: new Date().toISOString(),
      barcode: newItem.barcode || undefined,
    };

    console.log('➕ Adding item to pantry:', item.name);
    setPantryItems(prev => [...prev, item]);
    toast({ title: `Added ${item.name} to pantry` });

    // Reset form
    setNewItem({
      name: "",
      quantity: "1",
      unit: "unit",
      category: "other",
      barcode: "",
    });
    setScannedBarcode("");
    setIsAddDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const item = pantryItems.find(i => i.id === id);
    console.log('🗑️ Removing item from pantry:', item?.name);
    setPantryItems(prev => prev.filter(item => item.id !== id));
    toast({ title: "Removed from pantry" });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setPantryItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        if (newQuantity === 0) {
          toast({ title: "Item quantity is now 0 - consider removing it" });
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleBulkDelete = () => {
    console.log('🗑️ Clearing entire pantry');
    setPantryItems([]);
    toast({ title: "Cleared entire pantry" });
  };

  const handleBarcodeScan = async (barcode: string) => {
    setScannedBarcode(barcode);
    toast({ title: "Looking up product...", description: `Barcode: ${barcode}` });

    const productInfo = await lookupProduct(barcode);

    if (productInfo) {
      // Auto-fill the form with product info
      setNewItem({
        name: productInfo.brand 
          ? `${productInfo.brand} ${productInfo.name}`
          : productInfo.name,
        quantity: "1",
        unit: "unit",
        category: productInfo.category,
        barcode: barcode,
      });
      setIsAddDialogOpen(true);
      toast({
        title: "✓ Product found!",
        description: `${productInfo.name} - Barcode: ${barcode}`,
      });
    } else {
      // Product not found, open dialog with manual entry
      setNewItem({
        name: "",
        quantity: "1",
        unit: "unit",
        category: "other",
        barcode: barcode,
      });
      setIsAddDialogOpen(true);
      toast({
        title: "Product not found",
        description: `Barcode ${barcode} - Please enter details manually`,
        variant: "destructive",
      });
    }
  };

  // Filter items
  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = groupPantryByCategory(filteredItems);

  return (
    <div className="min-h-screen pb-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Pantry</h1>
          <p className="text-muted-foreground">
            Track what you have to optimize shopping
          </p>
        </div>

        {/* Search and filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search pantry items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {PANTRY_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Pantry Item</DialogTitle>
                <DialogDescription>
                  {scannedBarcode 
                    ? `Product scanned - Barcode: ${scannedBarcode}`
                    : "Add an item to your pantry inventory"
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {scannedBarcode && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Barcode className="w-4 h-4 text-primary" />
                      <span className="font-mono font-semibold">{scannedBarcode}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Chicken breast"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="0.1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="e.g., lbs, cups"
                      value={newItem.unit}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value as PantryCategory }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PANTRY_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add to Pantry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => setIsManualBarcodeOpen(true)}
          >
            <Barcode className="w-4 h-4 mr-2" />
            Enter Barcode
          </Button>
        </div>

        {/* Barcode Scanner */}
        <BarcodeScanner
          open={isScannerOpen}
          onOpenChange={setIsScannerOpen}
          onScan={handleBarcodeScan}
        />

        {/* Manual Barcode Entry */}
        <ManualBarcodeEntry
          open={isManualBarcodeOpen}
          onOpenChange={setIsManualBarcodeOpen}
          onSubmit={handleBarcodeScan}
        />

        {/* Pantry items */}
        {loading ? (
          <LoadingScreen message="Loading your pantry..." />
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {pantryItems.length === 0
                  ? "Your pantry is empty. Add items to track your inventory!"
                  : "No items match your search."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => {
              const categoryLabel = PANTRY_CATEGORIES.find(c => c.value === category)?.label || category;
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{categoryLabel}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit}
                            {item.barcode && (
                              <span className="ml-2 text-xs font-mono opacity-60">
                                • {item.barcode}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {pantryItems.length > 0 && (
          <>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Total items: {pantryItems.length}
            </div>
            <div className="mt-6">
              <Button 
                variant="destructive" 
                onClick={handleBulkDelete}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Items
              </Button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Pantry;
