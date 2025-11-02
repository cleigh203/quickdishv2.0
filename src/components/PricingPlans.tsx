import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export const PricingPlans = () => {
  const { user } = useAuth();

  const handleSubscribe = () => {
    if (!user) return;
    
    // Redirect to Stripe Payment Link with user ID for tracking
    const paymentLink = `https://buy.stripe.com/28E4gy867eM2gnHdLS3Ru00?client_reference_id=${user.id}`;
    window.location.href = paymentLink;
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
          <Button className="mt-6 w-full" onClick={handleSubscribe}>
            Subscribe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPlans;

