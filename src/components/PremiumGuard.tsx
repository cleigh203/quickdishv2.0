import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { trackUpgradeShown, trackUpgradeClicked } from "@/lib/aiChatAnalytics";

interface PremiumGuardProps {
  children: React.ReactNode;
}

export const PremiumGuard = ({ children }: PremiumGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setIsPremium(data?.subscription_status === "active");
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isPremium) {
    // Track upgrade shown
    if (user) {
      trackUpgradeShown('premium_guard', user.id);
    }

    const handleUpgradeClick = () => {
      if (user) {
        trackUpgradeClicked('premium_guard', user.id);
      }
      navigate("/premium");
    };

    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-90" />
          
          <CardHeader className="relative text-white space-y-4 pb-6">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-8 h-8" />
              <CardTitle className="text-3xl font-bold">Premium Feature</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6 bg-white/95 backdrop-blur-sm rounded-t-3xl p-8">
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                Unlock AI Chef Assistant
              </h3>
              <p className="text-lg text-gray-600">
                Chat with AI about your saved recipes, get cooking tips, and personalized recommendations
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                $2.99
              </div>
              <div className="text-gray-600 mt-1">per month</div>
            </div>

            <div className="space-y-3">
              {[
                "Unlimited AI chat conversations",
                "Personalized recipe recommendations",
                "Cooking tips and techniques",
                "Ingredient substitution advice",
                "Nutritional information & tracking",
                "Meal planning insights",
                "Ad-free experience"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                    <div className="rounded-full bg-white p-1">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleUpgradeClick}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Upgrade to Premium Now
            </Button>

            <p className="text-center text-sm text-gray-500">
              Cancel anytime. No hidden fees.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
