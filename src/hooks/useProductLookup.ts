import { useState } from "react";
import { PantryCategory } from "@/types/pantry";

interface ProductInfo {
  name: string;
  category: PantryCategory;
  brand?: string;
  barcode: string;
  image?: string;
}

export const useProductLookup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectCategory = (categories: string = ""): PantryCategory => {
    const lowerCategories = categories.toLowerCase();
    
    if (lowerCategories.includes("fruit") || lowerCategories.includes("vegetable") || 
        lowerCategories.includes("produce")) {
      return "produce";
    }
    if (lowerCategories.includes("dairy") || lowerCategories.includes("milk") || 
        lowerCategories.includes("cheese") || lowerCategories.includes("yogurt")) {
      return "dairy";
    }
    if (lowerCategories.includes("meat") || lowerCategories.includes("poultry") || 
        lowerCategories.includes("seafood") || lowerCategories.includes("fish")) {
      return "meat";
    }
    if (lowerCategories.includes("frozen")) {
      return "frozen";
    }
    if (lowerCategories.includes("spice") || lowerCategories.includes("herb") || 
        lowerCategories.includes("seasoning")) {
      return "spices";
    }
    if (lowerCategories.includes("grain") || lowerCategories.includes("pasta") || 
        lowerCategories.includes("rice") || lowerCategories.includes("flour") ||
        lowerCategories.includes("oil") || lowerCategories.includes("sauce") ||
        lowerCategories.includes("condiment")) {
      return "pantry";
    }
    
    return "other";
  };

  const lookupProduct = async (barcode: string): Promise<ProductInfo | null> => {
    setLoading(true);
    setError(null);

    try {
      // Try Open Food Facts API
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        
        return {
          name: product.product_name || "Unknown Product",
          category: detectCategory(product.categories || ""),
          brand: product.brands || undefined,
          barcode: barcode,
          image: product.image_url || undefined,
        };
      } else {
        // Product not found in database
        setError("Product not found in database");
        return null;
      }
    } catch (err) {
      console.error("Product lookup error:", err);
      setError("Failed to lookup product. Please try manual entry.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { lookupProduct, loading, error };
};
