/**
 * Default pantry items to populate when a user first logs in
 * These are common pantry staples that most people have
 */
export const DEFAULT_PANTRY_ITEMS = [
  'Salt',
  'Black Pepper',
  'Olive Oil',
  'Vegetable Oil',
  'Butter',
  'Garlic',
  'Onion',
  'Flour',
  'Sugar',
  'Baking Soda',
  'Baking Powder',
  'Vanilla Extract',
  'Eggs',
  'Milk',
  'Chicken Broth',
  'Rice',
  'Pasta',
  'Tomato Sauce',
  'Canned Tomatoes',
  'Canned Beans',
];

/**
 * Initialize default pantry items for a new user
 * Only adds items if the user's pantry is empty
 */
export async function initializeDefaultPantryItems(
  userId: string,
  supabase: any
): Promise<boolean> {
  try {
    // Check if user already has pantry items
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('pantry_items')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching profile for pantry initialization:', fetchError);
      return false;
    }

    // If user already has pantry items, don't initialize
    if (profile?.pantry_items && Array.isArray(profile.pantry_items) && profile.pantry_items.length > 0) {
      return false; // Already has items
    }

    // Initialize with default items
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ pantry_items: DEFAULT_PANTRY_ITEMS })
      .eq('id', userId);

    if (updateError) {
      console.error('Error initializing default pantry items:', updateError);
      return false;
    }

    return true; // Successfully initialized
  } catch (error) {
    console.error('Error in initializeDefaultPantryItems:', error);
    return false;
  }
}


