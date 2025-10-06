import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipeIds } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const results = [];

    for (const recipeId of recipeIds) {
      console.log(`Processing recipe ID: ${recipeId}`);
      
      try {
        // Get recipe details
        const { data: recipe, error: fetchError } = await supabase
          .from('recipes')
          .select('recipe_id, name')
          .eq('recipe_id', recipeId)
          .single();

        if (fetchError || !recipe) {
          console.error(`Recipe not found: ${recipeId}`);
          results.push({ recipeId, success: false, error: 'Recipe not found' });
          continue;
        }

        console.log(`Found: ${recipe.name}`);

        // Generate image
        const prompt = `Professional food photography of ${recipe.name}, restaurant quality, appetizing lighting, beautifully plated on elegant dishware, high resolution, food blog style, sharp focus, natural colors, no text or watermarks`;

        console.log(`Generating image with Gemini...`);
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [{ role: 'user', content: prompt }],
            modalities: ['image', 'text']
          })
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          throw new Error(`Gemini API error: ${aiResponse.status} - ${errorText}`);
        }

        const aiData = await aiResponse.json();
        const imageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          throw new Error('No image URL in response');
        }

        console.log(`✅ Image generated, updating database...`);

        // Update recipe
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ 
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('recipe_id', recipe.recipe_id);

        if (updateError) {
          throw new Error(`Update failed: ${updateError.message}`);
        }

        console.log(`✅ SUCCESS: ${recipe.name}`);
        results.push({ 
          recipeId: recipe.recipe_id,
          name: recipe.name,
          success: true
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Failed ${recipeId}:`, error);
        results.push({ 
          recipeId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        completed: `${successCount}/${results.length}`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
