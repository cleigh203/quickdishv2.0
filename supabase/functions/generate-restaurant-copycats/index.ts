import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESTAURANT_RECIPES = [
  { name: "Chipotle Carnitas Bowl", restaurant: "Chipotle" },
  { name: "Zuppa Toscana Soup", restaurant: "Olive Garden" },
  { name: "Chicken Nuggets", restaurant: "Chick-fil-A" },
  { name: "Chipotle Chicken Avocado Melt", restaurant: "Panera" },
  { name: "Orange Chicken", restaurant: "Panda Express" },
  { name: "Breadsticks", restaurant: "Olive Garden" },
  { name: "5-Cheese Ziti", restaurant: "Olive Garden" },
  { name: "Pumpkin Bread", restaurant: "Starbucks" },
  { name: "Fried Chicken", restaurant: "KFC" },
  { name: "Chili", restaurant: "Wendy's" },
  { name: "Egg McMuffin", restaurant: "McDonald's" },
  { name: "Mac & Cheese", restaurant: "Panera" },
  { name: "Fried Rice", restaurant: "Panda Express" },
  { name: "House Salad with Dressing", restaurant: "Olive Garden" },
  { name: "Coconut Shrimp", restaurant: "Red Lobster" },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const results = [];
    const errors = [];

    for (const recipe of RESTAURANT_RECIPES) {
      try {
        console.log(`Generating recipe for ${recipe.restaurant} ${recipe.name}`);

        // Generate recipe details
        const recipePrompt = `Create a detailed copycat recipe for ${recipe.restaurant}'s ${recipe.name}.

Return ONLY valid JSON in this EXACT format (no markdown, no extra text):
{
  "name": "${recipe.restaurant} ${recipe.name} (Copycat)",
  "description": "Recreate ${recipe.restaurant}'s famous ${recipe.name} at home! Tastes just like the original.",
  "prepTime": "15 min",
  "cookTime": "25 min",
  "servings": 4,
  "difficulty": "Medium",
  "cuisine": "American",
  "ingredients": [
    {"amount": "1", "unit": "lb", "item": "chicken breast"},
    {"amount": "2", "unit": "cups", "item": "flour"}
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tags": ["copycat", "${recipe.restaurant.toLowerCase()}", "restaurant-style"],
  "nutritionalInfo": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 18
  }
}

CRITICAL REQUIREMENTS:
- 5-15 ingredients with realistic amounts
- 4-10 clear, detailed instructions
- Safe cooking temperatures (165°F for chicken, 145°F for pork)
- Realistic prep/cook times
- Common, accessible ingredients
- Instructions must reference ingredients like "Add [2 cups flour]"`;

        const recipeResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a professional chef creating authentic restaurant copycat recipes. Return ONLY valid JSON, no markdown formatting.'
              },
              {
                role: 'user',
                content: recipePrompt
              }
            ],
            temperature: 0.7,
          }),
        });

        if (!recipeResponse.ok) {
          throw new Error(`Recipe generation failed: ${recipeResponse.status}`);
        }

        const recipeData = await recipeResponse.json();
        let recipeContent = recipeData.choices[0].message.content;
        
        // Clean up markdown formatting
        recipeContent = recipeContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const recipeJson = JSON.parse(recipeContent);

        console.log(`Generating image for ${recipe.restaurant} ${recipe.name}`);

        // Generate image
        const imagePrompt = `Professional food photography of ${recipe.restaurant} ${recipe.name}. High quality, appetizing, restaurant-style plating, natural lighting, 4K resolution, close-up shot showing texture and details.`;

        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: imagePrompt
              }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!imageResponse.ok) {
          throw new Error(`Image generation failed: ${imageResponse.status}`);
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          throw new Error('No image URL in response');
        }

        // Save to database
        const recipeId = `copycat-${recipe.restaurant.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${recipe.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        
        const { data: insertedRecipe, error: insertError } = await supabase
          .from('recipes')
          .insert({
            recipe_id: recipeId,
            name: recipeJson.name,
            description: recipeJson.description,
            cuisine: recipeJson.cuisine || 'American',
            difficulty: recipeJson.difficulty,
            prep_time: recipeJson.prepTime,
            cook_time: recipeJson.cookTime,
            servings: recipeJson.servings,
            ingredients: recipeJson.ingredients,
            instructions: recipeJson.instructions,
            tags: recipeJson.tags,
            nutrition: recipeJson.nutritionalInfo,
            image_url: imageUrl,
            category: 'Restaurant Copycats',
            source: 'ai_generated',
            ai_generated: true,
            needs_validation: true,
            verified: false,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        results.push({
          recipe: `${recipe.restaurant} ${recipe.name}`,
          success: true,
          recipeId: insertedRecipe.recipe_id
        });

        console.log(`✅ Successfully created: ${recipe.restaurant} ${recipe.name}`);

      } catch (error) {
        console.error(`❌ Failed to generate ${recipe.restaurant} ${recipe.name}:`, error);
        errors.push({
          recipe: `${recipe.restaurant} ${recipe.name}`,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated: results.length,
        total: RESTAURANT_RECIPES.length,
        results,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-restaurant-copycats:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
