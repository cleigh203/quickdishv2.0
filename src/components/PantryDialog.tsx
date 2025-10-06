import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Search, Camera, Barcode } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ManualBarcodeEntry } from "@/components/ManualBarcodeEntry";
import { useProductLookup } from "@/hooks/useProductLookup";

interface PantryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export const PantryDialog = ({ open, onOpenChange, onUpdate }: PantryDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isManualBarcodeOpen, setIsManualBarcodeOpen] = useState(false);
  const { lookupProduct } = useProductLookup();

  useEffect(() => {
    if (open && user) {
      loadPantryItems();
    }
  }, [open, user]);

  const loadPantryItems = async () => {
    if (!user) return;
    
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

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      toast({ title: "Please enter an item name", variant: "destructive" });
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const updatedItems = [...pantryItems, newItemName.trim()];
      
      const { error } = await supabase
        .from('profiles')
        .update({ pantry_items: updatedItems })
        .eq('id', user.id);

      if (error) throw error;

      setPantryItems(updatedItems);
      setNewItemName("");
      toast({ title: "Item added to pantry" });
      onUpdate?.();
    } catch (error) {
      console.error('Error adding item:', error);
      toast({ title: "Failed to add item", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (item: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedItems = pantryItems.filter(i => i !== item);
      
      const { error } = await supabase
        .from('profiles')
        .update({ pantry_items: updatedItems })
        .eq('id', user.id);

      if (error) throw error;

      setPantryItems(updatedItems);
      toast({ title: "Removed from pantry" });
      onUpdate?.();
    } catch (error) {
      console.error('Error removing item:', error);
      toast({ title: "Failed to remove item", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleScanBarcode = async () => {
    try {
      toast({ title: "Requesting camera access..." });
      
      // Request camera permission directly in click handler
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      // Now open the scanner
      setIsScannerOpen(true);
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        toast({
          title: "Camera access denied",
          description: "Please enable camera in settings or enter barcode manually",
          variant: "destructive",
        });
        setIsManualBarcodeOpen(true);
      } else if (error.name === 'NotFoundError') {
        toast({
          title: "No camera found",
          description: "Please enter barcode manually",
          variant: "destructive",
        });
        setIsManualBarcodeOpen(true);
      } else {
        toast({
          title: "Camera unavailable",
          description: "Please enter barcode manually",
          variant: "destructive",
        });
        setIsManualBarcodeOpen(true);
      }
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    toast({ title: "Looking up product...", description: `Barcode: ${barcode}` });

    const productInfo = await lookupProduct(barcode);

    if (productInfo) {
      // Auto-fill with product name
      const productName = productInfo.brand 
        ? `${productInfo.brand} ${productInfo.name}`
        : productInfo.name;
      
      setNewItemName(productName);
      toast({
        title: "✓ Product found!",
        description: `${productInfo.name} - Ready to add`,
      });
    } else {
      toast({
        title: "Product not found",
        description: `Barcode ${barcode} - Please enter manually`,
        variant: "destructive",
      });
    }
  };

  const filteredItems = pantryItems.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Item name (e.g., flour, eggs, butter)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  disabled={loading}
                  className="flex-1"
                />
                <Button onClick={handleAddItem} disabled={loading}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManualBarcodeOpen(true)}
                disabled={loading}
                className="w-full"
              >
                <Barcode className="w-4 h-4 mr-2" />
                Enter Barcode Manually
              </Button>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Quick add:</span>
                {['Flour', 'Sugar', 'Eggs', 'Butter', 'Oil', 'Salt', 'Pepper'].map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewItemName(item);
                      setTimeout(() => handleAddItem(), 100);
                    }}
                    disabled={loading}
                    className="text-xs h-7"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

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

          {/* Pantry Items List */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No items found" : "Your pantry is empty. Add items to get started!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  Pantry Items
                  <Badge variant="secondary">{filteredItems.length}</Badge>
                </h3>
                <div className="space-y-2">
                  {filteredItems.map(item => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                    >
                      <span className="font-medium">{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clear All Button at Bottom */}
          {filteredItems.length > 0 && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={async () => {
                if (!user) return;
                setLoading(true);
                try {
                  await supabase
                    .from('profiles')
                    .update({ pantry_items: [] })
                    .eq('id', user.id);
                  setPantryItems([]);
                  toast({
                    title: "Pantry cleared",
                    description: "All items have been removed",
                  });
                  onUpdate?.();
                } catch (error) {
                  console.error('Error clearing pantry:', error);
                  toast({
                    title: "Failed to clear pantry",
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Items
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
