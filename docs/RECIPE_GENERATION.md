# Recipe Generation System Documentation

## Overview
The bulk recipe generation system uses Gemini AI (via Lovable AI Gateway) to generate category-specific recipes with automatic validation and database storage.

## Valid Categories (12 Total)

**CRITICAL:** Only these 12 categories are allowed:

1. **Halloween** - Spooky, themed party food
2. **Fall Favorites** - Seasonal comfort food with autumn ingredients
3. **Quick and Easy** - Under 30 minutes, simple ingredients
4. **Restaurant Copycats** - Recreate famous restaurant dishes
5. **Breakfast** - Morning meals
6. **Lunch Ideas** - Midday meals
7. **Dinner** - Evening meals
8. **Desserts** - Sweet treats
9. **One Pot Wonders** - Single pot/pan cooking
10. **Healthy Bowls** - Nutritionally balanced grain/protein bowls
11. **Leftover Magic** - Transform leftovers into new dishes
12. **Family Favorites** - Crowd-pleasing recipes

## Category-Specific Rules

### Restaurant Copycats
- **Must include:** Restaurant name in recipe title
- **Examples:** "Chipotle Burrito Bowl", "Olive Garden Breadsticks"
- **Description format:** "Recreate [restaurant]'s famous [dish] at home!"
- **Options:** `restaurantName` (string) - Target specific restaurant

### Leftover Magic
- **Must include:** Word "leftover" in recipe name
- **Examples:** "Leftover Chicken Fried Rice", "Leftover Turkey Soup"
- **Focus:** Transform 1-2 main leftover ingredients
- **Options:** `leftoverIngredient` (string) - What leftover to use

### Healthy Bowls
- **Must include:** 
  - "Bowl" in recipe name
  - Grain base + protein + vegetables + sauce
  - Balanced macros (protein 20-40g, carbs 40-60g, fat 15-25g)
- **Examples:** "Mediterranean Quinoa Bowl", "Teriyaki Salmon Bowl"

### Quick and Easy
- **Hard limit:** Total time < 30 minutes
- **Max ingredients:** 10 items
- **Max steps:** 8 steps
- **Options:** `cookTime` (number) - Time limit in minutes

### One Pot Wonders
- **Must mention:** "One pot" in description
- **Requirement:** All cooking in single pot/pan
- **Benefit:** Easy cleanup highlighted

### Halloween
- **Theme:** Spooky, fun party food
- **Names:** Creative (Witch's Brew, Monster Eyeballs, etc.)
- **Audience:** Kids or adults

### Fall Favorites
- **Ingredients:** Seasonal (pumpkin, apple, squash, cinnamon)
- **Vibe:** Warm, cozy comfort food

## Usage

### Basic Generation

```typescript
import { generateRecipes } from '@/lib/recipeGenerator';

const result = await generateRecipes({
  category: 'Dinner',
  count: 5,
  options: {
    cuisine: 'Italian',
    dietary: 'vegetarian'
  }
});

console.log(`Generated ${result.generated}/${result.requested} recipes`);
```

### Category-Specific Examples

#### Restaurant Copycats
```typescript
const result = await generateRecipes({
  category: 'Restaurant Copycats',
  count: 3,
  options: {
    restaurantName: 'Chipotle' // Optional: target specific restaurant
  }
});
```

#### Leftover Magic
```typescript
const result = await generateRecipes({
  category: 'Leftover Magic',
  count: 5,
  options: {
    leftoverIngredient: 'chicken' // What leftover to transform
  }
});
```

#### Quick and Easy
```typescript
const result = await generateRecipes({
  category: 'Quick and Easy',
  count: 10,
  options: {
    cookTime: 20, // Under 20 minutes
    cuisine: 'Asian'
  }
});
```

#### Healthy Bowls
```typescript
const result = await generateRecipes({
  category: 'Healthy Bowls',
  count: 5,
  options: {
    cuisine: 'Mediterranean',
    dietary: 'vegan'
  }
});
```

## Options Reference

```typescript
interface RecipeGenerationOptions {
  cuisine?: string;           // Any cuisine type
  dietary?: string;           // 'vegetarian', 'vegan', 'gluten-free', etc.
  cookTime?: number;          // Max time in minutes
  restaurantName?: string;    // For Restaurant Copycats
  leftoverIngredient?: string; // For Leftover Magic
}
```

## Recipe Output Format

```typescript
{
  name: string,
  description: string,
  prepTime: number,              // minutes
  cookTime: number,              // minutes
  totalTime: number,             // prepTime + cookTime
  servings: number,              // 4-6 default
  difficulty: 'Easy' | 'Medium' | 'Hard',
  category: string,              // One of 12 valid categories
  cuisine: string,
  ingredients: Array<{
    amount: number,
    unit: string,
    name: string
  }>,
  instructions: string[],        // 4-12 steps
  tags: string[],
  nutritionalInfo: {
    calories: number,
    protein: number,             // grams
    carbs: number,               // grams
    fat: number                  // grams
  },
  imageUrl: string,
  source: 'ai_generated',
  aiGenerated: true,
  needsValidation: true,
  verified: false
}
```

## Validation Rules

### Universal Rules
- 5-15 ingredients
- 4-12 instruction steps
- Prep time: 1-180 minutes
- Cook time: 1-300 minutes
- Total time = prep + cook
- Servings: 1-12
- Difficulty: Easy, Medium, or Hard
- No suspicious spice amounts (max 5 cups)

### Category-Specific Validation
- **Quick and Easy:** Total time < 30 min, max 10 ingredients
- **Restaurant Copycats:** Must include restaurant name
- **Leftover Magic:** Must include "leftover" in name
- **One Pot Wonders:** Must mention "one pot" in description
- **Healthy Bowls:** Must include "bowl" in name, protein 20-40g

## Error Handling

```typescript
const result = await generateRecipes({
  category: 'Dinner',
  count: 10
});

// Check for errors
if (result.errors && result.errors.length > 0) {
  console.log('Some recipes failed:', result.errors);
}

// Check success rate
const successRate = (result.generated / result.requested) * 100;
console.log(`Success rate: ${successRate}%`);
```

## Rate Limiting

- **Gemini rate limit:** Automatic 1-second delay between recipes
- **Recommended batch size:** 5-10 recipes per request
- **Error handling:** Stops generation if rate limited (429 error)

## Best Practices

1. **Start Small:** Test with 1-2 recipes before bulk generation
2. **Category Validation:** Always use `VALID_CATEGORIES` constant
3. **Error Recovery:** Check `result.errors` for partial failures
4. **Rate Limits:** Wait 2-3 seconds between large batches
5. **Review Generated Recipes:** All recipes have `needsValidation: true`

## Database Storage

Recipes are automatically saved to the `recipes` table with:
- `source: 'ai_generated'`
- `ai_generated: true`
- `needs_validation: true`
- `verified: false`
- `kitchen_tested: false`
- `generated_at: <timestamp>`

## Admin Review Workflow

1. AI generates recipes → `verified: false`
2. Admin reviews recipe → Updates validation notes
3. Admin tests recipe → `kitchen_tested: true`
4. Admin approves → `verified: true` (visible to users)

## Example: Bulk Generate All Categories

```typescript
import { VALID_CATEGORIES, generateRecipes } from '@/lib/recipeGenerator';

async function generateAllCategories() {
  for (const category of VALID_CATEGORIES) {
    const result = await generateRecipes({
      category,
      count: 5
    });
    
    console.log(`${category}: ${result.generated}/${result.requested}`);
    
    // Wait to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
```

## Troubleshooting

### "Invalid category" error
- Check spelling matches exactly (case-sensitive)
- Use `VALID_CATEGORIES` constant
- Only 12 categories are valid

### Rate limit errors (429)
- Reduce `count` per request
- Add delays between batches
- Check Lovable AI usage limits

### Validation failures
- Check category-specific requirements
- Review error messages in `result.errors`
- Ensure reasonable time/ingredient counts

### AI response errors
- Gemini may occasionally return invalid JSON
- System retries automatically
- Check logs for specific error details
