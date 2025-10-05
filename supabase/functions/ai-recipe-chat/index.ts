import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, savedRecipes, userId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user is premium
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .single();

    if (!profile?.is_premium) {
      return new Response(
        JSON.stringify({ error: 'Premium subscription required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context from saved recipes
    const recipeNames = savedRecipes.map((r: any) => r.name).join(', ');
    const recipeContext = savedRecipes.map((r: any) => 
      `- ${r.name} (${r.cookTime}, ${r.difficulty})`
    ).join('\n');

    const systemPrompt = `You are a helpful cooking assistant for QuickDish app. 🧑‍🍳

The user has these saved recipes:
${recipeContext}

Answer their cooking questions based ONLY on these recipes. Be conversational, friendly, and helpful. Use emojis for personality. 😊

When mentioning specific recipes, use this format: [RECIPE:recipe-id] so the UI can show the recipe card.

If they ask about a recipe not in their collection, tell them to save it first from the Recipes tab.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    // Extract recipe IDs mentioned in response
    const recipeIdMatches = aiResponse.match(/\[RECIPE:([\w-]+)\]/g) || [];
    const recipeIds = recipeIdMatches.map((match: string) => 
      match.replace('[RECIPE:', '').replace(']', '')
    );

    // Save to database
    await supabase.from('ai_chat_messages').insert({
      user_id: userId,
      message,
      response: aiResponse,
      recipe_ids: recipeIds,
      tokens_used: tokensUsed,
    });

    return new Response(
      JSON.stringify({ response: aiResponse, recipeIds, tokensUsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('AI chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
