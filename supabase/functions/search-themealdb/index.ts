import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { ingredient } = await req.json()

  try {
    // Search by main ingredient
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
    )
    const data = await response.json()

    if (!data.meals || data.meals.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        recipes: [],
        message: 'No recipes found'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get full recipe details for each meal (limit to 10 for performance)
    const detailedRecipes = await Promise.all(
      data.meals.slice(0, 10).map(async (meal: any) => {
        const detailResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
        const detailData = await detailResponse.json()
        const recipe = detailData.meals[0]

        // Transform to QuickDish format
        return {
          name: recipe.strMeal,
          image_url: recipe.strMealThumb,
          category: recipe.strCategory,
          cuisine: recipe.strArea,
          instructions: cleanInstructions(recipe.strInstructions),
          ingredients: extractIngredients(recipe),
          tags: recipe.strTags ? recipe.strTags.split(',') : [],
          video_url: recipe.strYoutube,
          source: 'themealdb',
          external_id: meal.idMeal,
          external_url: recipe.strSource,
          // Add default values for required fields
          cook_time: '30 mins',
          prep_time: '15 mins',
          difficulty: 'Medium',
          servings: 4
        }
      })
    )

    return new Response(JSON.stringify({
      success: true,
      recipes: detailedRecipes,
      source: 'themealdb'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('TheMealDB error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

function extractIngredients(recipe: any) {
  const ingredients = []

  // TheMealDB has ingredients as strIngredient1, strIngredient2, etc.
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      ingredients.push(parseIngredient(ingredient, measure))
    }
  }

  // Filter out empty or malformed ingredients
  return ingredients.filter(ing => {
    // Must have an item name
    if (!ing.item || ing.item.trim().length < 2) return false

    // Skip generic entries
    const itemLower = ing.item.toLowerCase()
    if (itemLower === 'to taste') return false
    if (itemLower === 'as needed') return false
    if (itemLower === 'salt and pepper') return false
    if (itemLower.includes('salt')) return false // Skip salt entries as they're often duplicates
    if (itemLower.includes('pepper')) return false // Skip pepper entries

    return true
  })
}

function parseIngredient(ingredientName: string, measure: string) {
  if (!measure || !measure.trim()) {
    return {
      item: ingredientName.trim(),
      amount: '1',
      unit: ''
    }
  }

  // Clean up the measure string
  const cleanMeasure = measure.trim()

  // Parse common patterns: "2 tbsp", "1 tsp", "3 cups", "750g", "2-3", etc.
  const patterns = [
    // "2 tbsp", "1 tsp", "3 cups", "4 oz", "1 lb"
    /^(\d+(?:[-\/]\d+)?)\s*(tbsp?|tsp?|cup|cups|tablespoons?|teaspoons?|oz|ounces?|lb|lbs|pounds?|g|grams?|kg|ml|l|liters?|pints?|quarts?|gallons?|cloves?|slices?|pieces?|stalks?|bunches?)/i,
    // "750g", "2kg", "500ml" (no space)
    /^(\d+(?:\.\d+)?)(g|kg|ml|l|oz|lb)$/i,
    // Just a number: "2", "3", "1/2"
    /^(\d+(?:[-\/]\d+)?)$/
  ]

  for (const pattern of patterns) {
    const match = cleanMeasure.match(pattern)
    if (match) {
      const amount = match[1]
      const unit = match[2] || ''

      // Normalize units
      const normalizedUnit = normalizeUnit(unit)

      return {
        item: ingredientName.trim(),
        amount: amount,
        unit: normalizedUnit
      }
    }
  }

  // If no pattern matches, treat entire measure as amount
  return {
    item: ingredientName.trim(),
    amount: cleanMeasure,
    unit: ''
  }
}

function normalizeUnit(unit: string): string {
  if (!unit) return ''

  const normalized = unit.toLowerCase()

  // Normalize to consistent abbreviations
  const unitMap: Record<string, string> = {
    'tablespoon': 'tbsp',
    'tablespoons': 'tbsp',
    'teaspoon': 'tsp',
    'teaspoons': 'tsp',
    'ounce': 'oz',
    'ounces': 'oz',
    'pound': 'lb',
    'pounds': 'lbs',
    'gram': 'g',
    'grams': 'g',
    'kilogram': 'kg',
    'kilograms': 'kg',
    'milliliter': 'ml',
    'milliliters': 'ml',
    'liter': 'l',
    'liters': 'l',
    'pint': 'pint',
    'pints': 'pints',
    'quart': 'quart',
    'quarts': 'quarts',
    'clove': 'clove',
    'cloves': 'cloves',
    'slice': 'slice',
    'slices': 'slices',
    'piece': 'piece',
    'pieces': 'pieces',
    'stalk': 'stalk',
    'stalks': 'stalks',
    'bunch': 'bunch',
    'bunches': 'bunches'
  }

  return unitMap[normalized] || normalized
}

function cleanInstructions(instructions: string): string[] {
  if (!instructions) return []

  return instructions
    .split(/\r?\n/)
    .filter((s: string) => s.trim())
    .filter((s: string) => !s.match(/^STEP \d+/i)) // Remove "STEP 1", "STEP 2" lines
    .map((s: string) => s.replace(/^\d+\.\s*/, '')) // Remove leading numbers like "1. "
    .filter((s: string) => s.trim()) // Filter out any empty strings after cleaning
}
