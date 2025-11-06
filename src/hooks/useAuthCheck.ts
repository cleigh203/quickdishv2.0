import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthCheck = () => {
  const { user } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [modalFeature, setModalFeature] = useState('use this feature');

  const requireAuth = (action: string = 'use this feature'): boolean => {
    if (!user) {
      setModalFeature(action);
      setShowSignupModal(true);
      return false;
    }
    return true;
  };

  return {
    requireAuth,
    isAuthenticated: !!user,
    showSignupModal,
    setShowSignupModal,
    modalFeature
  };
};

