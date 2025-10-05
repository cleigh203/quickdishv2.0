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
    const { recipeId, recipeName, prompt } = await req.json();

    if (!recipeId || !recipeName) {
      return new Response(
        JSON.stringify({ error: 'Recipe ID and name are required' }),
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

    console.log(`Generating new image for: ${recipeName}`);

    // Generate image using Lovable AI
    const imagePrompt = prompt || `High-quality, appetizing photo of ${recipeName}, professional food photography, restaurant-quality plating, natural lighting, shallow depth of field, 4K resolution`;

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

    console.log('Image generated successfully, updating database...');

    // Update recipe with new image
    const { data, error } = await supabase
      .from('recipes')
      .update({ image_url: generatedImage })
      .eq('id', recipeId)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      throw error;
    }

    console.log(`Successfully updated image for recipe: ${recipeName}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Image regenerated successfully',
        recipe: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in regenerate-recipe-image:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
