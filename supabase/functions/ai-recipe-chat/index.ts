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

  // Validate JWT if provided (we allow both authed and anon, but prefer auth)
  const authHeader = req.headers.get('Authorization');

  try {
    // Parse request JSON safely
    let parsed: any = null;
    try {
      parsed = await req.json();
    } catch (_e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, savedRecipes, recipeContext, userId } = parsed || {};
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing OPENAI_API_KEY' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Auth check (no premium required - ad-gated on client side)
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Sign in required to use Chef Quinn' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Usage controls
    const MAX_MESSAGES_PER_DAY = parseInt(Deno.env.get('CHAT_MAX_MSGS_PER_DAY') || '20');
    const MIN_SECONDS_BETWEEN = parseInt(Deno.env.get('CHAT_MIN_SECONDS_BETWEEN') || '5');

    // Cooldown check (min seconds between messages)
    const { data: lastMsg } = await supabase
      .from('ai_chat_messages')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastMsg?.created_at) {
      const last = new Date(lastMsg.created_at).getTime();
      const now = Date.now();
      const elapsedSec = Math.floor((now - last) / 1000);
      if (elapsedSec < MIN_SECONDS_BETWEEN) {
        return new Response(
          JSON.stringify({ error: `Please wait ${MIN_SECONDS_BETWEEN - elapsedSec}s before sending another message.` }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Daily cap check
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: dailyCount } = await supabase
      .from('ai_chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', since);

    if ((dailyCount || 0) >= MAX_MESSAGES_PER_DAY) {
      return new Response(
        JSON.stringify({ error: `Daily chat limit reached (${MAX_MESSAGES_PER_DAY}/day). Try again tomorrow.` }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt: string;

    // If recipeContext is provided (from recipe detail page), use that
    if (recipeContext) {
      const ingredientsList = recipeContext.ingredients.map((ing: any) => 
        `${ing.amount} ${ing.unit} ${ing.item}`
      ).join(', ');
      
      systemPrompt = `You are Chef Quinn, a helpful cooking assistant for QuickDish app. 🧑‍🍳

Recipe Context:
📝 **${recipeContext.name}**
⏱️ Prep: ${recipeContext.prepTime} | Cook: ${recipeContext.cookTime}
👥 Servings: ${recipeContext.servings}
🏆 Difficulty: ${recipeContext.difficulty}

🛒 Ingredients: ${ingredientsList}

📋 Instructions:
${recipeContext.instructions.map((inst: string, i: number) => `${i + 1}. ${inst}`).join('\n')}

Guidelines:
- Answer questions about THIS specific recipe
- Keep responses SHORT and helpful (2-3 sentences max)
- Use emojis sparingly
- Be conversational and friendly
- Focus on practical cooking advice

Topics: substitutions, techniques, timing, scaling, storage, troubleshooting`;
    } else if (savedRecipes) {
      // Original behavior for general chat about saved recipes
      const recipeContext = savedRecipes.map((r: any) => 
        `- ${r.name} (${r.cookTime}, ${r.difficulty})`
      ).join('\n');

      systemPrompt = `You are Chef Quinn, a helpful cooking assistant for QuickDish app. 🧑‍🍳

User's Saved Recipes:
${recipeContext}

Guidelines:
- Keep responses SHORT (2-3 sentences max)
- Answer based ONLY on their saved recipes
- Be conversational and friendly
- When mentioning recipes, use: [RECIPE:recipe-id]
- If recipe not saved, tell them to save it first

Focus on practical cooking help!`;
    } else {
      throw new Error('No recipe context provided');
    }

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 350,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 401 || response.status === 403) {
          return new Response(
            JSON.stringify({ error: 'OpenAI authentication failed' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: 'OpenAI error', details: errText }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      const tokensUsed = data.usage?.total_tokens || 0;

      // Extract recipe IDs mentioned in response
      const recipeIdMatches = aiResponse.match(/\[RECIPE:([\w-]+)\]/g) || [];
      const recipeIds = recipeIdMatches.map((match: string) => 
        match.replace('[RECIPE:', '').replace(']', '')
      );

      // Save to database asynchronously (don't block response)
      supabase.from('ai_chat_messages').insert({
        user_id: userId,
        message,
        response: aiResponse,
        recipe_ids: recipeIds,
        tokens_used: tokensUsed,
      }).then(() => {
        console.log('Chat message saved to database');
      }).catch((err) => {
        console.error('Failed to save chat message:', err);
      });

      return new Response(
        JSON.stringify({ response: aiResponse, recipeIds, tokensUsed }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle timeout
      if (fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Request timed out. Chef Quinn is taking too long. Please try again.' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw fetchError;
    }

  } catch (error: any) {
    console.error('AI chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
