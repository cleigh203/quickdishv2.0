import { ArrowLeft, Check, Crown, Zap, TrendingUp, Shield, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Premium = () => {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Recipe Chef",
      description: "Chat with AI about your saved recipes, get meal suggestions, and cooking tips. Unlimited conversations!",
      free: false,
      premium: true
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Nutritional Information",
      description: "Detailed nutrition facts for every recipe including calories, macros, and daily values",
      free: false,
      premium: true
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Meal Planning Insights",
      description: "Smart meal planning with nutritional balance tracking across your week",
      free: false,
      premium: true
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Ad-Free Experience",
      description: "Enjoy cooking without interruptions or advertisements",
      free: false,
      premium: true
    }
    // TODO V2.0: Re-enable AI recipe generation feature
    // {
    //   icon: <Crown className="w-6 h-6" />,
    //   title: "Recipe Generation",
    //   description: "AI-powered recipe creation from your ingredients",
    //   free: true,
    //   premium: true
    // }
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time with no penalties or fees."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Premium features will include a free trial period when payment processing launches."
    },
    {
      question: "What happens if I cancel?",
      answer: "You'll retain premium access until the end of your billing period, then revert to the free plan."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card border-b">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Premium</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold">Unlock Your Cooking Potential</h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Get access to nutritional insights, meal planning tools, and an ad-free cooking experience
          </p>
        </div>

        {/* Feature Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    {feature.premium && !feature.free && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      {feature.free ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4 h-4" />
                      )}
                      <span className="text-muted-foreground">Free</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {feature.premium && <Check className="w-4 h-4 text-green-500" />}
                      <span className="text-muted-foreground">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Premium Pricing</CardTitle>
            <p className="text-muted-foreground">
              {isPremium ? "You're already a Premium member!" : "Choose the plan that works for you"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium ? (
              <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg">
                <Crown className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Premium Active</h3>
                <p className="text-muted-foreground mb-6">
                  You have access to all premium features
                </p>
                <Button 
                  onClick={() => navigate('/profile')}
                  variant="outline"
                >
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <>
                <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                  <h3 className="font-bold text-xl mb-2">Premium Plan</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$2.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      5-day free trial
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      All premium features
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      Cancel anytime
                    </li>
                  </ul>
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
                    onClick={handleSubscribe}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Start Free Trial"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Premium;
