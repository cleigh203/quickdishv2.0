import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!stripeSecret || !webhookSecret) {
      return new Response(JSON.stringify({ error: "Stripe secrets not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeApiVersion = Deno.env.get("STRIPE_API_VERSION");
    const stripe = new Stripe(stripeSecret, stripeApiVersion ? { apiVersion: stripeApiVersion as any } : {});

    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("Missing Stripe signature header");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Stripe signature verification failed:", message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Handle subscription events
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        // Find user by customer email if needed
        // In your flow, you persist stripe_customer_id in user_subscriptions; update by customerId

        // Update user_subscriptions
        await supabase
          .from('user_subscriptions')
          .upsert({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            subscription_status: status,
            stripe_product_id: subscription.items.data[0]?.price?.product as string | null,
            subscription_end_date: periodEnd,
          }, { onConflict: 'stripe_customer_id' });

        // Optionally flip profiles.is_premium based on status
        const isActive = status === 'active' || status === 'trialing' || status === 'past_due';
        // If you store user_id in user_subscriptions, you could update by user_id here after a lookup

        break;
      }
      default:
        // No-op for other events
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in stripe-webhook:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});


