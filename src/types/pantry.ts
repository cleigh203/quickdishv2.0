export type PantryCategory = 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'spices' | 'other';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: PantryCategory;
  addedDate: string;
  expiryDate?: string;
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
