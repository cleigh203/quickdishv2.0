import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export const OnboardingCompletion = () => {
  const { completeOnboarding } = useOnboarding();

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Celebration Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-red-600 rounded-full flex items-center justify-center shadow-xl animate-bounce">
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
          You're all set!
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Remember: Tap the <span className="font-bold text-primary">•••</span> button on any recipe to access all actions
        </p>

        {/* Visual Reminder */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border-2 border-primary/20">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-3xl">👆</span>
            <span className="text-6xl font-bold text-primary">•••</span>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your quick access to favorites, meal planning, shopping lists, and more!
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={completeOnboarding}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 shadow-lg hover:shadow-xl transition-all"
        >
          Start Cooking!
        </Button>

        {/* Small Text */}
        <p className="text-xs text-muted-foreground mt-6">
          You can replay this tutorial anytime from your Profile settings
        </p>
      </div>
    </div>
  );
};
