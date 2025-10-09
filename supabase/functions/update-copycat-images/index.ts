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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Import the image files as data URLs (these will be the base64 images we generated)
    const imageUpdates = [
      {
        recipe_id: 'copycat-mcdonald-s-egg-mcmuffin',
        image_url: '/src/assets/recipes/egg-mcmuffin-new.jpg'
      },
      {
        recipe_id: 'copycat-olive-garden-house-salad-with-dressing',
        image_url: '/src/assets/recipes/olive-garden-salad-new.jpg'
      },
      {
        recipe_id: 'copycat-panera-chipotle-chicken-avocado-melt',
        image_url: '/src/assets/recipes/panera-sandwich-new.jpg'
      },
      {
        recipe_id: 'copycat-olive-garden-5-cheese-ziti',
        image_url: '/src/assets/recipes/ziti-alforno-new.jpg'
      }
    ];

    const results = [];

    for (const update of imageUpdates) {
      const { error } = await supabase
        .from('recipes')
        .update({ image_url: update.image_url })
        .eq('recipe_id', update.recipe_id);

      if (error) {
        console.error(`Failed to update ${update.recipe_id}:`, error);
        results.push({ recipe_id: update.recipe_id, success: false, error: error.message });
      } else {
        console.log(`Updated ${update.recipe_id}`);
        results.push({ recipe_id: update.recipe_id, success: true });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Updated ${successCount}/${imageUpdates.length} recipes`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Update error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
