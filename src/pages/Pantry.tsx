import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
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
import { groupPantryByCategory, autoCategorizePantryItem, estimateExpirationDate, ingredientMatch } from "@/utils/pantryUtils";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ManualBarcodeEntry } from "@/components/ManualBarcodeEntry";
import { useProductLookup } from "@/hooks/useProductLookup";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";

const Pantry = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lookupProduct, loading: lookingUpProduct } = useProductLookup();
  useScrollToTop();

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

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
    expiration_date: "",
  });
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [recipesReady, setRecipesReady] = useState(0);

  // Debug localStorage (even though we use Supabase)
  useEffect(() => {
    const pantryData = localStorage.getItem('pantry');
    if (pantryData) {
      const items = JSON.parse(pantryData);
      const paprika = items.find(item => item.name.toLowerCase().includes('paprika'));
      if (paprika) {
        console.log('🌶️ Paprika in localStorage:', paprika);
      }
    }
  }, []);

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
        const items = (data?.pantry_items || []).map((name: string, index: number) => {
          const now = new Date().toISOString();
          return {
            id: `pantry-${Date.now()}-${index}`,
            name,
            quantity: 1,
            unit: 'unit',
            category: autoCategorizePantryItem(name),
            date_added: now,
            addedDate: now,
          };
        });

        console.log('✅ Loaded pantry items:', items.length, 'items');

        // Debug: Show all pantry items and their categories
        console.table(items.map(item => ({
          name: item.name,
          category: item.category,
          categoryType: typeof item.category
        })));

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

    // Auto-categorize if category is 'other' or not set
    const category = newItem.category === 'other' || !newItem.category
      ? autoCategorizePantryItem(newItem.name.trim())
      : newItem.category;

    // Use provided expiration date or estimate one
    const expirationDate = newItem.expiration_date
      ? new Date(newItem.expiration_date)
      : estimateExpirationDate(newItem.name.trim(), category);

    const item: PantryItem = {
      id: `pantry-${Date.now()}-${Math.random()}`,
      name: newItem.name.trim(),
      quantity: parseFloat(newItem.quantity) || 1,
      unit: newItem.unit,
      category: category,
      date_added: new Date().toISOString(),
      addedDate: new Date().toISOString(), // Legacy support
      expiration_date: expirationDate.toISOString().split('T')[0],
      expiryDate: expirationDate.toISOString().split('T')[0], // Legacy support
      barcode: newItem.barcode || undefined,
    };

    console.log('🌶️ Adding item:', item.name, 'Category:', category);

    // Check if it's paprika specifically
    if (item.name.toLowerCase().includes('paprika')) {
      console.log('⚠️ PAPRIKA DETECTED - Category being saved:', category);
    }

    setPantryItems(prev => [...prev, item]);
    toast({ title: `Added ${item.name} to pantry` });

    console.log('✅ Item added. Verifying...');
    console.log('Current pantry items:', pantryItems.length + 1);

    // Reset form
    setNewItem({
      name: "",
      quantity: "1",
      unit: "unit",
      category: "other",
      barcode: "",
      expiration_date: "",
    });
    setScannedBarcode("");
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (item: PantryItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      category: item.category,
      barcode: item.barcode || "",
      expiration_date: item.expiration_date || item.expiryDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (!newItem.name.trim() || !editingItem) {
      toast({ title: "Please enter an item name", variant: "destructive" });
      return;
    }

    const updatedItem: PantryItem = {
      ...editingItem,
      name: newItem.name.trim(),
      quantity: parseFloat(newItem.quantity) || 1,
      unit: newItem.unit,
      category: newItem.category as PantryCategory,
      expiration_date: newItem.expiration_date || undefined,
      expiryDate: newItem.expiration_date || undefined, // Legacy support
      barcode: newItem.barcode || undefined,
    };

    setPantryItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    toast({ title: `Updated ${updatedItem.name}` });

    // Reset form
    setNewItem({
      name: "",
      quantity: "1",
      unit: "unit",
      category: "other",
      barcode: "",
      expiration_date: "",
    });
    setEditingItem(null);
    setIsEditDialogOpen(false);
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
        expiration_date: "",
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
        expiration_date: "",
      });
      setIsAddDialogOpen(true);
      toast({
        title: "Product not found",
        description: `Barcode ${barcode} - Please enter details manually`,
        variant: "destructive",
      });
    }
  };

  const handleScanBarcode = async () => {
    console.log('🎯 Scan barcode button clicked');
    
    try {
      console.log('📱 Checking platform...');
      const { Capacitor } = await import('@capacitor/core');
      const isNative = Capacitor.isNativePlatform();
      console.log('Platform:', isNative ? 'NATIVE' : 'WEB');
      
      if (!isNative) {
        console.log('❌ Not native - showing manual entry');
        toast({
          title: "Camera not available",
          description: "Barcode scanning only works on mobile app"
        });
        setIsManualBarcodeOpen(true);
        return;
      }

      console.log('📷 Importing BarcodeScanner...');
      const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
      console.log('✅ BarcodeScanner imported');
      
      console.log('🔐 Checking camera permission...');
      const status = await BarcodeScanner.checkPermission({ force: true });
      console.log('Permission status:', status);
      
      if (!status.granted) {
        console.log('❌ Permission denied');
        toast({
          title: "Camera permission denied",
          description: "Please enable camera access in device settings"
        });
        setIsManualBarcodeOpen(true);
        return;
      }
      
      console.log('✅ Permission granted');
      console.log('🎬 Hiding UI...');
      document.body.classList.add('scanner-active');
      document.querySelector('html')?.classList.add('scanner-active');
      document.querySelector('.pantry-page')?.classList.add('scanner-active');
      
      // Show cancel button
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '✕ Cancel';
      cancelButton.className = 'scanner-cancel-button';
      cancelButton.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-weight: 600;
        border: none;
        font-size: 16px;
      `;
      cancelButton.onclick = async () => {
        console.log('🚫 Cancel button clicked');
        try {
          await BarcodeScanner.stopScan();
        } catch {}
        document.body.classList.remove('scanner-active');
        document.querySelector('html')?.classList.remove('scanner-active');
        document.querySelector('.pantry-page')?.classList.remove('scanner-active');
        cancelButton.remove();
      };
      document.body.appendChild(cancelButton);
      
      console.log('🔧 Preparing scanner...');
      await BarcodeScanner.prepare();
      console.log('✅ Scanner prepared');
      
      console.log('📸 Starting scan...');
      // startScan returns a promise that resolves when a barcode is detected
      const result = await BarcodeScanner.startScan();
      console.log('Scan result received:', result);
      
      // Remove cancel button
      cancelButton.remove();
      
      // Cleanup
      console.log('🧹 Cleaning up...');
      await BarcodeScanner.stopScan();
      document.body.classList.remove('scanner-active');
      document.querySelector('html')?.classList.remove('scanner-active');
      document.querySelector('.pantry-page')?.classList.remove('scanner-active');
      
      if (result && result.hasContent && result.content) {
        console.log('✅ Barcode scanned:', result.content);
        await handleBarcodeScan(result.content);
      } else {
        console.log('⚠️ No barcode content in result:', result);
        toast({
          title: "No barcode detected",
          description: "Please try again or enter manually"
        });
        setIsManualBarcodeOpen(true);
      }
      
    } catch (error: any) {
      console.error('💥 Scanner error:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      // Remove cancel button if it exists
      const cancelButton = document.querySelector('.scanner-cancel-button');
      if (cancelButton) {
        cancelButton.remove();
      }
      
      // Cleanup on error
      try {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        await BarcodeScanner.stopScan();
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      
      document.body.classList.remove('scanner-active');
      document.querySelector('html')?.classList.remove('scanner-active');
      document.querySelector('.pantry-page')?.classList.remove('scanner-active');
      
      toast({
        title: "Scanner error",
        description: error?.message || "Please try manual entry",
        variant: "destructive"
      });
      setIsManualBarcodeOpen(true);
    }
  };

  const handleCancelScan = async () => {
    try {
      const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
      await BarcodeScanner.stopScan();
      document.body.classList.remove('scanner-active');
      document.querySelector('html')?.classList.remove('scanner-active');
      document.querySelector('.pantry-page')?.classList.remove('scanner-active');
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  // Filter items
  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = groupPantryByCategory(filteredItems);

  // Calculate recipes ready
  useEffect(() => {
    calculateRecipesReady();
  }, [pantryItems, user]);

  const calculateRecipesReady = async () => {
    if (!user) {
      setRecipesReady(0);
      return;
    }

    try {
      // Fetch fresh pantry items from database (same as PantryRecipes.tsx)
      const { data: pantryData } = await supabase
        .from('profiles')
        .select('pantry_items')
        .eq('id', user.id)
        .single();
      
      const pantryIngredients = pantryData?.pantry_items || [];
      
      if (pantryIngredients.length === 0) {
        setRecipesReady(0);
        return;
      }

      // Fetch recipes
      const { data: recipes } = await supabase
        .from('recipes')
        .select('*');
      
      if (!recipes) {
        setRecipesReady(0);
        return;
      }
      
      // Use the exact same logic as PantryRecipes.tsx
      const ready: any[] = [];
      
      console.log('🔍 Pantry count - Checking recipes with pantry items:', pantryIngredients);
      
      recipes.forEach((recipe: any) => {
        if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
          return; // Skip recipes with no ingredients
        }
        
        const missingIngredients: string[] = [];
        
        recipe.ingredients.forEach((ing: any) => {
          const ingName = ing.item || '';
          if (!ingName) return;
          
          const hasIngredient = pantryIngredients.some(pantryItem => 
            ingredientMatch(pantryItem, ingName)
          );
          
          if (!hasIngredient) {
            missingIngredients.push(ingName);
          }
        });
        
        // 100% match - ready to cook (same logic as PantryRecipes.tsx)
        if (missingIngredients.length === 0) {
          ready.push(recipe);
          console.log(`✅ Found ready recipe: ${recipe.name}`);
        } else {
          console.log(`❌ Recipe "${recipe.name}" missing ${missingIngredients.length} ingredients:`, missingIngredients.slice(0, 3));
        }
      });
      
      console.log('📊 Pantry count calculation - Ready recipes:', ready.length, 'recipes:', ready.map((r: any) => r.name));
      setRecipesReady(ready.length);
    } catch (error) {
      console.error('Error calculating recipes:', error);
      setRecipesReady(0);
    }
  };

  // Calculate stats
  const totalItems = pantryItems.reduce((sum, item) => sum + item.quantity, 0);
  const expiringSoon = pantryItems.filter(item => {
    if (!item.expiration_date && !item.expiryDate) return false;
    const expDate = new Date(item.expiration_date || item.expiryDate || '');
    const daysUntil = Math.floor((expDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7;
  }).length;

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'produce': '🥬',
      'dairy': '🥛',
      'meat': '🥩',
      'pantry': '🥫',
      'frozen': '🧊',
      'spices': '🌶️',
      'other': '📦',
    };
    return icons[category] || '📦';
  };

  // Helper function to get item emoji
  const getItemEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('milk')) return '🥛';
    if (n.includes('egg')) return '🥚';
    if (n.includes('chicken')) return '🍗';
    if (n.includes('beef')) return '🥩';
    if (n.includes('apple')) return '🍎';
    if (n.includes('banana')) return '🍌';
    if (n.includes('bread')) return '🍞';
    if (n.includes('cheese')) return '🧀';
    return '📦';
  };

  // PantryItemCard component
  const PantryItemCard = ({ item }: { item: PantryItem }) => {
    const expDate = item.expiration_date || item.expiryDate;
    const daysUntilExpiration = expDate
      ? Math.floor((new Date(expDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const expirationColor =
      daysUntilExpiration === null ? 'text-gray-500' :
      daysUntilExpiration <= 1 ? 'text-red-600' :
      daysUntilExpiration <= 7 ? 'text-orange-500' :
      'text-gray-600';

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-3xl">
          {getItemEmoji(item.name)}
        </div>

        <div className="flex-1">
          <div className="font-bold text-gray-900">{item.name}</div>
          <div className="text-lg font-semibold text-[#047857]">
            {item.quantity} {item.unit}
          </div>
          {expDate && (
            <div className={`text-xs ${expirationColor} font-semibold`}>
              ⏰ {daysUntilExpiration !== null && daysUntilExpiration <= 0 ? 'Expired' :
                  daysUntilExpiration === 1 ? 'Expires tomorrow' :
                  daysUntilExpiration !== null ? `Expires in ${daysUntilExpiration} days` : ''}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleUpdateQuantity(item.id, -1)}
            className="w-9 h-9 border-2 border-gray-200 rounded-lg text-[#047857] font-bold hover:bg-gray-50"
          >
            −
          </button>
          <button
            onClick={() => handleEditItem(item)}
            className="w-9 h-9 border-2 border-gray-200 rounded-lg text-[#047857] hover:bg-gray-50"
            title="Edit item"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDeleteItem(item.id)}
            className="w-9 h-9 border-2 border-gray-200 rounded-lg text-red-500 hover:bg-red-50"
            title="Delete item"
          >
            🗑️
          </button>
          <button
            onClick={() => handleUpdateQuantity(item.id, 1)}
            className="w-9 h-9 border-2 border-gray-200 rounded-lg text-[#047857] font-bold hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  // Cleanup scanner on component unmount
  useEffect(() => {
    return () => {
      // Cleanup scanner when component unmounts
      const cleanup = async () => {
        try {
          const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
          await BarcodeScanner.stopScan();
          document.body.classList.remove('scanner-active');
          document.querySelector('html')?.classList.remove('scanner-active');
          document.querySelector('.pantry-page')?.classList.remove('scanner-active');
        } catch {}
      };
      cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 pb-40 pantry-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">My Pantry</h1>
        <p className="text-sm text-gray-600">Track what you have, reduce waste</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pantry items..."
            className="w-full px-4 py-3 pl-10 border-2 border-gray-200 focus-visible:border-[#047857] focus-visible:ring-[#047857] rounded-xl"
          />
        </div>
      </div>

      {/* NEW: Cook With What You Have Banner */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-br from-[#047857] to-[#10b981] rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">🎯 Cook With What You Have</h2>
          <p className="text-sm text-white/90 mb-4">
            Find recipes you can make right now. No shopping needed!
          </p>
          <button
            onClick={() => navigate('/pantry-recipes')}
            className="w-full bg-white text-[#047857] py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Show Me {recipesReady} Recipes →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#047857]">{totalItems}</div>
          <div className="text-xs text-gray-600 font-semibold">Total Items</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#047857]">{expiringSoon}</div>
          <div className="text-xs text-gray-600 font-semibold">Expiring Soon</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#047857]">{recipesReady}</div>
          <div className="text-xs text-gray-600 font-semibold">Recipes Ready</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
              filterCategory === 'all'
                ? 'bg-[#047857] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            All
          </button>
          {PANTRY_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                filterCategory === cat.value
                  ? 'bg-[#047857] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            {/* Scan Barcode Button */}
            <Button
              onClick={handleScanBarcode}
              variant="outline"
              className="w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              Scan Barcode
            </Button>

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
                <div className="space-y-2">
                  <Label htmlFor="expiration_date">Expiration Date (Optional)</Label>
                  <Input
                    id="expiration_date"
                    type="date"
                    value={newItem.expiration_date}
                    onChange={(e) => setNewItem(prev => ({ ...prev, expiration_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to auto-estimate based on item type
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewItem({
                    name: "",
                    quantity: "1",
                    unit: "unit",
                    category: "other",
                    barcode: "",
                    expiration_date: "",
                  });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add to Pantry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pantry Item</DialogTitle>
            <DialogDescription>
              Update the item details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Item Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Chicken breast"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Input
                  id="edit-unit"
                  placeholder="e.g., lbs, cups"
                  value={newItem.unit}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
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
            <div className="space-y-2">
              <Label htmlFor="edit-expiration_date">Expiration Date (Optional)</Label>
              <Input
                id="edit-expiration_date"
                type="date"
                value={newItem.expiration_date}
                onChange={(e) => setNewItem(prev => ({ ...prev, expiration_date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingItem(null);
              setNewItem({
                name: "",
                quantity: "1",
                unit: "unit",
                category: "other",
                barcode: "",
                expiration_date: "",
              });
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner */}
        <BarcodeScanner
          open={isScannerOpen}
          onOpenChange={(open) => {
            setIsScannerOpen(open);
            // If scanner closes without scanning, automatically offer manual entry
            if (!open && !scannedBarcode) {
              setIsManualBarcodeOpen(true);
            }
          }}
          onScan={(barcode) => {
            setIsScannerOpen(false);
            handleBarcodeScan(barcode);
          }}
          onError={() => {
            setIsScannerOpen(false);
            toast({
              title: "Scanner unavailable",
              description: "Enter barcode manually instead",
            });
            setIsManualBarcodeOpen(true);
          }}
        />

        {/* Manual Barcode Entry */}
        <ManualBarcodeEntry
          open={isManualBarcodeOpen}
          onOpenChange={setIsManualBarcodeOpen}
          onSubmit={handleBarcodeScan}
        />

      {/* Pantry Items - Grouped by Category */}
      <div className="px-6">
        {loading ? (
          <LoadingScreen message="Loading your pantry..." />
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {pantryItems.length === 0
                ? "Your pantry is empty. Add items to track your inventory!"
                : "No items match your search."}
            </p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => {
            const categoryLabel = PANTRY_CATEGORIES.find(c => c.value === category)?.label || category;
            return (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
                  {getCategoryIcon(category)} {categoryLabel}
                </h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <PantryItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Item Button - Fixed at bottom */}
      <button
        onClick={() => setIsAddDialogOpen(true)}
        className="fixed bottom-32 right-6 w-14 h-14 bg-gradient-to-br from-[#047857] to-[#10b981] text-white rounded-full shadow-xl flex items-center justify-center text-2xl font-bold hover:scale-110 transition-transform z-40"
      >
        +
      </button>

      <BottomNav />

      {/* Scanner Back Button Overlay */}
      <div className="scanner-overlay hidden">
        <button
          onClick={handleCancelScan}
          className="scanner-back-button"
        >
          ✕ Cancel Scan
        </button>
      </div>
    </div>
  );
};

export default Pantry;
