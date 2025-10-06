import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Start as true, will be updated from DB
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8; // Steps 1-7 + completion screen

  // Check database for onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('has_completed_onboarding')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          const completed = data.has_completed_onboarding || false;
          setHasSeenOnboarding(completed);
          
          // Show onboarding for new users
          if (!completed) {
            setIsOnboardingActive(true);
          }
        }
      } else {
        // Guest users - check localStorage
        const hasSeenLocal = localStorage.getItem('hasSeenOnboarding') === 'true';
        setHasSeenOnboarding(hasSeenLocal);
        if (!hasSeenLocal) {
          setIsOnboardingActive(true);
        }
      }
    };
    
    checkOnboardingStatus();
  }, []);

  const showOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingActive(true);
  };

  const completeOnboarding = async () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
    setCurrentStep(0);
    
    // Update database if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);
    }
  };

  const skipOnboarding = async () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
    setCurrentStep(0);
    
    // Update database if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);
    }
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
