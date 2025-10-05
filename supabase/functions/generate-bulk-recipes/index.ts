import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CRITICAL: These are the ONLY valid categories
const VALID_CATEGORIES = [
  'Halloween',
  'Fall Favorites',
  'Quick and Easy',
  'Restaurant Copycats',
  'Breakfast',
  'Lunch Ideas',
  'Dinner',
  'Desserts',
  'One Pot Wonders',
  'Healthy Bowls',
  'Leftover Magic',
  'Family Favorites',
] as const;

interface RecipeOptions {
  cuisine?: string;
  dietary?: string;
  cookTime?: number;
  restaurantName?: string;
  leftoverIngredient?: string;
}

interface GenerateRequest {
  category: string;
  count: number;
  options?: RecipeOptions;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, count, options = {} }: GenerateRequest = await req.json();

    // Validate category
    if (!VALID_CATEGORIES.includes(category as any)) {
      return new Response(
        JSON.stringify({
          error: `Invalid category: ${category}. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Generating ${count} recipes for category: ${category}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    const generatedRecipes = [];
    const errors = [];

    // Generate recipes one by one
    for (let i = 0; i < count; i++) {
      try {
        console.log(`Generating recipe ${i + 1}/${count}...`);

        // Build category-specific prompt
        let categoryGuidance = '';
        
        switch (category) {
          case 'Restaurant Copycats':
            const restaurant = options.restaurantName || 'popular restaurants';
            categoryGuidance = `
RESTAURANT COPYCAT RULES:
- Recipe must recreate a famous dish from ${restaurant}
- Include restaurant name in recipe name (e.g., "Chipotle Burrito Bowl", "Olive Garden Breadsticks")
- Description MUST say "Recreate [restaurant]'s famous [dish] at home!"
- Match the authentic flavors and techniques
- Examples: Panera Broccoli Cheddar Soup, Chick-fil-A Sandwich, Red Lobster Biscuits`;
            break;
            
          case 'Leftover Magic':
            const leftover = options.leftoverIngredient || 'common leftovers';
            categoryGuidance = `
LEFTOVER MAGIC RULES:
- Transform ${leftover} into a new delicious meal
- Recipe name MUST include "Leftover" (e.g., "Leftover Chicken Fried Rice")
- Description must mention what leftovers it uses
- Focus on 1-2 main leftover ingredients
- Make it feel like a completely new dish
- Examples: Leftover Turkey Soup, Leftover Mashed Potato Pancakes, Leftover Rice Casserole`;
            break;
            
          case 'Healthy Bowls':
            categoryGuidance = `
HEALTHY BOWLS RULES:
- MUST include: grain base + protein + vegetables + sauce/dressing
- Nutritionally balanced (protein 25-35g, carbs 40-60g, fat 15-25g)
- Colorful and Instagram-worthy presentation
- Mention bowl type in name (Buddha Bowl, Protein Bowl, Grain Bowl, etc.)
- Examples: Mediterranean Quinoa Bowl, Teriyaki Salmon Bowl, Mexican Burrito Bowl`;
            break;
            
          case 'Quick and Easy':
            categoryGuidance = `
QUICK AND EASY RULES:
- TOTAL TIME MUST BE UNDER 30 MINUTES (prepTime + cookTime < 30)
- Simple ingredients (8-10 max)
- Minimal steps (6-8 max)
- No complex techniques
- Perfect for weeknight dinners
- Description must mention speed`;
            break;
            
          case 'One Pot Wonders':
            categoryGuidance = `
ONE POT WONDERS RULES:
- MUST cook in ONE pot/pan only (no additional cookware)
- Description MUST mention "one pot" and easy cleanup
- Clearly state pot type in instructions (Dutch oven, skillet, etc.)
- Everything cooks together
- Examples: One Pot Pasta, One Pot Chicken and Rice, One Pot Chili`;
            break;
            
          case 'Halloween':
            categoryGuidance = `
HALLOWEEN RULES:
- Spooky, fun, or themed for Halloween parties
- Creative names (Witch's Brew, Monster Eyeballs, Graveyard Cake, etc.)
- Can be sweet or savory
- Kid-friendly or adult party food
- Festive presentation mentioned`;
            break;
            
          case 'Fall Favorites':
            categoryGuidance = `
FALL FAVORITES RULES:
- Seasonal ingredients (pumpkin, apple, squash, cinnamon, etc.)
- Warm, cozy, comfort food vibes
- Perfect for autumn weather
- Examples: Pumpkin Soup, Apple Crisp, Butternut Squash Risotto`;
            break;
            
          default:
            categoryGuidance = `
GENERAL RULES:
- Perfect for ${category} category
- Follow standard recipe guidelines
- Make it delicious and approachable`;
        }

        const systemPrompt = `You are an expert chef and recipe developer. Generate ONE complete, tested recipe that follows these requirements:

CATEGORY: ${category}
${categoryGuidance}

${options.cuisine ? `CUISINE: ${options.cuisine}` : ''}
${options.dietary ? `DIETARY: ${options.dietary}` : ''}
${options.cookTime ? `TIME LIMIT: Under ${options.cookTime} minutes total` : ''}

RECIPE STANDARDS:
- Use common, accessible ingredients available in most grocery stores
- Include precise measurements (cups, tablespoons, teaspoons, pounds, ounces)
- Safe cooking temperatures: 165°F for chicken, 145°F for pork/beef, 140°F for fish
- Realistic prep and cook times
- Default to 4-6 servings
- 5-15 ingredients total
- 4-12 clear, numbered steps
- Include difficulty level: Easy, Medium, or Hard
- Provide nutritional estimates (calories, protein, carbs, fat)

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "name": "Recipe Name",
  "description": "Brief 1-2 sentence description",
  "prepTime": 20,
  "cookTime": 30,
  "totalTime": 50,
  "servings": 4,
  "difficulty": "Easy",
  "cuisine": "Italian",
  "ingredients": [
    {"amount": 2, "unit": "cups", "name": "flour"},
    {"amount": 1, "unit": "tablespoon", "name": "olive oil"}
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tags": ["quick", "healthy"],
  "nutritionalInfo": {
    "calories": 350,
    "protein": 25,
    "carbs": 40,
    "fat": 12
  }
}`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate a unique ${category} recipe.` }
            ],
            temperature: 0.8,
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI API error (${aiResponse.status}):`, errorText);
          
          if (aiResponse.status === 429) {
            errors.push({ recipe: i + 1, error: 'Rate limit exceeded' });
            break; // Stop generating if rate limited
          }
          
          errors.push({ recipe: i + 1, error: `AI API error: ${aiResponse.status}` });
          continue;
        }

        const aiData = await aiResponse.json();
        let recipeData = aiData.choices?.[0]?.message?.content;

        if (!recipeData) {
          errors.push({ recipe: i + 1, error: 'No content in AI response' });
          continue;
        }

        // Clean markdown formatting if present
        recipeData = recipeData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let recipe;
        try {
          recipe = JSON.parse(recipeData);
        } catch (parseError) {
          console.error('Failed to parse recipe JSON:', recipeData);
          errors.push({ recipe: i + 1, error: 'Invalid JSON response from AI' });
          continue;
        }

        // Validate recipe with category-specific rules
        const validation = validateRecipe(recipe, category);
        if (!validation.valid) {
          console.warn(`Recipe validation failed:`, validation.errors);
          errors.push({ recipe: i + 1, error: `Validation failed: ${validation.errors.join(', ')}` });
          continue;
        }

        // Prepare recipe for database
        const recipeId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const dbRecipe = {
          recipe_id: recipeId,
          name: recipe.name,
          description: recipe.description,
          cuisine: recipe.cuisine || 'Various',
          difficulty: recipe.difficulty || 'Medium',
          prep_time: `${recipe.prepTime} min`,
          cook_time: `${recipe.cookTime} min`,
          servings: recipe.servings || 4,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          nutrition: recipe.nutritionalInfo ? {
            calories: recipe.nutritionalInfo.calories,
            protein: recipe.nutritionalInfo.protein,
            carbs: recipe.nutritionalInfo.carbs,
            fat: recipe.nutritionalInfo.fat,
            fiber: 0,
            sugar: 0,
            servingSize: `1 serving (serves ${recipe.servings || 4})`
          } : null,
          tags: [...(recipe.tags || []), category.toLowerCase()],
          image_url: `https://source.unsplash.com/800x600/?${encodeURIComponent(recipe.name)},food`,
          source: 'ai_generated',
          ai_generated: true,
          needs_validation: true,
          verified: false,
          kitchen_tested: false,
          generated_at: new Date().toISOString(),
        };

        // Save to database
        const { data: savedRecipe, error: dbError } = await supabase
          .from('recipes')
          .insert(dbRecipe)
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          errors.push({ recipe: i + 1, error: `Database error: ${dbError.message}` });
          continue;
        }

        console.log(`✓ Recipe ${i + 1} generated and saved: ${recipe.name}`);
        generatedRecipes.push(savedRecipe);

        // Small delay to avoid rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (recipeError) {
        console.error(`Error generating recipe ${i + 1}:`, recipeError);
        errors.push({ 
          recipe: i + 1, 
          error: recipeError instanceof Error ? recipeError.message : 'Unknown error' 
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated: generatedRecipes.length,
        requested: count,
        recipes: generatedRecipes,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-bulk-recipes function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function validateRecipe(recipe: any, category: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate category matches
  if (recipe.category && recipe.category !== category) {
    errors.push(`Category mismatch: expected ${category}, got ${recipe.category}`);
  }

  // Check required fields
  if (!recipe.name || recipe.name.trim().length === 0) {
    errors.push('Missing recipe name');
  }

  if (!recipe.description || recipe.description.trim().length === 0) {
    errors.push('Missing description');
  }

  // Category-specific validation
  switch (category) {
    case 'Quick and Easy':
      if (recipe.totalTime > 30) {
        errors.push(`Quick and Easy must be under 30 minutes (got ${recipe.totalTime})`);
      }
      if (recipe.ingredients?.length > 10) {
        errors.push(`Quick and Easy should have max 10 ingredients (got ${recipe.ingredients.length})`);
      }
      break;

    case 'Restaurant Copycats':
      const restaurantKeywords = ['chipotle', 'panera', 'olive garden', 'chick-fil-a', 'red lobster', 'pf chang', 'texas roadhouse', 'outback', 'applebee', 'cracker barrel'];
      const hasRestaurant = restaurantKeywords.some(keyword => 
        recipe.name?.toLowerCase().includes(keyword)
      );
      if (!hasRestaurant) {
        errors.push('Restaurant Copycats must include restaurant name in title');
      }
      break;

    case 'Leftover Magic':
      if (!recipe.name?.toLowerCase().includes('leftover')) {
        errors.push('Leftover Magic recipes must include "leftover" in name');
      }
      break;

    case 'One Pot Wonders':
      if (!recipe.description?.toLowerCase().includes('one pot') && 
          !recipe.description?.toLowerCase().includes('single pot')) {
        errors.push('One Pot Wonders must mention single pot in description');
      }
      break;

    case 'Healthy Bowls':
      if (!recipe.name?.toLowerCase().includes('bowl')) {
        errors.push('Healthy Bowls must include "bowl" in name');
      }
      // Check for balanced macros
      const nutrition = recipe.nutritionalInfo;
      if (nutrition) {
        if (nutrition.protein < 20 || nutrition.protein > 40) {
          errors.push(`Healthy Bowls should have 20-40g protein (got ${nutrition.protein}g)`);
        }
      }
      break;
  }

  // Validate ingredients
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length < 5 || recipe.ingredients.length > 15) {
    errors.push(`Invalid ingredients count: ${recipe.ingredients?.length || 0} (expected 5-15)`);
  } else {
    // Check for suspicious spice amounts
    for (const ing of recipe.ingredients) {
      const spices = ['cinnamon', 'pepper', 'salt', 'cumin', 'paprika', 'cayenne', 'nutmeg', 'cloves'];
      const isSpice = spices.some(spice => ing.name?.toLowerCase().includes(spice));
      
      if (isSpice && ing.unit === 'cups' && ing.amount > 5) {
        errors.push(`Suspicious spice amount: ${ing.amount} ${ing.unit} of ${ing.name}`);
      }
    }
  }

  // Validate instructions
  if (!Array.isArray(recipe.instructions) || recipe.instructions.length < 4 || recipe.instructions.length > 12) {
    errors.push(`Invalid instructions count: ${recipe.instructions?.length || 0} (expected 4-12)`);
  }

  // Validate times
  if (!recipe.prepTime || recipe.prepTime < 1 || recipe.prepTime > 180) {
    errors.push('Invalid prep time');
  }

  if (!recipe.cookTime || recipe.cookTime < 1 || recipe.cookTime > 300) {
    errors.push('Invalid cook time');
  }

  if (recipe.totalTime !== recipe.prepTime + recipe.cookTime) {
    errors.push(`Time mismatch: totalTime (${recipe.totalTime}) should equal prepTime (${recipe.prepTime}) + cookTime (${recipe.cookTime})`);
  }

  // Validate servings
  if (!recipe.servings || recipe.servings < 1 || recipe.servings > 12) {
    errors.push('Invalid servings (expected 1-12)');
  }

  // Validate difficulty
  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  if (!validDifficulties.includes(recipe.difficulty)) {
    errors.push(`Invalid difficulty: ${recipe.difficulty}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
