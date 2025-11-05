import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const usePremiumCheck = () => {
  const { isPremium, user } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [modalFeature, setModalFeature] = useState('access this premium feature');

  const requirePremium = (feature: string = 'access this premium feature'): boolean => {
    if (!user) {
      // User not logged in - could redirect to login or show signup modal
      return false;
    }

    if (!isPremium) {
      setModalFeature(feature);
      setShowPremiumModal(true);
      return false;
    }

    return true;
  };

  return {
    requirePremium,
    isPremium: !!isPremium,
    isAuthenticated: !!user,
    showPremiumModal,
    setShowPremiumModal,
    modalFeature
  };
};
