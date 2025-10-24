import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { manageBilling } from "@/utils/stripe";
import { supabase } from "@/integrations/supabase/client";
import PricingPlans from "@/components/PricingPlans";

export default function Billing() {
  const [status, setStatus] = useState<string>('free');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();
      if (data?.subscription_status) setStatus(data.subscription_status);
    };
    fetchStatus();
  }, []);

  const handleManage = async () => {
    try {
      setLoading(true);
      await manageBilling();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">Current status: <span className="font-medium">{status}</span></div>
          <Button onClick={handleManage} disabled={loading}>
            {loading ? 'Opening…' : 'Manage Billing'}
          </Button>
        </CardContent>
      </Card>

      <PricingPlans />
    </div>
  );
}

