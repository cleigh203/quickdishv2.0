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
    // Try new field names first, fallback to old field names if they don't exist
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('ai_generations_used_today, ai_generations_reset_date, free_generations_used_today, last_generation_reset_date, subscription_tier, is_premium')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    // Determine tier (premium or free)
    const tier = profile.subscription_tier === 'premium' || profile.is_premium ? 'premium' : 'free';

    // Get current date
    const today = new Date().toISOString().split('T')[0];
    
    // Use new field names if available, fallback to old field names
    const resetDate = profile.ai_generations_reset_date || profile.last_generation_reset_date || today;
    const needsReset = resetDate !== today;

    // Get current generations count (reset to 0 if new day)
    // Use new field names if available, fallback to old field names
    let currentGenerations = 0;
    if (!needsReset) {
      currentGenerations = profile.ai_generations_used_today ?? profile.free_generations_used_today ?? 0;
    }
    
    const limit = tier === 'premium' ? 5 : 1;

    if (currentGenerations >= limit) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: tier === 'premium'
            ? 'Daily limit of 5 AI generations reached. Try again tomorrow!'
            : 'Daily limit of 1 AI generation reached. Upgrade to Premium for 5 generations/day.'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'OpenAI rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API authentication failed. Please contact support.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
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
    recipe.ai_generated = true;
    recipe.verified = false;
    recipe.source = 'ai-generated';
    
    // No image for AI recipes (user doesn't care)
    recipe.image = null;
    recipe.imageUrl = null;

    console.log('Recipe generated successfully, inserting for user:', recipe.name);

    // Persist AI recipe for this user so it can be resolved later by Favorites and meal plans
    let recipeSaved = false;
    try {
      const { data: insertedRecipe, error: insertError } = await supabaseClient
        .from('generated_recipes')
        .insert({
          user_id: userId,
          recipe_id: recipe.id,
          name: recipe.name,
          description: recipe.description || '',
          cook_time: recipe.cookTime || '',
          prep_time: recipe.prepTime || '',
          difficulty: recipe.difficulty || 'Medium',
          servings: recipe.servings || 4,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          cuisine: recipe.cuisine || '',
          nutrition: recipe.nutrition || null,
          tags: recipe.tags || [],
          image_url: null,
        })
        .select('recipe_id')
        .single();
        
      if (insertError) {
        console.error('Failed to insert generated recipe:', insertError);
        // If it's a duplicate, that's okay - recipe already exists
        if (insertError.code !== '23505') { // 23505 = unique_violation
          console.error('❌ CRITICAL: Failed to save recipe to database:', insertError.message);
          throw new Error(`Failed to save recipe to database: ${insertError.message}`);
        }
        console.log('Recipe already exists in database, continuing...');
        recipeSaved = true; // Recipe exists, so it's saved
      } else {
        console.log('✅ Successfully saved AI recipe to generated_recipes:', insertedRecipe?.recipe_id);
        recipeSaved = true;
      }
    } catch (e) {
      console.error('❌ CRITICAL: Exception inserting generated recipe:', e);
      // Fail the request if database insert fails - we need the recipe in the database
      throw new Error(`Failed to save recipe: ${e.message || e}`);
    }

    // Update user's generation count ONLY AFTER successful recipe generation AND database save
    if (!recipeSaved) {
      throw new Error('Recipe not saved to database, cannot update counter');
    }

    const newCount = currentGenerations + 1;
    
    // Try to update with new field names first, fallback to old field names if columns don't exist
    const updateData: any = {
      ai_generations_used_today: newCount,
      ai_generations_reset_date: today
    };

    console.log(`🔄 Updating generation count: ${currentGenerations} → ${newCount} (limit: ${limit})`);
    let { error: updateError, data: updateData_result } = await supabaseClient
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('ai_generations_used_today, ai_generations_reset_date');

    // If update fails with new field names, try old field names as fallback
    if (updateError && updateError.message?.includes('column') && updateError.message?.includes('does not exist')) {
      console.log('⚠️ New field names not found, trying old field names...');
      const fallbackUpdateData: any = {
        free_generations_used_today: newCount,
        last_generation_reset_date: today
      };
      
      const fallbackResult = await supabaseClient
        .from('profiles')
        .update(fallbackUpdateData)
        .eq('id', userId)
        .select('free_generations_used_today, last_generation_reset_date');
      
      updateError = fallbackResult.error;
      updateData_result = fallbackResult.data;
      
      if (!updateError) {
        console.log('✅ Updated using fallback field names');
      }
    }

    if (updateError) {
      console.error('❌ CRITICAL: Failed to update generation count:', updateError);
      console.error('Update data attempted:', updateData);
      console.error('Error details:', JSON.stringify(updateError, null, 2));
      // This is critical - if we can't update the counter, we should fail the request
      // Otherwise users can generate unlimited recipes
      throw new Error(`Failed to update generation counter: ${updateError.message || 'Unknown error'}`);
    } else {
      console.log(`✅ Successfully updated generation count: ${currentGenerations} → ${newCount} (limit: ${limit})`);
      console.log('Updated profile data:', updateData_result);
    }

    console.log('✅ Recipe ready for user (session only):', recipe.name);

    return new Response(
      JSON.stringify({ 
        recipe,
        generationsRemaining: limit - (currentGenerations + 1)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-recipe-ai function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate recipe',
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
