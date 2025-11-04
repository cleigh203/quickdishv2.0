import { ArrowLeft, Mail, Instagram, ChefHat, Calendar, ShoppingCart, Mic, Brain, Clock, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-red-600 text-white px-4 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/discover')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">About QuickDish</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Logo and Tagline */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src="/logo.svg" 
              alt="QuickDish Logo" 
              className="w-32 h-32 object-contain drop-shadow-2xl"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
              About QuickDish
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Making Cooking Effortless for Everyone
            </p>
          </div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            QuickDish was created with one goal: to make cooking easier, faster, and more enjoyable. 
            Whether you're a kitchen newbie or a seasoned chef, we've got the tools to help you create 
            delicious meals without the stress.
          </p>
        </div>

        {/* What Makes QuickDish Different */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-center mb-8">
            🌟 What Makes QuickDish Different
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🍳</span>
                <h4 className="text-xl font-bold">CHEF Curated Recipes</h4>
              </div>
              <p className="text-muted-foreground">
                From quick weeknight dinners to restaurant copycats, we've got something for every craving and occasion.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎃</span>
                <h4 className="text-xl font-bold">Seasonal Collections</h4>
              </div>
              <p className="text-muted-foreground">
                Fresh, timely recipes that celebrate what's in season—from fall favorites to holiday specials.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔥</span>
                <h4 className="text-xl font-bold">One Pot Wonders</h4>
              </div>
              <p className="text-muted-foreground">
                Maximum flavor, minimum cleanup. Perfect for busy weeknights.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🍝</span>
                <h4 className="text-xl font-bold">Restaurant Copycats</h4>
              </div>
              <p className="text-muted-foreground">
                Recreate your favorite restaurant dishes at home—from Chipotle to Olive Garden.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-8 h-8 text-primary" />
                <h4 className="text-xl font-bold">AI-Powered Assistant</h4>
              </div>
              <p className="text-muted-foreground">
                Get instant answers to cooking questions, ingredient substitutions, and technique tips.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Mic className="w-8 h-8 text-primary" />
                <h4 className="text-xl font-bold">Voice-Controlled Cooking</h4>
              </div>
              <p className="text-muted-foreground">
                Hands-free, step-by-step instructions you can follow while you cook.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-8 h-8 text-primary" />
                <h4 className="text-xl font-bold">Smart Meal Planning</h4>
              </div>
              <p className="text-muted-foreground">
                Plan your week in minutes and never wonder "what's for dinner?"
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <h4 className="text-xl font-bold">Auto Shopping Lists</h4>
              </div>
              <p className="text-muted-foreground">
                Generate shopping lists from your meal plans—grocery shopping made simple.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-center mb-8">📱 Features</h3>
          <div className="max-w-2xl mx-auto">
            {/* Free Features */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
              <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                Features
              </h4>
              <p className="text-sm text-muted-foreground mb-4">(Always Free!)</p>
                              <ul className="space-y-2 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Browse Chef curated recipes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Save 50 of your favorite recipes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Weekly meal planning calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Auto-generate shopping lists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Instacart same-day delivery (with sign up)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Voice-controlled cooking mode</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Search & filter by category, time, difficulty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✅</span>
                    <span>Leftover Magic recipes</span>
                  </li>
                </ul>
            </div>
          </div>
        </section>

        {/* Recipe Categories */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-center mb-8">🎯 Our Recipe Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "Holiday",
              "Seasonal Favorites",
              "Quick & Easy",
              "Restaurant Copycats",
              "Breakfast",
              "Lunch Ideas",
              "Dinner",
              "Desserts",
              "One Pot Wonders",
              "Healthy Bowls",
              "Leftover Magic",
              "Family Favorites"
            ].map((category) => (
              <div 
                key={category}
                className="bg-card rounded-lg p-4 text-center border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <p className="font-semibold text-sm">{category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Perfect For */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-center mb-8">💡 Perfect For</h3>
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <ul className="space-y-3 text-foreground/90">
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>Busy professionals with limited cooking time</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>Families looking for quick, healthy meals</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>College students learning to cook</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>Anyone who loves restaurant food but wants to save money</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>Meal preppers and planners</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>Home cooks who want to level up their skills</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Built With Love */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-center mb-8">🚀 Built With Love</h3>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl p-8 border-2 border-primary/20">
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              QuickDish is built by an ex restaurateur turned home cook. We believe cooking should be fun, 
              not stressful. Every feature is designed to save you time, reduce waste, and help you create 
              meals you'll love.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="text-xl font-bold text-primary">1.0</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Launched</p>
                <p className="text-xl font-bold text-primary">October 7, 2025</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="text-xl font-bold text-primary">iOS & Android</p>
                <p className="text-xs text-muted-foreground mt-1">(coming soon)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Get In Touch */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-center mb-8">📧 Get In Touch</h3>
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <p className="text-center text-muted-foreground mb-6">
              Have feedback? Found a bug? Want to suggest a recipe?
            </p>
            <div className="space-y-4">
              <a 
                href="mailto:info@quickdishco.com"
                className="flex items-center justify-center gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium">info@quickdishco.com</span>
              </a>
              <a 
                href="https://instagram.com/quickdishapp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" />
                <span className="font-medium">@quickdishapp</span>
              </a>
            </div>
            <p className="text-center text-muted-foreground mt-6">
              We'd love to hear from you!
            </p>
          </div>
        </section>

        {/* Thank You */}
        <section className="text-center space-y-4 py-8">
          <h3 className="text-3xl font-bold">🙏 Thank You</h3>
          <p className="text-xl text-muted-foreground">
            Thank you for choosing QuickDish. Happy cooking! 🍳
          </p>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default About;
