import { ArrowLeft, Crown, Check, Sparkles, MessageSquare, FileText, Save, Zap, Star, Shield, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Premium = () => {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubscribe = () => {
    if (!user) {
      navigate('/signup');
      return;
    }
    
    // Redirect to Stripe Payment Link with user ID for tracking
    const paymentLink = `https://buy.stripe.com/28E4gy867eM2gnHdLS3Ru00?client_reference_id=${user.id}`;
    window.location.href = paymentLink;
  };

  const faqs = [
    {
      question: "What's included in Premium?",
      answer: "Premium includes 5 AI recipe generations per day (vs 1 free), unlimited Chef Quinn AI chat, full nutritional information, unlimited recipe saves, PDF export, priority support, and early access to new features."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your Premium subscription at any time from your Profile page. Your subscription will remain active until the end of your billing period, and you'll continue to have access to all Premium features until then."
    },
    {
      question: "How do AI generations work?",
      answer: "AI generations allow you to create custom recipes based on ingredients you have. Free users get 1 generation per day, while Premium users get 5. The counter resets daily at midnight."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard encryption and security practices. Your payment information is processed securely by Stripe, and we never store your credit card details. Your recipe data and preferences are stored securely in our database."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and other payment methods supported by Stripe, including Apple Pay and Google Pay."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied with Premium, contact us within 30 days of your subscription for a full refund."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/discover')}
            className="text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Premium</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upgrade to QuickDish Premium</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-2">Unlock unlimited AI recipes and premium features</p>
          <p className="text-lg opacity-80">Get 5x more AI generations, unlimited saves, and exclusive features</p>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="border-2 border-muted hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold mt-2">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Browse 350+ curated recipes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Voice-controlled cooking mode</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>1 AI recipe generation per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Basic recipe search</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-primary shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
                Most Popular
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Premium
              </CardTitle>
              <div className="text-4xl font-bold mt-2">
                $2.99<span className="text-lg font-normal text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Cancel anytime</p>
            </CardHeader>
            <CardContent className="relative">
              <div className="mb-4">
                <p className="text-sm font-semibold text-primary mb-3">✨ Everything in Free, PLUS:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span><strong>5 AI recipe generations per day</strong> (vs 1 free)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Unlimited Chef Quinn AI chat</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Full nutritional information</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Save className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Unlimited recipe saves</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Export recipes to PDF</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Priority support</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Early access to new features</strong></span>
                  </li>
                </ul>
              </div>
              {isPremium ? (
                <Button variant="outline" className="w-full" disabled>
                  You're a Premium Member! 🎉
                </Button>
              ) : (
                <Button 
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 text-lg shadow-lg"
                >
                  Subscribe Now
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">Loved by home cooks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "QuickDish Premium has transformed my meal planning! The AI recipes are incredible and I love having unlimited saves."
                </p>
                <p className="text-sm font-semibold">- Sarah M.</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "The Chef Quinn AI chat is a game-changer! It answers all my cooking questions instantly. Worth every penny!"
                </p>
                <p className="text-sm font-semibold">- Mike R.</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "5 AI recipes per day means I never run out of ideas. The PDF export feature is perfect for meal prep!"
                </p>
                <p className="text-sm font-semibold">- Jessica L.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  {faq.question}
                  <span className="text-2xl">{expandedFaq === index ? '−' : '+'}</span>
                </CardTitle>
              </CardHeader>
              {expandedFaq === index && (
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Crown className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to upgrade?</h2>
          <p className="text-xl opacity-90 mb-8">Join thousands of home cooks who love QuickDish Premium</p>
          {isPremium ? (
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 border-0 px-8 py-6 text-lg font-bold"
              onClick={() => navigate('/profile')}
            >
              Manage Subscription
            </Button>
          ) : (
            <div className="space-y-4">
              <Button 
                onClick={handleSubscribe}
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 border-0 px-8 py-6 text-lg font-bold shadow-xl"
              >
                Start Premium - $2.99/month
              </Button>
              <div className="flex items-center justify-center gap-4 text-sm opacity-90">
                <Shield className="w-5 h-5" />
                <span>30-day money-back guarantee</span>
                <span>•</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Premium;
