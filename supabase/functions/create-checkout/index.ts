// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Parse body for priceId or amount (robust across content types)
    const contentType = req.headers.get('content-type') || '';
    let body: any = {};
    try {
      if (contentType.includes('application/json')) {
        body = await req.json();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await req.text();
        body = Object.fromEntries(new URLSearchParams(text));
      } else {
        const text = await req.text();
        try { body = JSON.parse(text); } catch { body = {}; }
      }
    } catch {
      body = {};
    }
    // Fallback to query params if body empty
    const urlObj = new URL(req.url);
    if (body.priceId === undefined && body.amount === undefined) {
      const qpPriceId = urlObj.searchParams.get('priceId');
      const qpAmount = urlObj.searchParams.get('amount');
      if (qpPriceId) body.priceId = qpPriceId;
      if (qpAmount) body.amount = parseFloat(qpAmount);
    }
    console.log('[CHECKOUT] headers:', Object.fromEntries(req.headers.entries()));
    console.log('[CHECKOUT] received body:', body);
    const raw = body?.priceId ?? body?.amount;
    if (raw === undefined || raw === null) throw new Error("priceId or amount is required");

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const stripeApiVersion = Deno.env.get("STRIPE_API_VERSION");
    const stripe = new Stripe(stripeSecret, stripeApiVersion ? { apiVersion: stripeApiVersion as any } : {});

    // Get existing stripe_customer_id from profiles, if any
    const { data: profileRows, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();
    if (profileError) {
      throw new Error(`Failed to load profile: ${profileError.message}`);
    }

    let customerId = profileRows?.stripe_customer_id as string | null;

    if (!customerId) {
      // Try to find by email
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { supabase_uid: user.id },
        });
        customerId = customer.id;
      }

      // Persist customer id to profiles
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
      if (updateError) {
        throw new Error(`Failed to save stripe customer id: ${updateError.message}`);
      }
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Build line item: if the input looks like a Stripe price id, use it; else treat as amount
    let lineItem: any;
    const isPriceId = typeof raw === 'string' && raw.startsWith('price_');
    if (isPriceId) {
      lineItem = { price: raw, quantity: 1 };
    } else {
      const amountNumber = typeof raw === 'number' ? raw : parseFloat(String(raw));
      if (!isFinite(amountNumber) || amountNumber <= 0) {
        throw new Error('Invalid amount');
      }
      console.log('[CHECKOUT] using dynamic amount (USD):', amountNumber);
      const unitAmount = Math.round(amountNumber * 100);
      lineItem = {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Premium Monthly' },
          unit_amount: unitAmount,
          recurring: { interval: 'month' }
        },
        quantity: 1
      };
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      customer_email: customerId ? undefined : user.email,
      line_items: [lineItem],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${origin}/billing?status=success`,
      cancel_url: `${origin}/billing?status=cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
