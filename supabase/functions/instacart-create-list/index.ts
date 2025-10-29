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
    const { recipe } = await req.json();

    if (!recipe || !recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Recipe object with ingredients array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use configured Instacart API key and base URL
    const INSTACART_API_KEY = Deno.env.get('INSTACART_API_KEY') || '';
    const INSTACART_BASE_URL = Deno.env.get('INSTACART_BASE_URL') || 'https://connect.instacart.com';
    if (!INSTACART_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'INSTACART_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Helper function to clean up ingredient names for Instacart search
    const cleanIngredientName = (name: string): string => {
      let cleaned = name.toLowerCase().trim();
      
      // Remove phrases that make search too specific
      cleaned = cleaned.replace(/\b(or|and)\b.*/gi, ''); // Remove "or lo mein noodles"
      cleaned = cleaned.replace(/\(.*?\)/g, ''); // Remove parenthetical notes
      cleaned = cleaned.replace(/,.*$/g, ''); // Remove everything after comma
      cleaned = cleaned.replace(/\b(chopped|diced|sliced|minced|crushed|fresh|dried|frozen|canned)\b/gi, '');
      cleaned = cleaned.replace(/\b(optional|to taste|if needed)\b/gi, '');
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      
      return cleaned;
    };

    // Transform recipe ingredients to Instacart recipe format
    const ingredients = recipe.ingredients.map((item: any) => {
      const rawItemName = item.item || item.name;
      
      // Clean up the item name for better Instacart matching
      const cleanedName = cleanIngredientName(rawItemName);
      
      // Parse quantity from amount field (e.g., "1", "2.5", "1/2")
      let quantity = 1;
      if (item.amount) {
        // Handle fractions like "1/2"
        if (typeof item.amount === 'string' && item.amount.includes('/')) {
          const [numerator, denominator] = item.amount.split('/').map(Number);
          quantity = numerator / denominator;
        } else {
          quantity = parseFloat(item.amount) || 1;
        }
      }
      
      // Get unit, default to 'each' if not provided
      const unit = item.unit || 'each';
      
      // Build display text with amount and unit
      const displayText = `${item.amount || '1'} ${unit} ${rawItemName}`.trim();
      
      // Return Instacart format with measurements
      return {
        name: cleanedName.toLowerCase(),
        display_text: displayText,
        measurements: [
          {
            quantity: quantity,
            unit: unit
          }
        ]
      };
    });

    // Clean instructions: remove numbering and brackets
    const cleanInstructions = (recipe.instructions || []).map((instruction: string) => 
      instruction.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '').trim()
    );

    console.log('Original recipe:', JSON.stringify(recipe, null, 2));
    console.log('Transformed ingredients:', JSON.stringify(ingredients, null, 2));
    console.log('Cleaned instructions:', JSON.stringify(cleanInstructions, null, 2));

    const requestBody = {
      title: recipe.name || 'QuickDish Recipe',
      image_url: recipe.image_url || recipe.imageUrl || recipe.image || '',
      link_type: 'recipe',
      instructions: cleanInstructions,
      ingredients: ingredients,
      landing_page_configuration: {
        partner_linkback_url: 'https://www.quickdishco.com',
        enable_pantry_items: true
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Create recipe page using Instacart recipe endpoint
    const createListResponse = await fetch(`${INSTACART_BASE_URL}/idp/v1/products/recipe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${INSTACART_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    if (!createListResponse.ok) {
      const errorText = await createListResponse.text();
      console.error('Instacart create list API error:', createListResponse.status, errorText);

      if (createListResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Instacart rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (createListResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Instacart API authentication failed.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (createListResponse.status === 400) {
        let errorDetails = 'Bad request';
        try {
          const errorData = JSON.parse(errorText);
          errorDetails = errorData.message || errorText;
        } catch (e) {
          errorDetails = errorText;
        }
        return new Response(
          JSON.stringify({ error: `Invalid request: ${errorDetails}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Instacart API error: ${createListResponse.status}`);
    }

    const listData = await createListResponse.json();
    console.log('Instacart recipe page created:', listData);

    // recipe endpoint returns "products_link_url" field
    if (!listData.products_link_url) {
      console.error('No products_link_url in response:', listData);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Instacart',
          details: listData,
          recipe_sent: {
            title: requestBody.title,
            ingredients_count: ingredients.length,
            instructions_count: cleanInstructions.length
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Replace dev URL with production URL for customer-facing link
    let productUrl = listData.products_link_url;
    if (productUrl.includes('customers.dev.instacart.tools')) {
      productUrl = productUrl.replace('customers.dev.instacart.tools', 'www.instacart.com');
      console.log('Replaced dev URL with production URL');
    }
    
    // Append Impact.com UTM parameters for affiliate commission tracking
    const utmParams = '?utm_campaign=instacart-idp&utm_medium=affiliate&utm_source=instacart_idp&utm_term=partnertype-mediapartner&utm_content=campaignid-20313_partnerid-4352633';
    const finalUrl = `${productUrl}${utmParams}`;

    console.log('Final URL with UTM params:', finalUrl);

    return new Response(
      JSON.stringify({
        success: true,
        products_link_url: finalUrl,
        ingredients_count: ingredients.length,
        instructions_count: cleanInstructions.length,
        recipe_title: requestBody.title
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in instacart-create-list function:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create Instacart shopping list',
        errorName: error.name,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
