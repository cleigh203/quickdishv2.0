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
    const { recipeNames } = await req.json();

    if (!recipeNames || !Array.isArray(recipeNames)) {
      return new Response(
        JSON.stringify({ error: 'Recipe names array is required' }),
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

    for (const recipeName of recipeNames) {
      console.log(`Processing recipe: ${recipeName}`);

      // Find recipe by name (case insensitive, partial match)
      const { data: recipes, error: searchError } = await supabase
        .from('recipes')
        .select('id, name')
        .ilike('name', `%${recipeName}%`)
        .limit(1);

      if (searchError || !recipes || recipes.length === 0) {
        console.error(`Recipe not found: ${recipeName}`);
        results.push({
          recipeName,
          success: false,
          error: 'Recipe not found in database'
        });
        continue;
      }

      const recipe = recipes[0];
      console.log(`Found recipe: ${recipe.name} (${recipe.id})`);

      try {
        // Generate image using Lovable AI
        const imagePrompt = `High-quality, ultra-realistic photo of ${recipe.name}, professional food photography, restaurant-quality plating, natural lighting, shallow depth of field, 8K resolution, photorealistic, detailed textures`;

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

        // Update recipe with new image
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ image_url: generatedImage })
          .eq('id', recipe.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`Successfully updated image for: ${recipe.name}`);
        results.push({
          recipeName: recipe.name,
          success: true,
          message: 'Image regenerated successfully'
        });
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
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in batch-regenerate-images:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
