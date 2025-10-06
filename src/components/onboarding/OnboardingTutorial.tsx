import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useNavigate } from "react-router-dom";

export const OnboardingTutorial = () => {
  const { currentStep, setCurrentStep, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const [spotlightElement, setSpotlightElement] = useState<HTMLElement | null>(null);
  const [menuOpened, setMenuOpened] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Browse Recipes",
      description: "Browse 350+ recipes and tap any one to see details 🔍",
      targetSelector: ".recipe-card, [data-recipe-card]",
      action: () => {
        // User should click on a recipe to proceed
      },
    },
    {
      id: 2,
      title: "Recipe Actions Menu",
      description: "Tap these three dots to see all recipe actions",
      subtitle: "This is your recipe action center - everything you need is here!",
      targetSelector: "[data-recipe-menu-button]",
      highlightPulse: true,
      autoOpen: true,
      action: () => {
        // Auto-open the menu
        const menuButton = document.querySelector('[data-recipe-menu-button]') as HTMLElement;
        if (menuButton && !menuOpened) {
          menuButton.click();
          setMenuOpened(true);
        }
      },
    },
    {
      id: 3,
      title: "Save Favorites",
      description: "Save recipes you love for quick access ❤️",
      targetSelector: "[data-menu-favorites]",
      keepMenuOpen: true,
    },
    {
      id: 4,
      title: "Meal Planning",
      description: "Schedule recipes to your weekly calendar 📅",
      targetSelector: "[data-menu-meal-plan]",
      keepMenuOpen: true,
    },
    {
      id: 5,
      title: "Shopping Lists",
      description: "Add all ingredients to your shopping list automatically 🛒",
      targetSelector: "[data-menu-shopping]",
      keepMenuOpen: true,
    },
    {
      id: 6,
      title: "Voice Cooking",
      description: "Follow hands-free, voice-controlled cooking instructions 🎙️",
      targetSelector: "[data-menu-cooking-mode]",
      keepMenuOpen: true,
    },
  ];

  const currentStepData = steps[currentStep - 1];

  useEffect(() => {
    if (currentStep > 0 && currentStep <= steps.length) {
      const stepData = steps[currentStep - 1];
      
      // Wait for DOM to be ready
      setTimeout(() => {
        const element = document.querySelector(stepData.targetSelector) as HTMLElement;
        setSpotlightElement(element);

        // Auto-open menu for step 2
        if (stepData.autoOpen && stepData.action) {
          setTimeout(() => {
            stepData.action?.();
          }, 500);
        }
      }, 300);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  if (currentStep === 0 || currentStep > steps.length) {
    return null;
  }

  // Calculate spotlight position
  const getSpotlightStyle = () => {
    if (!spotlightElement) return {};
    
    const rect = spotlightElement.getBoundingClientRect();
    const padding = 12;
    
    return {
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
    };
  };

  return (
    <>
      {/* Dark overlay with cutout */}
      <div 
        className="fixed inset-0 z-[90] pointer-events-none"
        style={{
          background: spotlightElement 
            ? `radial-gradient(circle at ${spotlightElement.getBoundingClientRect().left + spotlightElement.getBoundingClientRect().width / 2}px ${spotlightElement.getBoundingClientRect().top + spotlightElement.getBoundingClientRect().height / 2}px, transparent 0%, rgba(0,0,0,0.7) 250px)`
            : 'rgba(0,0,0,0.7)',
        }}
      />

      {/* Spotlight highlight */}
      {spotlightElement && (
        <div
          className={`fixed z-[95] rounded-2xl border-4 border-primary transition-all duration-300 pointer-events-none ${
            currentStepData?.highlightPulse ? 'animate-pulse' : ''
          }`}
          style={{
            ...getSpotlightStyle(),
            boxShadow: '0 0 0 4px rgba(255, 107, 53, 0.3), 0 0 40px rgba(255, 107, 53, 0.6)',
          }}
        />
      )}

      {/* Instruction tooltip */}
      <div className="fixed bottom-24 left-4 right-4 z-[100] animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto border-2 border-primary/20">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-foreground">{currentStepData?.title}</h3>
              <button
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-foreground mb-2">{currentStepData?.description}</p>
            {currentStepData?.subtitle && (
              <p className="text-sm text-primary font-semibold">{currentStepData.subtitle}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {currentStep < steps.length ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "Finish"
              )}
            </Button>
          </div>

          {/* Step counter */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </div>
    </>
  );
};
