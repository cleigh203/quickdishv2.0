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

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    // Find stripe_subscription_id from profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_subscription_id')
      .eq('id', user.id)
      .single();

    let subscriptionId: string | null = null;

    if (profileError || !profile?.stripe_subscription_id) {
      // Fallback to user_subscriptions table if not in profiles
      const { data: subscriptionData, error: subError } = await supabaseClient
        .from('user_subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', user.id)
        .single();

      if (subError || !subscriptionData?.stripe_subscription_id) {
        throw new Error("No subscription found for this user");
      }

      subscriptionId = subscriptionData.stripe_subscription_id;
    } else {
      subscriptionId = profile.stripe_subscription_id;
    }

    if (!subscriptionId) {
      throw new Error("No subscription ID found");
    }

    // Initialize Stripe
    const stripeApiVersion = Deno.env.get("STRIPE_API_VERSION");
    const stripe = new Stripe(stripeSecret, stripeApiVersion ? { apiVersion: stripeApiVersion as any } : {});

    // Cancel the subscription in Stripe
    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    // Update profiles table to remove premium status
    await supabaseClient
      .from('profiles')
      .update({ 
        is_premium: false,
        subscription_tier: 'free'
      })
      .eq('id', user.id);

    // Update user_subscriptions table
    await supabaseClient
      .from('user_subscriptions')
      .update({ 
        subscription_status: 'canceled',
        subscription_end_date: canceledSubscription.canceled_at 
          ? new Date(canceledSubscription.canceled_at * 1000).toISOString() 
          : new Date().toISOString()
      })
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        subscription_id: canceledSubscription.id,
        canceled_at: canceledSubscription.canceled_at 
          ? new Date(canceledSubscription.canceled_at * 1000).toISOString() 
          : null
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in cancel-subscription:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
