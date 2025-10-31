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
          instructions: recipe.strInstructions.split('\n').filter((i: string) => i.trim()),
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
      ingredients.push({
        item: ingredient.trim(),
        amount: measure ? measure.trim() : '1',
        unit: ''
      })
    }
  }

  return ingredients
}
