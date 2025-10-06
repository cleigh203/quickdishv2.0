import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingWelcome } from "./OnboardingWelcome";
import { OnboardingTutorial } from "./OnboardingTutorial";
import { OnboardingCompletion } from "./OnboardingCompletion";

export const OnboardingFlow = () => {
  const { isOnboardingActive, currentStep } = useOnboarding();

  if (!isOnboardingActive) {
    return null;
  }

  // Step 0 = Welcome screen
  // Steps 1-7 = Tutorial steps
  // Step 8 = Completion screen
  if (currentStep === 0) {
    return <OnboardingWelcome />;
  }

  if (currentStep === 8) {
    return <OnboardingCompletion />;
  }

  return <OnboardingTutorial />;
};
