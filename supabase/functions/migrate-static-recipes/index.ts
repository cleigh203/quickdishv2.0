import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipes } = await req.json();

    if (!recipes || !Array.isArray(recipes)) {
      return new Response(
        JSON.stringify({ error: 'Recipes array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const results = [];

    for (const recipe of recipes) {
      console.log(`Processing recipe: ${recipe.name}`);

      try {
        // Generate ultra-realistic image using Lovable AI
        const imagePrompt = `Ultra photorealistic, professional food photography of ${recipe.name}. Shot with high-end DSLR camera, perfect lighting, restaurant quality presentation, garnished beautifully, sharp focus, natural colors, 8K resolution, magazine-worthy, no text, no watermarks, no logos, styled for fine dining menu`;

        console.log(`Generating image for: ${recipe.name}`);
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
          })
        });

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error('Image generation failed:', errorText);
          throw new Error(`Image generation failed: ${errorText}`);
        }

        const imageData = await imageResponse.json();
        const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!generatedImage) {
          throw new Error('No image was generated');
        }

        console.log(`Image generated successfully for: ${recipe.name}`);

        // Check if recipe already exists
        const { data: existingRecipes } = await supabase
          .from('recipes')
          .select('recipe_id')
          .eq('recipe_id', recipe.id)
          .limit(1);

        if (existingRecipes && existingRecipes.length > 0) {
          // Update existing recipe
          console.log(`Updating existing recipe: ${recipe.name}`);
          const { error: updateError } = await supabase
            .from('recipes')
            .update({
              name: recipe.name,
              description: recipe.description,
              cook_time: recipe.cookTime,
              prep_time: recipe.prepTime,
              difficulty: recipe.difficulty,
              servings: recipe.servings,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
              cuisine: recipe.cuisine,
              image_url: generatedImage,
              nutrition: recipe.nutrition || null,
              tags: recipe.tags || [],
              category: recipe.tags?.includes('copycat') ? 'Restaurant Copycats' : 
                        recipe.tags?.includes('dessert') ? 'Desserts' : 
                        recipe.tags?.includes('breakfast') ? 'Breakfast' : 
                        recipe.tags?.includes('lunch') ? 'Lunch' : 
                        'Dinner',
              verified: true,
              ai_generated: false,
              source: 'curated'
            })
            .eq('recipe_id', recipe.id);

          if (updateError) {
            throw updateError;
          }
        } else {
          // Insert new recipe
          console.log(`Inserting new recipe: ${recipe.name}`);
          const { error: insertError } = await supabase
            .from('recipes')
            .insert({
              recipe_id: recipe.id,
              name: recipe.name,
              description: recipe.description,
              cook_time: recipe.cookTime,
              prep_time: recipe.prepTime,
              difficulty: recipe.difficulty,
              servings: recipe.servings,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
              cuisine: recipe.cuisine,
              image_url: generatedImage,
              nutrition: recipe.nutrition || null,
              tags: recipe.tags || [],
              category: recipe.tags?.includes('copycat') ? 'Restaurant Copycats' : 
                        recipe.tags?.includes('dessert') ? 'Desserts' : 
                        recipe.tags?.includes('breakfast') ? 'Breakfast' : 
                        recipe.tags?.includes('lunch') ? 'Lunch' : 
                        'Dinner',
              verified: true,
              ai_generated: false,
              source: 'curated'
            });

          if (insertError) {
            throw insertError;
          }
        }

        console.log(`Successfully processed: ${recipe.name}`);
        results.push({
          recipeName: recipe.name,
          success: true,
          message: 'Recipe migrated with new image successfully'
        });

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error processing ${recipe.name}:`, error);
        results.push({
          recipeName: recipe.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        totalProcessed: results.length,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in migrate-static-recipes:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});