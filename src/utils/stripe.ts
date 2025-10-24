import { supabase } from "@/integrations/supabase/client";

export async function checkout(priceOrAmount: string | number) {
  try {
    // Debug logging to verify what we send to the Edge Function
    // Note: safe to log amount/price id, never log secrets
    // eslint-disable-next-line no-console
    console.log('[checkout] input:', priceOrAmount);
    let fn = 'create-checkout';
    const usingPriceId = (typeof priceOrAmount === 'string' && priceOrAmount.startsWith('price_'));

    const body = usingPriceId
      ? { priceId: priceOrAmount }
      : { amount: typeof priceOrAmount === 'string' ? parseFloat(priceOrAmount) : priceOrAmount };

    // Append query param as a fallback path for environments where body parsing fails
    if (usingPriceId) {
      fn = `create-checkout?priceId=${encodeURIComponent(String(priceOrAmount))}`;
    } else {
      const amountNum = (body as any).amount;
      fn = `create-checkout?amount=${encodeURIComponent(String(amountNum))}`;
    }
    // Ensure numeric amount is normalized to a number if provided as string
    if ((body as any).amount !== undefined) {
      const amt = typeof (body as any).amount === 'string' ? parseFloat((body as any).amount) : (body as any).amount;
      (body as any).amount = isFinite(amt) ? amt : undefined;
    }
    // eslint-disable-next-line no-console
    console.log('[checkout] invoking with body:', body);
    const { data, error } = await supabase.functions.invoke(fn, {
      body,
      headers: { 'Content-Type': 'application/json' }
    });
    // eslint-disable-next-line no-console
    console.log('[checkout] response:', { data, error });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    if (data?.url) {
      window.location.href = data.url as string;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (e) {
    console.error('Checkout error:', e);
    throw e;
  }
}

export async function manageBilling() {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    if (data?.url) {
      window.location.href = data.url as string;
    } else {
      throw new Error('No portal URL returned');
    }
  } catch (e) {
    console.error('Manage billing error:', e);
    throw e;
  }
}

