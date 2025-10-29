import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InstacartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  store: string;
  image: string;
  inStock: boolean;
  quantity?: number;
}

export interface InstacartSearchResult {
  items: InstacartItem[];
  totalResults: number;
  searchTerm: string;
}

export const useInstacart = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<InstacartItem[]>([]);
  const { toast } = useToast();

  const searchItems = useCallback(async (searchTerm: string): Promise<InstacartSearchResult | null> => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return null;
    }

    setIsSearching(true);

    try {
      const { data, error } = await supabase.functions.invoke('instacart-search', {
        body: { searchTerm }
      });

      if (error) {
        console.error('Instacart search error:', error);
        toast({
          title: "Search failed",
          description: error.message || "Failed to search Instacart",
          variant: "destructive"
        });
        return null;
      }

      if (data?.items) {
        setSearchResults(data.items);
        return data;
      }

      return null;
    } catch (error: any) {
      console.error('Instacart search failed:', error);
      toast({
        title: "Search failed",
        description: "Unable to search Instacart. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const addToCart = useCallback(async (item: InstacartItem, quantity: number = 1) => {
    try {
      const { data, error } = await supabase.functions.invoke('instacart-add-to-cart', {
        body: { itemId: item.id, quantity, userId: 'current-user' } // TODO: Get actual user ID
      });

      if (error) {
        console.error('Instacart add to cart error:', error);
        toast({
          title: "Failed to add to cart",
          description: error.message || "Unable to add item to Instacart cart",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Added to Instacart cart",
          description: `${quantity}x ${item.name} added to your cart`,
        });
      }
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Failed to add to cart",
        description: error.message || "Unable to add item to Instacart cart",
        variant: "destructive"
      });
    }
  }, [toast]);

  const createShoppingListLink = useCallback(async (items: any[], title?: string, imageUrl?: string) => {
    try {
      console.log('Creating Instacart list with items (before parsing):', items);
      
      // Parse amount string to extract quantity and unit separately
      const parseAmountAndUnit = (amountString: string) => {
        // "1 lb" → { amount: "1", unit: "lb" }
        // "1/4 cup" → { amount: "1/4", unit: "cup" }
        // "2 tbsp" → { amount: "2", unit: "tbsp" }
        if (!amountString || typeof amountString !== 'string') {
          return { amount: "1", unit: "each" };
        }
        
        const match = amountString.trim().match(/^([\d\/\.]+)\s*(.*)$/);
        if (match) {
          return {
            amount: match[1].trim(),  // "1", "1/4", "2"
            unit: match[2].trim() || "each"  // "lb", "cup", "tbsp"
          };
        }
        return { amount: "1", unit: "each" };
      };
      
      // Transform items to split combined amount/unit strings
      const formattedItems = items.map(item => {
        // If amount is already a plain number and unit exists separately, keep as-is
        if (item.unit && !isNaN(parseFloat(item.amount))) {
          return item;
        }
        
        // If amount contains both number and unit (e.g., "1 lb"), parse it
        const { amount, unit } = parseAmountAndUnit(item.amount);
        return {
          ...item,
          amount,
          unit
        };
      });
      
      console.log('Creating Instacart list with items (after parsing):', formattedItems);
      
      const response = await supabase.functions.invoke('instacart-create-list', {
        body: { items: formattedItems, title, imageUrl }
      });

      console.log('Raw response:', response);
      
      const { data, error } = response;

      if (error) {
        console.error('Instacart create list error:', error);
        console.error('Error context:', error.context);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        
        // Try to get the actual error message from data
        if (data) {
          console.error('Error data:', data);
        }
        
        let errorMessage = "Unable to create Instacart shopping list";
        
        // Check if there's an error in the data
        if (data?.error) {
          errorMessage = data.error;
          if (data.details) {
            console.error('Error details:', data.details);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Failed to create shopping list",
          description: errorMessage,
          variant: "destructive"
        });
        return null;
      }
      
      // Log the full response for debugging
      console.log('Instacart create list response:', data);

      if (data?.products_link_url) {
        console.log('Successfully created Instacart link:', data.products_link_url);
        return data.products_link_url;
      }
      
      if (data?.error) {
        console.error('Instacart API returned error:', data.error);
        toast({
          title: "Failed to create shopping list",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      console.error('No products_link_url in response:', data);
      return null;
    } catch (error: any) {
      console.error('Failed to create shopping list:', error);
      toast({
        title: "Failed to create shopping list",
        description: error.message || "Unable to create Instacart shopping list",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  return {
    searchItems,
    addToCart,
    createShoppingListLink,
    isSearching,
    searchResults
  };
};
