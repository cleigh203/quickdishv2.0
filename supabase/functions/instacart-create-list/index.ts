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
    const { items, title, imageUrl } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Items array is required and cannot be empty' }),
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

    // Transform shopping list items to Instacart products_link format
    const line_items = items.map((item: any) => {
      const rawItemName = item.item || item.name;
      
      // Clean up the item name for better Instacart matching
      const cleanedName = cleanIngredientName(rawItemName);
      
      // For shopping lists, we don't need precise measurements
      // Just send the item name with quantity 1
      return {
        name: cleanedName,
        quantity: 1,
        unit: 'each',
        display_text: cleanedName
      };
    });

    console.log('Original items:', JSON.stringify(items, null, 2));
    console.log('Transformed line_items:', JSON.stringify(line_items, null, 2));

    const requestBody = {
      title: title || 'QuickDish Shopping List',
      line_items: line_items,
      expires_in: 30
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Create shopping list page using Instacart products_link endpoint (DEVELOPMENT)
    const createListResponse = await fetch(`${INSTACART_BASE_URL}/idp/v1/products/products_link`, {
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
    console.log('Instacart shopping list created:', listData);

    // products_link endpoint returns "products_link_url" field
    if (!listData.products_link_url) {
      console.error('No products_link_url in response:', listData);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Instacart',
          details: listData,
          items_sent: line_items
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
        items_count: line_items.length
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
