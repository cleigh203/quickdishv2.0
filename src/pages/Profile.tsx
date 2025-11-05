import { useState, useEffect, useRef } from 'react';
import { useAIUsage } from '@/hooks/useSubscription';
import { User, ChefHat, Settings, Package, LogOut, Edit, Lock, Trash2, Loader2, Heart, Crown, HelpCircle, Palette, Mail, Calendar, Target, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { EditPreferencesDialog } from "@/components/EditPreferencesDialog";
import { SubscriptionManagementModal } from "@/components/SubscriptionManagementModal";
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

  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('premiumUser') === 'true';
  });

  const [pantryItems, setPantryItems] = useState<string[] | null>(null);
  const [loadingPantry, setLoadingPantry] = useState(false);
  const [resetCountdown, setResetCountdown] = useState<string>("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const recipes = recipeStorage.getRecipes();
  const { savedRecipes } = useSavedRecipes();
  const { shoppingList } = useShoppingList();
  const { fetchPantryItems } = usePantryItems();
  const [pantryCount, setPantryCount] = useState(0);
  const { data: aiUsage, refetch: refetchAIUsage } = useAIUsage('recipe_generation');

  // Debug logging for AI limit (run when aiUsage or profileData changes)
  useEffect(() => {
    if (aiUsage && profileData) {
      console.log('AI Limit Debug (Profile):', {
        isPremium: profileData?.is_premium,
        aiUsage_limit: aiUsage?.limit,
        aiUsage_count: aiUsage?.count,
        user_is_premium: profileData?.is_premium
      });
    }
  }, [aiUsage, profileData]);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

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

  // Listen for PWA install prompt
  useEffect(() => {
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
      // Delete profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Sign out (this will trigger auth cleanup)
      await signOut();

      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted',
      });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error deleting account',
        description: error.message,
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

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-muted/20">
      {/* Test Premium Mode Warning Banner */}
      {import.meta.env.DEV && profileData?.is_premium && (
        <div className="bg-orange-500 text-white py-3 px-4 text-center font-semibold">
          ⚠️ TEST PREMIUM MODE ACTIVE - Not a real subscription
        </div>
      )}

      {/* PROFILE HEADER - Green Gradient */}
      <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white py-12 px-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center overflow-hidden ring-4 ring-white/20">
            {profileData?.avatar_url ? (
              <img
                src={profileData.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
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
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-xl shadow-sm bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-semibold truncate">{user?.email}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Member Since</div>
                <div className="font-semibold truncate">{new Date(user?.created_at || '').toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm bg-card col-span-2 cursor-pointer hover:shadow-md transition-shadow" onClick={handleSubscriptionAction}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {profileData?.is_premium ? (
                  <Crown className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Target className="w-5 h-5 text-green-600" />
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
                className={profileData?.is_premium ? "" : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"}
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

        {/* DAILY GENERATIONS CARD */}
        <Card className="rounded-xl shadow-sm bg-gradient-to-br from-green-100 to-emerald-100 border-emerald-200">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-emerald-900">Your Daily AI Generations</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-emerald-800">
                {profileData?.is_premium ? (
                  <>
                    {aiUsage ? `${aiUsage.count}/${aiUsage.limit} AI generations used today` : 'Loading...'}
                  </>
                ) : (
                  <>
                    {aiUsage ? `${aiUsage.count}/${aiUsage.limit} free generation${aiUsage.count !== 1 ? 's' : ''} used` : 'Loading...'}
                  </>
                )}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: aiUsage?.limit || 1 }, (_, i) => i).map(i => (
                  <span key={i} className={`w-2.5 h-2.5 rounded-full ${(aiUsage?.count ?? 0) > i ? 'bg-emerald-600' : 'bg-emerald-300'}`}></span>
                ))}
              </div>
            </div>
            <div className="text-sm text-emerald-900">
              {profileData?.is_premium ? (
                <>
                  <div>Premium: {aiUsage ? `${aiUsage.limit - (aiUsage.count || 0)} AI generation${(aiUsage.limit - (aiUsage.count || 0)) !== 1 ? 's' : ''} left today` : 'Loading...'}</div>
                </>
              ) : (
                <>
                  <div>Watch ads to unlock premium features:</div>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Chat with AI Chef (unlimited with ads)</li>
                    <li>Detailed Nutrition Info (unlimited with ads)</li>
                  </ul>
                  <div className="mt-2 text-emerald-800">Note: AI recipe generation limited to 1 per day</div>
                </>
              )}
            </div>
            <div className="text-sm text-emerald-900">Resets in: <span className="font-semibold">{resetCountdown}</span></div>
          </CardContent>
        </Card>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          {/* Saved Recipes */}
          <Card 
            className="rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/favorites')}
          >
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 mb-3">
                <Heart className="w-6 h-6 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 mb-3">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              {loadingPantry ? (
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-green-600 mb-1" />
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
              <Palette className="w-5 h-5 text-green-600" />
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

        {/* Install QuickDish Section */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-[10px] bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📱</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">Install QuickDish</h3>
                <p className="text-sm text-muted-foreground">
                  Install QuickDish on your device for quick access, offline recipes, and a native app experience right from your browser!
                </p>
              </div>
            </div>

                          {/* Install Button */}
              <Button
                variant="default"
                className="w-full h-12 justify-center gap-2 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold rounded-[10px] mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] transition-all"
                onClick={handleInstallApp}
              >
              <span className="text-base">📥</span>
              <span className="text-[15px]">Install App</span>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">or install manually</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Manual Instructions Box */}
            <div className="bg-[#f9fafb] dark:bg-gray-900/50 rounded-[10px] p-4 mb-4">
              <h4 className="text-sm font-bold text-foreground mb-3">How to Install:</h4>
              <ul className="space-y-2 text-[13px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span>📱</span>
                  <span><strong className="text-foreground">iOS Safari:</strong> Tap Share → Add to Home Screen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📱</span>
                  <span><strong className="text-foreground">Android Chrome:</strong> Tap Menu ⋮ → Install App</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📱</span>
                  <span><strong className="text-foreground">Desktop:</strong> Look for install icon in address bar</span>
                </li>
              </ul>
            </div>

            {/* Coming Soon Section */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3">Native Apps 🏷️ COMING SOON</h4>
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

        {/* SETTINGS */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full h-11 justify-center gap-2 border-green-600 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30"
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

      <SubscriptionManagementModal
        open={subscriptionModalOpen}
        onOpenChange={setSubscriptionModalOpen}
        subscriptionEnd={subscriptionEnd}
        onSubscriptionCanceled={handleSubscriptionCanceled}
      />

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
