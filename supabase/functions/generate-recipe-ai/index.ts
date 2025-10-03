import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm, userId } = await req.json();
    console.log('Generating recipe for:', searchTerm, 'user:', userId);
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check user's rate limit
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('ai_generations_today, last_generation_date, is_premium')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    // Check if we need to reset the counter (new day)
    const today = new Date().toISOString().split('T')[0];
    const lastGenDate = profile.last_generation_date;
    const needsReset = !lastGenDate || lastGenDate !== today;

    let currentGenerations = needsReset ? 0 : (profile.ai_generations_today || 0);
    const limit = profile.is_premium ? 10 : 2;

    if (currentGenerations >= limit) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: profile.is_premium 
            ? 'Daily limit of 10 AI generations reached. Try again tomorrow!'
            : 'Daily limit of 2 AI generations reached. Upgrade to Premium for 10 generations/day.'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional chef AI that creates detailed, delicious recipes. 
Return ONLY valid JSON with no additional text. The JSON must be a single recipe object.
The recipe must have:
- name (string): A creative, appetizing name for "${searchTerm}"
- description (string): A brief 1-2 sentence description
- cookTime (string): e.g., "30 minutes"
- prepTime (string): e.g., "15 minutes"
- difficulty (string): "Easy", "Medium", or "Hard"
- servings (number): typically 2-4
- ingredients (array): Each item has {amount: string, unit: string, item: string}
- instructions (array of strings): Step-by-step cooking instructions with specific temperatures and techniques
- cuisine (string): Type of cuisine (e.g., "Italian", "Asian", "Mexican")
- nutrition (object): Nutritional information per serving based on USDA data
  - calories (number): Total calories per serving
  - protein (number): Grams of protein per serving
  - carbs (number): Grams of carbohydrates per serving
  - fat (number): Grams of fat per serving
  - fiber (number): Grams of dietary fiber per serving
  - sugar (number): Grams of sugar per serving
  - servingSize (string): e.g., "1 cup", "2 pieces", "1 bowl"

Make the recipe creative, detailed, and delicious. Calculate realistic nutrition values.`;

    const userPrompt = `Create a detailed recipe for: ${searchTerm}. 
Include specific cooking techniques, temperatures, and timings.
Calculate accurate nutritional information per serving based on USDA nutritional databases.
Return ONLY the JSON object, no other text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('AI response content:', content);

    // Parse the JSON response
    let recipe;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      recipe = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Add AI-generated flag and ID
    recipe.id = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    recipe.isAiGenerated = true;
    recipe.generatedAt = new Date().toISOString();

    // Generate image for the recipe
    console.log('Generating image for recipe:', recipe.name);
    let imageUrl = null;
    
    try {
      const imagePrompt = `Professional food photography of ${recipe.name}, beautifully plated on a white dish, studio lighting, high-end restaurant quality, appetizing, detailed, 4k quality`;
      
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

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        console.log('Image generated successfully');
      } else {
        console.error('Image generation failed:', imageResponse.status);
      }
    } catch (imageError) {
      console.error('Error generating image:', imageError);
      // Continue without image - don't fail the whole request
    }

    // Add image to recipe (or use placeholder if generation failed)
    recipe.image = imageUrl || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80`;
    recipe.imageUrl = recipe.image;

    // Update user's generation count
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        ai_generations_today: currentGenerations + 1,
        last_generation_date: today
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update generation count:', updateError);
      // Don't fail the request if counter update fails
    }

    console.log('Successfully generated recipe with image:', recipe.name);

    return new Response(
      JSON.stringify({ 
        recipe,
        generationsRemaining: limit - (currentGenerations + 1)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-recipe-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate recipe' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
