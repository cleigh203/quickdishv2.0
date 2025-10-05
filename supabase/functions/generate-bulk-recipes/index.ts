import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeOptions {
  cuisine?: string;
  dietary?: string;
  cookTime?: string;
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

        const systemPrompt = `You are an expert chef and recipe developer. Generate ONE complete, tested recipe that follows these requirements:

REQUIREMENTS:
- Category: ${category}
${options.cuisine ? `- Cuisine: ${options.cuisine}` : ''}
${options.dietary ? `- Dietary: ${options.dietary}` : ''}
${options.cookTime ? `- Cook Time Preference: ${options.cookTime}` : ''}

RECIPE STANDARDS:
- Use common, accessible ingredients available in most grocery stores
- Include precise measurements (cups, tablespoons, teaspoons, pounds, ounces)
- Safe cooking temperatures: 165°F for chicken, 145°F for pork/beef, 140°F for fish
- Realistic prep and cook times (prep: 10-45min, cook: 15-90min)
- Default to 4-6 servings
- 5-15 ingredients total
- 4-12 clear, numbered steps
- Include difficulty level: Easy, Medium, or Hard

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
  "tags": ["quick", "healthy"]
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

        // Validate recipe
        const validation = validateRecipe(recipe);
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
          nutrition: null,
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

function validateRecipe(recipe: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!recipe.name || recipe.name.trim().length === 0) {
    errors.push('Missing recipe name');
  }

  if (!recipe.description || recipe.description.trim().length === 0) {
    errors.push('Missing description');
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
