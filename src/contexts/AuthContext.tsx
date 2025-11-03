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

      // 🔓 DEV MODE OVERRIDE: Check environment variable first
      // Set VITE_DEV_PREMIUM_ENABLED=true in .env.local for testing
      if (import.meta.env.VITE_DEV_PREMIUM_ENABLED === 'true') {
        console.log('🔓 DEV MODE: Premium features enabled via environment variable');
        setIsPremium(true);
        return;
      }

      // 🔓 TESTING BYPASS: Check database first (works in dev AND production)
      // This allows you to manually set is_premium in Supabase dashboard for testing
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();

        // Handle profile errors gracefully
        if (error) {
          console.error('Profile fetch error in AuthContext:', error);
        } else if (profile) {
          // Check for premium status based on subscription_tier
          const isPremiumUser = profile.subscription_tier === 'premium';
          if (isPremiumUser) {
            setIsPremium(true);
            console.log('👑 Premium enabled from database (subscription_tier)');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching profile in AuthContext:', error);
        // Continue with normal flow if profile fetch fails
      }

      // In dev mode, stop here (don't check Stripe)
      if (import.meta.env.DEV) {
        setIsPremium(false);
        console.log('🧪 Dev mode: No premium in database');
        return;
      }

      // Production: check via Stripe
      // TODO: Re-enable once check-subscription Edge Function is fixed
      // const { data, error } = await supabase.functions.invoke('check-subscription');
      
      // Temporarily disable Stripe check to prevent app hanging
      setIsPremium(false);
      
      // if (!error && data?.subscribed) {
      //   setIsPremium(true);
      // } else {
      //   setIsPremium(false);
      // }
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
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: displayName
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // User-friendly error message
        return { error: { message: 'Invalid email or password. Please try again.' } };
      }
      
      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        // Sign them out immediately
        await supabase.auth.signOut();
        return { 
          error: { 
            message: 'Please verify your email address before signing in. Check your inbox for the confirmation link.',
            code: 'EMAIL_NOT_VERIFIED',
            email: email
          } 
        };
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
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
