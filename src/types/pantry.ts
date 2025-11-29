export type PantryCategory = 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'spices' | 'other';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // 'lbs', 'oz', 'eggs', 'cups', 'gallons', etc.
  category: PantryCategory; // Auto-assigned
  location?: string; // 'Fridge', 'Pantry', 'Freezer', 'Counter'
  expiration_date?: string; // Optional
  date_added?: string; // Optional, falls back to addedDate
  addedDate?: string; // Legacy support
  expiryDate?: string; // Legacy support
  barcode?: string;
  image_url?: string;
}

export const PANTRY_CATEGORIES: { value: PantryCategory; label: string }[] = [
  { value: 'produce', label: 'Produce' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'meat', label: 'Meat & Seafood' },
  { value: 'pantry', label: 'Pantry Staples' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'spices', label: 'Spices & Herbs' },
  { value: 'other', label: 'Other' },
];
