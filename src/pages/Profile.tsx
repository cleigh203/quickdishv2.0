import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useAIUsage } from '@/hooks/useSubscription';
import { User, ChefHat, Settings, Package, LogOut, Edit, Lock, Trash2, Loader2, Heart, Crown, HelpCircle, Palette, Mail, Calendar, Target, Download, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { EditPreferencesDialog } from "@/components/EditPreferencesDialog";
const SubscriptionManagementModal = lazy(() => import("@/components/SubscriptionManagementModal").then(m => ({ default: m.SubscriptionManagementModal })));
import { ThemeToggle } from "@/components/ThemeToggle";
import { recipeStorage } from "@/utils/recipeStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useShoppingList } from "@/hooks/useShoppingList";
import { usePantryItems } from "@/hooks/usePantryItems";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
  dietary_preferences: string[] | null;
  skill_level: string | null;
  favorite_cuisines: string[] | null;
  learning_goals: string[] | null;
  is_premium: boolean;
  pantry_items?: string[] | null;
  has_completed_onboarding: boolean;
  theme_preference: string | null;
  free_generations_used_today?: number | null;
}

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const { showOnboarding } = useOnboarding();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('premiumUser') === 'true';
  });

  const [pantryItems, setPantryItems] = useState<string[] | null>(null);
  const [loadingPantry, setLoadingPantry] = useState(false);
  const [resetCountdown, setResetCountdown] = useState<string>("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  const recipes = recipeStorage.getRecipes();
  const { savedRecipes } = useSavedRecipes();
  const { shoppingList } = useShoppingList();
  const { fetchPantryItems } = usePantryItems();
  const [pantryCount, setPantryCount] = useState(0);
  const { data: aiUsage, refetch: refetchAIUsage } = useAIUsage('recipe_generation');

  // Scroll restoration - ensures main pages start at top

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profile data (without sensitive payment info)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, dietary_preferences, skill_level, favorite_cuisines, learning_goals, is_premium, theme_preference, has_completed_onboarding, created_at, free_generations_used_today')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch subscription data separately (more secure)
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('stripe_customer_id, stripe_subscription_id, subscription_status, stripe_product_id')
        .eq('user_id', user.id)
        .single();

      // Combine data for ProfileData type
      const combinedData = {
        ...profileData,
        stripe_customer_id: subscriptionData?.stripe_customer_id || null,
        stripe_subscription_id: subscriptionData?.stripe_subscription_id || null,
        subscription_status: subscriptionData?.subscription_status || null,
        stripe_product_id: subscriptionData?.stripe_product_id || null,
      };

              setProfileData(combinedData as ProfileData);
        // Update premium status from database
        setIsPremium(profileData?.is_premium || false);
        
        // Subscription data is already in profiles table, no need to call Edge Function
        // Removed check-subscription Edge Function call - subscription data comes from profiles table via webhooks
        // setSubscriptionEnd(null); // Subscription end date not available in profiles table yet
        
        // Refetch AI usage to update generation counter with correct premium status
        refetchAIUsage();
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Handle Stripe success redirect with query params
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast({
        title: "✅ Premium activated!",
        description: "Your subscription is now active. Enjoy all premium features!",
        duration: 5000,
      });
      // Clean up URL
      window.history.replaceState({}, '', '/profile');
      // Refetch profile to update premium status
      if (user) {
        fetchProfile();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, toast, user]);

  // Live timer until local midnight
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setResetCountdown(`${h}h ${m}m`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // Load pantry count on mount
  useEffect(() => {
    const loadInitialPantryCount = async () => {
      if (!user) return;
      
      try {
        const items = await fetchPantryItems();
        setPantryCount(items.length);
      } catch (error) {
        console.error('Error loading initial pantry count:', error);
        setPantryCount(0);
      }
    };
    
    loadInitialPantryCount();
  }, [user, fetchPantryItems]);

  // Listen for PWA install prompt (only on web, not native apps)
  useEffect(() => {
    // Check if running as native app - don't show install prompt
    const checkNative = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
          setIsNativeApp(true);
          setShowInstallButton(false);
          return;
        }
      } catch {
        // Capacitor not available, continue with web check
      }
      
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallButton(true);
      };
      
      window.addEventListener('beforeinstallprompt', handler);
      
      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallButton(false);
      }
      
      return () => window.removeEventListener('beforeinstallprompt', handler);
    };
    
    checkNative();
  }, []);

  const loadPantryItems = async () => {
    // If already loaded, don't refetch
    if (pantryItems !== null || !user) return;

    setLoadingPantry(true);
    try {
      const items = await fetchPantryItems();
      setPantryItems(items.map(item => item.name));
      setPantryCount(items.length);
    } catch (error: any) {
      console.error('Error loading pantry items:', error);
      setPantryItems([]);
      setPantryCount(0);
    } finally {
      setLoadingPantry(false);
    }
  };

  const handlePantryClick = () => {
    loadPantryItems();
    navigate('/pantry');
  };

  const togglePremium = async () => {
    if (!user) return;
    
    const newStatus = !isPremium;
    
    try {
      // Update database
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: newStatus })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setIsPremium(newStatus);
      localStorage.setItem('premiumUser', newStatus.toString());
      
      if (newStatus) {
        localStorage.setItem('recipesGenerated', '0');
        toast({
          title: "🧪 Test Premium Activated!",
          description: "All premium features unlocked for testing",
        });
      } else {
        toast({
          title: "Test Premium Deactivated",
          description: "Reverted to free tier",
        });
      }

              // Refresh profile to confirm - no need to call checkSubscription Edge Function
        // Subscription data is already in profiles table and updated via webhooks
        fetchProfile();
        // Refetch AI usage to update generation counter immediately
        refetchAIUsage();
    } catch (error: any) {
      console.error('Error toggling premium:', error);
      toast({
        title: "Error updating premium status",
        description: "Please try again",
      });
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      // PWA install prompt is available, show it
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: 'App installed!',
          description: 'QuickDish has been added to your home screen',
        });
        setShowInstallButton(false);
      }
      
      setDeferredPrompt(null);
    } else {
      // PWA install prompt not available, show helpful message
      toast({
        title: 'Installation Instructions',
        description: "To install: Look for the install icon in your browser's address bar, or see manual instructions below",
      });
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      const userId = user.id;

      // Delete all user data in parallel for better performance
      const deletePromises = [
        // Delete saved recipes
        supabase.from('saved_recipes').delete().eq('user_id', userId),
        // Delete meal plans
        supabase.from('meal_plans').delete().eq('user_id', userId),
        // Delete generated recipes
        supabase.from('generated_recipes').delete().eq('user_id', userId),
        // Delete pantry items
        supabase.from('pantry_items').delete().eq('user_id', userId),
        // Delete shopping lists
        supabase.from('shopping_lists').delete().eq('user_id', userId),
        // Delete user subscriptions
        supabase.from('user_subscriptions').delete().eq('user_id', userId),
        // Delete profile data (must be last due to foreign key constraints)
        supabase.from('profiles').delete().eq('id', userId),
      ];

      const results = await Promise.allSettled(deletePromises);
      
      // Check for errors (ignore profile deletion error if other deletions failed)
      const errors = results
        .map((result, index) => {
          if (result.status === 'rejected') {
            return { index, error: result.reason };
          }
          if (result.status === 'fulfilled' && result.value.error) {
            return { index, error: result.value.error };
          }
          return null;
        })
        .filter(Boolean);

      // If profile deletion failed, that's critical
      const profileResult = results[results.length - 1];
      if (profileResult.status === 'rejected' || 
          (profileResult.status === 'fulfilled' && profileResult.value.error)) {
        throw new Error('Failed to delete account. Please contact support.');
      }

      // Log non-critical errors but don't fail
      if (errors.length > 0 && import.meta.env.DEV) {
        console.warn('Some user data deletion errors (non-critical):', errors);
      }

      // Note: Auth user deletion requires server-side admin access
      // The auth user will be automatically cleaned up by Supabase
      // or can be deleted via a server-side Edge Function if needed

      // Sign out (this will trigger auth cleanup)
      await signOut();

      toast({
        title: 'Account deleted',
        description: 'Your account and all associated data have been permanently deleted',
      });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      // Track account deletion errors in Sentry
      if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
        try {
          const Sentry = await import('@sentry/react');
          Sentry.captureException(error, {
            tags: {
              error_type: 'account_deletion_failed',
              user_id: user?.id,
            },
            level: 'error',
          });
        } catch (sentryError) {
          // Sentry not available
        }
      }
      
      toast({
        title: 'Error deleting account',
        description: error.message || 'Please try again or contact support',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
    });
  };

  const handleSubscriptionAction = () => {
    if (profileData?.is_premium) {
      setSubscriptionModalOpen(true);
    } else {
      navigate('/premium');
    }
  };

    const handleSubscriptionCanceled = async () => {
      await fetchProfile();
      // Refetch AI usage to update generation counter immediately
      refetchAIUsage();
    };

  if (!user) {
    return (
      <div className="min-h-screen pb-20 px-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Not Logged In</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to save your recipes and sync across devices
                </p>
                <Button onClick={() => navigate('/auth')} className="w-full">
                  Sign In / Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => { setError(null); fetchProfile(); }}>
              Try Again
            </Button>
          </CardContent>
        </Card>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-muted/20">
      {/* Test Premium Mode Warning Banner */}
      {import.meta.env.DEV && profileData?.is_premium && (
        <div className="bg-emerald-700 text-white py-3 px-4 text-center font-semibold">
          ⚠️ TEST PREMIUM MODE ACTIVE - Not a real subscription
        </div>
      )}

      {/* PROFILE HEADER - Orange Gradient */}
      <div className="relative bg-gradient-to-r from-[#047857] to-[#065f46] text-white py-12 px-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center overflow-hidden ring-4 ring-white/20">
            {profileData?.avatar_url ? (
              <img
                src={profileData.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
                decoding="sync"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/128/10b981/ffffff?text=User';
                }}
              />
            ) : (
              <span className="text-white text-3xl font-bold">{(profileData?.display_name || user?.email || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profileData?.display_name || 'Your Profile'}</h1>
            <button
              onClick={() => setEditProfileOpen(true)}
              className="text-white/90 underline-offset-2 hover:underline text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tutorial Button - Top Right Corner */}
        <button
          onClick={() => {
            showOnboarding();
            toast({
              title: "Starting tutorial",
              description: "Let's review the app features!",
            });
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
          title="Show Tutorial Again"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* ACCOUNT CARDS */}
        <div className="space-y-4">
          <Card className="rounded-xl shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Member Since</div>
                  <div className="font-semibold">{new Date(user?.created_at || '').toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Email</div>
                  <div className="font-semibold break-words">{user?.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm bg-card col-span-2 cursor-pointer hover:shadow-md transition-shadow" onClick={handleSubscriptionAction}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {profileData?.is_premium ? (
                  <Crown className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Target className="w-5 h-5 text-emerald-700" />
                )}
                <div>
                  <div className="text-xs text-muted-foreground">Plan</div>
                  <div className="font-semibold">
                    {profileData?.is_premium ? (
                      <span className="flex items-center gap-2">
                        Premium
                        <Badge className="bg-yellow-500 text-white">Active</Badge>
                      </span>
                    ) : (
                      'Free (Ad-Supported)'
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant={profileData?.is_premium ? "outline" : "default"}
                size="sm"
                className={profileData?.is_premium ? "" : "bg-gradient-to-r from-[#047857] to-[#065f46] hover:from-[#065f46] hover:to-[#047857]"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscriptionAction();
                }}
              >
                {profileData?.is_premium ? "Manage" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI GENERATIONS UPGRADE CARD */}
        {!profileData?.is_premium ? (
          <div className="rounded-xl shadow-lg bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 p-6 space-y-4">
            <div className="text-white">
              <h3 className="font-bold text-lg mb-2">Daily AI Recipe Generations</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold">
                  {aiUsage ? `${aiUsage.count || 0}/1 AI recipes used today` : 'Loading...'}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded-full ${(aiUsage?.count ?? 0) > 0 ? 'bg-white' : 'bg-white/40'}`}></span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min(((aiUsage?.count ?? 0) / 1) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* White Upgrade Card Inside */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-5 space-y-4">
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-2">Upgrade to Premium</h4>
                  <div className="flex items-center justify-center gap-4 text-sm mb-4">
                    <div className="text-gray-600">
                      <div className="font-semibold text-gray-900">Free</div>
                      <div>1 recipe/day</div>
                    </div>
                    <div className="text-2xl">→</div>
                    <div className="text-emerald-700">
                      <div className="font-semibold text-emerald-700">Premium</div>
                      <div>5 recipes/day</div>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleSubscriptionAction}
                  className="w-full bg-gradient-to-r from-[#047857] to-[#065f46] hover:from-[#065f46] hover:to-[#047857] text-white font-bold py-6 text-lg rounded-lg shadow-lg"
                >
                  Upgrade for $2.99/month
                </Button>
                
                <div className="text-xs text-center text-gray-500">
                  Resets in: <span className="font-semibold text-gray-700">{resetCountdown}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="rounded-xl shadow-sm bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-emerald-900">Your Daily AI Generations</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-emerald-800">
                  {aiUsage ? `${aiUsage.count}/${aiUsage.limit} AI generations used today` : 'Loading...'}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: aiUsage?.limit || 5 }, (_, i) => i).map(i => (
                    <span key={i} className={`w-2.5 h-2.5 rounded-full ${(aiUsage?.count ?? 0) > i ? 'bg-emerald-800' : 'bg-emerald-300'}`}></span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-emerald-900">
                <div>Premium: {aiUsage ? `${aiUsage.limit - (aiUsage.count || 0)} AI generation${(aiUsage.limit - (aiUsage.count || 0)) !== 1 ? 's' : ''} left today` : 'Loading...'}</div>
              </div>
              <div className="text-sm text-emerald-900">Resets in: <span className="font-semibold">{resetCountdown}</span></div>
            </CardContent>
          </Card>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          {/* Saved Recipes */}
          <Card 
            className="rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/saved')}
          >
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 mb-3">
                <Heart className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{savedRecipes.length}</p>
              <p className="text-sm text-muted-foreground">Saved</p>
            </CardContent>
          </Card>
          
          {/* Pantry Items */}
          <Card 
            className="rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
            onClick={handlePantryClick}
          >
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 mb-3">
                <Package className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              {loadingPantry ? (
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-700 mb-1" />
              ) : (
                <p className="text-4xl font-bold text-foreground mb-1">{pantryCount}</p>
              )}
              <p className="text-sm text-muted-foreground">My Pantry</p>
            </CardContent>
          </Card>
        </div>


        {/* Appearance Section */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-700" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-4">Choose your theme</p>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Install QuickDish Section - Only show on web, not native apps */}
        {!isNativeApp && (
        <Card className="rounded-xl shadow-sm bg-card">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-[10px] bg-gradient-to-r from-[#047857] to-[#065f46] flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📱</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Install QuickDish</h3>
                <p className="text-sm text-muted-foreground">
                  Visit our website on your device - your browser will prompt you to install automatically. Or manually install from your browser settings (look for install icon in address bar).
                </p>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3">Native Apps 👉 COMING SOON</h4>
              <div className="grid grid-cols-2 gap-3">
                {/* App Store Badge */}
                <div className="bg-gray-100 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 opacity-60">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍎</span>
                    <div className="text-[10px] leading-tight text-muted-foreground">
                      <div>Download on the</div>
                      <div className="font-semibold text-foreground">App Store</div>
                    </div>
                  </div>
                </div>
                {/* Google Play Badge */}
                <div className="bg-gray-100 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 opacity-60">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    <div className="text-[10px] leading-tight text-muted-foreground">
                      <div>Get it on</div>
                      <div className="font-semibold text-foreground">Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* SETTINGS */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full h-11 justify-center gap-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-500 dark:hover:bg-emerald-950/30"
              onClick={handleChangePassword}
            >
              <Lock className="w-4 h-4" /> Change Password
            </Button>
            <Button
              variant="destructive"
              className="w-full h-11 justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Legal */}
        <Card className="rounded-xl shadow-sm bg-card mt-6">
          <CardHeader>
            <CardTitle>Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={() => navigate('/about')}
            >
              About QuickDish
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={() => navigate('/terms')}
            >
              Terms of Service
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={() => navigate('/privacy')}
            >
              Privacy Policy
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={() => navigate('/help')}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & FAQ
            </Button>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="py-6 px-4 border-t border-gray-200 text-center text-sm text-gray-500 flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <ChefHat className="w-5 h-5" />
            <span className="font-semibold">QuickDish</span>
          </div>
          <div className="text-xs">Made with ❤️ for home cooks</div>
          <a href="mailto:info@quickdishco.com" className="hover:text-gray-700">info@quickdishco.com</a>
          <div className="text-xs">Version 1.0.0</div>
          <div className="text-xs">© 2025 QuickDish</div>
        </div>
      </div>
      
      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        currentDisplayName={profileData?.display_name || null}
        currentAvatarUrl={profileData?.avatar_url || null}
        onUpdate={fetchProfile}
      />

      <EditPreferencesDialog
        open={editPreferencesOpen}
        onOpenChange={setEditPreferencesOpen}
        currentPreferences={{
          dietary_preferences: profileData?.dietary_preferences || null,
          skill_level: profileData?.skill_level || null,
          favorite_cuisines: profileData?.favorite_cuisines || null,
          learning_goals: profileData?.learning_goals || null,
        }}
        onUpdate={fetchProfile}
      />

      <Suspense fallback={null}>
        <SubscriptionManagementModal
          open={subscriptionModalOpen}
          onOpenChange={setSubscriptionModalOpen}
          subscriptionEnd={subscriptionEnd}
          onSubscriptionCanceled={handleSubscriptionCanceled}
        />
      </Suspense>

      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your recipes, preferences, and data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
