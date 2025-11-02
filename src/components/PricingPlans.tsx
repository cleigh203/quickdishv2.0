import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkout } from "@/utils/stripe";
import { useToast } from "@/hooks/use-toast";

export const PricingPlans = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (priceOrAmount: string | number) => {
    try {
      setLoading(true);
      console.log('[PricingPlans] subscribing with:', priceOrAmount);
      await checkout(priceOrAmount);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-xl">Free</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$0<span className="text-base font-normal">/mo</span></div>
          <ul className="mt-4 text-sm space-y-2">
            <li>Basic features</li>
            <li>Community recipes</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-xl">Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$2.99<span className="text-base font-normal">/mo</span></div>
          <ul className="mt-4 text-sm space-y-2">
            <li>Premium features</li>
            <li>Advanced AI tools</li>
          </ul>
          <Button className="mt-6 w-full" onClick={() => handleSubscribe(2.99)} disabled={loading}>
            {loading ? 'Loading…' : 'Subscribe'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPlans;

