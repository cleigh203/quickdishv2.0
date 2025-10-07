-- Add DELETE policy to user_subscriptions table to prevent data tampering
-- Subscription deletions should only happen server-side through edge functions
CREATE POLICY "Prevent client-side deletion of subscription data"
  ON public.user_subscriptions
  FOR DELETE
  USING (false);