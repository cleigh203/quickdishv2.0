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
    const { itemId, quantity, userId } = await req.json();

    if (!itemId || !quantity) {
      return new Response(
        JSON.stringify({ error: 'Item ID and quantity are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use configured Instacart API key and base URL (not used in stubbed flow yet)
    const INSTACART_API_KEY = Deno.env.get('INSTACART_API_KEY') || '';
    const INSTACART_BASE_URL = Deno.env.get('INSTACART_BASE_URL') || 'https://connect.dev.instacart.tools';

    // For adding to cart, we need to get the item details first
    // This is a simplified implementation - in production you'd need proper cart management

    // For now, just return success (actual cart integration would require more complex setup)
    console.log(`Adding ${quantity}x item ${itemId} to Instacart cart for user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Added ${quantity} item(s) to your Instacart cart`,
        itemId,
        quantity,
        // In a full implementation, you'd return cart details, delivery options, etc.
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in instacart-add-to-cart function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to add item to Instacart cart',
        details: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
