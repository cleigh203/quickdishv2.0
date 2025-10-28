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
    const { searchTerm } = await req.json();

    if (!searchTerm) {
      return new Response(
        JSON.stringify({ error: 'Search term is required' }),
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

    // Note: Rate limiting is handled by Instacart API (429 responses)
    // In production, consider implementing Redis-based rate limiting for better control

    const searchUrl = `${INSTACART_BASE_URL}/idp/v1/search`;

    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
        'Authorization': `Bearer ${INSTACART_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchTerm,
        limit: 20,
        offset: 0
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Instacart search API error:', searchResponse.status, errorText);

      if (searchResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Instacart rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (searchResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Instacart API authentication failed.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Instacart API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('Instacart search response:', searchData);

    // Transform Instacart response to our format
    const items = (searchData.items || []).map((item: any) => ({
      id: item.id || item.sku,
      name: item.name,
      price: item.price || 0,
      unit: item.unit || 'each',
      store: item.store_name || 'Instacart',
      image: item.image_url || '',
      inStock: item.in_stock !== false,
      quantity: 1
    }));

    return new Response(
      JSON.stringify({
        items,
        totalResults: items.length,
        searchTerm,
        rawResponse: searchData // For debugging
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in instacart-search function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to search Instacart',
        details: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
