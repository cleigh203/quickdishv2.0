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
        JSON.stringify({ error: 'recipes array is required' }),
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
      const { recipeId, prompt } = recipe;
      
      try {
        console.log(`Processing recipe: ${recipeId}`);
        
        // Fetch recipe from database
        const { data: recipeData, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single();

        if (fetchError || !recipeData) {
          results.push({
            recipeId,
            success: false,
            error: `Recipe not found: ${recipeId}`
          });
          continue;
        }

        // Generate image using Lovable AI
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
                content: prompt
              }
            ],
            modalities: ['image', 'text']
          })
        });

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`Image generation failed for ${recipeId}:`, errorText);
          results.push({
            recipeId,
            success: false,
            error: `Image generation failed: ${imageResponse.status}`
          });
          continue;
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          results.push({
            recipeId,
            success: false,
            error: 'No image URL in response'
          });
          continue;
        }

        // Update recipe with new image
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ image_url: imageUrl })
          .eq('id', recipeId);

        if (updateError) {
          console.error(`Failed to update recipe ${recipeId}:`, updateError);
          results.push({
            recipeId,
            success: false,
            error: `Database update failed: ${updateError.message}`
          });
          continue;
        }

        results.push({
          recipeId,
          recipeName: recipeData.name,
          success: true,
          message: 'Image regenerated successfully'
        });

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing ${recipeId}:`, error);
        results.push({
          recipeId,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch regeneration error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
