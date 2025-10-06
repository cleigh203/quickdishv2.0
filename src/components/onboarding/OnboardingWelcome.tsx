import { Button } from "@/components/ui/button";
import { ChefHat, Calendar, ShoppingCart } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export const OnboardingWelcome = () => {
  const { setCurrentStep, skipOnboarding } = useOnboarding();

  const benefits = [
    { icon: ChefHat, text: "350+ tested recipes", color: "bg-orange-100" },
    { icon: Calendar, text: "Smart meal planning", color: "bg-red-100" },
    { icon: ShoppingCart, text: "Auto shopping lists", color: "bg-orange-100" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-red-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
            <span className="text-5xl">🍳</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
          Welcome to QuickDish!
        </h1>

        {/* Tagline */}
        <p className="text-xl text-muted-foreground mb-8">
          Cook smarter, not harder
        </p>

        {/* Benefits */}
        <div className="space-y-4 mb-10">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${benefit.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg font-semibold text-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Primary Button */}
        <Button
          onClick={() => setCurrentStep(1)}
          className="w-full h-14 text-lg font-bold mb-4 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 shadow-lg hover:shadow-xl transition-all"
        >
          Show Me Around
        </Button>

        {/* Secondary Link */}
        <button
          onClick={skipOnboarding}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Skip Tutorial
        </button>

        {/* Small Text */}
        <p className="text-xs text-muted-foreground mt-6">
          You can replay this anytime in Settings
        </p>
      </div>
    </div>
  );
};
