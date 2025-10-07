-- Create user_subscriptions table for sensitive payment data
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_product_id TEXT,
  subscription_status TEXT,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing', NULL))
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - users can only view and update their own subscription
CREATE POLICY "Users can view their own subscription"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON public.user_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.user_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing data from profiles to user_subscriptions
INSERT INTO public.user_subscriptions (user_id, stripe_customer_id, stripe_subscription_id, stripe_product_id, subscription_status)
SELECT 
  id,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_product_id,
  subscription_status
FROM public.profiles
WHERE stripe_customer_id IS NOT NULL 
   OR stripe_subscription_id IS NOT NULL
   OR stripe_product_id IS NOT NULL
   OR subscription_status IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
  stripe_customer_id = EXCLUDED.stripe_customer_id,
  stripe_subscription_id = EXCLUDED.stripe_subscription_id,
  stripe_product_id = EXCLUDED.stripe_product_id,
  subscription_status = EXCLUDED.subscription_status;

-- Remove stripe fields from profiles table (security improvement)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_subscription_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_product_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_status;

-- Create index for faster subscription lookups
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(subscription_status) WHERE subscription_status = 'active';