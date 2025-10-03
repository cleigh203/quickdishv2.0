import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { handleSupabaseError } from '@/utils/errorHandling';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPremium: boolean;
  checkSubscription: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsPremium(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (!error && data?.subscribed) {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setIsPremium(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        // Handle session expiration
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check subscription when user signs in
        if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            checkSubscription();
          }, 0);
        }
        
        // Redirect to login if session expired while user is on a protected route
        if (event === 'SIGNED_OUT' && window.location.pathname !== '/auth') {
          setIsPremium(false);
          setTimeout(() => {
            const isProtectedRoute = !['/auth', '/'].includes(window.location.pathname);
            if (isProtectedRoute) {
              navigate('/auth');
            }
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check subscription on initial load if user is logged in
      if (session) {
        setTimeout(() => {
          checkSubscription();
        }, 0);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName
          }
        }
      });
      
      if (error) {
        const errorInfo = handleSupabaseError(error);
        return { error: { message: errorInfo.description, ...error } };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorInfo = handleSupabaseError(error);
      return { error: { message: errorInfo.description } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        const errorInfo = handleSupabaseError(error);
        return { error: { message: errorInfo.description, ...error } };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorInfo = handleSupabaseError(error);
      return { error: { message: errorInfo.description } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        const errorInfo = handleSupabaseError(error);
        return { error: { message: errorInfo.description, ...error } };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorInfo = handleSupabaseError(error);
      return { error: { message: errorInfo.description } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still navigate even if sign out fails
      navigate('/auth');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        const errorInfo = handleSupabaseError(error);
        return { error: { message: errorInfo.description, ...error } };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorInfo = handleSupabaseError(error);
      return { error: { message: errorInfo.description } };
    }
  };

  const value = {
    user,
    session,
    loading,
    isPremium,
    checkSubscription,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
