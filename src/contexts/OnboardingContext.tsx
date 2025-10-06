import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingContextType {
  hasSeenOnboarding: boolean;
  showOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  isOnboardingActive: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('hasSeenOnboarding') === 'true';
  });
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5; // Will be updated when user sends rest of steps

  useEffect(() => {
    // Show onboarding automatically on first visit
    if (!hasSeenOnboarding) {
      setIsOnboardingActive(true);
    }
  }, [hasSeenOnboarding]);

  const showOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingActive(true);
  };

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
    setCurrentStep(0);
  };

  const skipOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
    setCurrentStep(0);
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasSeenOnboarding,
        showOnboarding,
        completeOnboarding,
        skipOnboarding,
        isOnboardingActive,
        currentStep,
        setCurrentStep,
        totalSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
