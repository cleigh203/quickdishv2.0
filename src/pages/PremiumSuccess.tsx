import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PremiumSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }

        // Check subscription status
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
        } else if (data?.subscribed) {
          toast.success("Premium activated!");
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkSubscription();
  }, [navigate]);

  const premiumFeatures = [
    "Nutritional Facts & Calorie Tracking",
    "Advanced Meal Planning Insights",
    "Detailed Macro Breakdowns",
    "Ad-Free Experience",
    "Priority Support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Welcome to Premium! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            Your free trial has started. You now have access to all premium features!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg mb-4">Your Premium Features:</h3>
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
            <p className="text-blue-900 dark:text-blue-100">
              <strong>5-Day Free Trial:</strong> Your card won't be charged for 5 days. 
              Cancel anytime from your Profile settings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => navigate('/generate')}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
            >
              Start Cooking
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="flex-1"
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumSuccess;
