import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();
    console.log('Generating recipes for ingredients:', ingredients);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional chef AI that creates detailed, creative recipes. 
Return ONLY valid JSON with no additional text. The JSON must be an array of exactly 5 recipe objects.
Each recipe must have:
- name (string): A creative, appetizing name
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

Make recipes diverse in cuisine styles and cooking methods. Be creative and specific with instructions.
Calculate realistic nutrition values based on the actual ingredients and portions used.`;

    const userPrompt = `Generate 5 diverse recipes using these ingredients: ${ingredients}. 
Each recipe should creatively use at least some of these ingredients. Include specific cooking techniques, temperatures, and timings.
Calculate accurate nutritional information per serving based on USDA nutritional databases for each ingredient and portion size.
Return ONLY the JSON array, no other text.`;

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
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('AI response content:', content);

    // Parse the JSON response
    let recipes;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      recipes = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    console.log('Successfully generated recipes:', recipes.length);

    return new Response(
      JSON.stringify({ recipes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-recipes function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate recipes' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
