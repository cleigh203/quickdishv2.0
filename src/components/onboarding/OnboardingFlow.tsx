import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingWelcome } from "./OnboardingWelcome";
import { OnboardingTutorial } from "./OnboardingTutorial";

export const OnboardingFlow = () => {
  const { isOnboardingActive, currentStep } = useOnboarding();

  if (!isOnboardingActive) {
    return null;
  }

  // Step 0 = Welcome screen
  // Steps 1-5 = Tutorial steps
  if (currentStep === 0) {
    return <OnboardingWelcome />;
  }

  return <OnboardingTutorial />;
};
