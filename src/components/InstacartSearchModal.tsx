import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Search, Loader2 } from "lucide-react";
import { useInstacart, InstacartItem } from "@/hooks/useInstacart";

interface InstacartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToShoppingList?: (item: InstacartItem) => void;
}

export const InstacartSearchModal = ({ isOpen, onClose, onAddToShoppingList }: InstacartSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchItems, addToCart, isSearching, searchResults } = useInstacart();

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchItems(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddToCart = async (item: InstacartItem) => {
    await addToCart(item, 1);
  };

  const handleAddToShoppingList = (item: InstacartItem) => {
    if (onAddToShoppingList) {
      onAddToShoppingList(item);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Search Instacart
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Search
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchResults.length === 0 && !isSearching && searchTerm && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items found for "{searchTerm}"</p>
              <p className="text-sm mt-2">Try searching for common grocery items</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop&fm=webp&q=18";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.store} • ${item.price.toFixed(2)} {item.unit}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.inStock ? "default" : "secondary"}>
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                          {item.inStock && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddToShoppingList(item)}
                                className="h-7 px-2 text-xs"
                              >
                                Add to List
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(item)}
                                className="h-7 px-2 text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Cart
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



