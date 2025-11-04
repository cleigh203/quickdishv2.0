import { useState, useEffect } from "react";
import { User, ChefHat, Settings, Package, LogOut, Edit, Lock, Trash2, Loader2, Heart, Crown, HelpCircle, Palette, Mail, Calendar, Target, Download, Check } from "lucide-react";
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
import { useSubscription, useAIUsage, useSavedRecipesCount } from "@/hooks/useSubscription";
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
  subscription_status?: string | null;
  stripe_subscription_id?: string | null;
}

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut, checkSubscription } = useAuth();
  const { showOnboarding } = useOnboarding();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const [isPremium, setIsPremium] = useState(false);

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

  // Subscription hooks
  const { data: subscription } = useSubscription();
  const { data: aiUsage } = useAIUsage('recipe_generation');
  const { data: savedCount } = useSavedRecipesCount();

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profile data with subscription info - use timeout to prevent hanging
      const profileQueryPromise = supabase
        .from('profiles')
        .select('id, display_name, avatar_url, dietary_preferences, skill_level, favorite_cuisines, learning_goals, is_premium, theme_preference, has_completed_onboarding, created_at, free_generations_used_today, stripe_customer_id, stripe_subscription_id, subscription_status')
        .eq('id', user.id)
        .single();

      // Add timeout to prevent hanging (10 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile query timeout after 10 seconds')), 10000)
      );

      const { data: profileData, error: profileError } = await Promise.race([
        profileQueryPromise,
        timeoutPromise
      ]);

      if (profileError) throw profileError;

      setProfileData(profileData as ProfileData);
      // Update premium status from database
      setIsPremium(profileData?.is_premium || false);
      
      // All subscription data comes from profiles table (updated via webhooks)
      // No need to call check-subscription Edge Function
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: error.message || "Failed to load profile data",
        variant: "destructive"
      });
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
      
      if (newStatus) {
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

      // Refresh auth context to update isPremium throughout the app
      await checkSubscription();
      
      // Refresh profile to confirm
      fetchProfile();
    } catch (error: any) {
      console.error('Error toggling premium:', error);
      toast({
        title: "Error updating premium status",
        description: "Please try again",
      });
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      toast({
        title: 'Already installed',
        description: 'The app is already installed or not available for installation',
      });
      return;
    }

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
      <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-muted/20">
        {/* Skeleton Header */}
        <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 h-48 mb-8 animate-pulse" />
        
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* Skeleton Account Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-xl shadow-sm bg-card">
              <CardContent className="p-4">
                <div className="h-12 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm bg-card">
              <CardContent className="p-4">
                <div className="h-12 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
          
          {/* Skeleton Premium Card */}
          <Card className="rounded-xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="h-24 bg-muted animate-pulse rounded mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-muted animate-pulse rounded" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
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
        </div>

        {/* PREMIUM STATUS SECTION */}
        {!subscription?.isPremium ? (
          <>
            {/* FREE PLAN CARD */}
            <Card className="rounded-xl shadow-sm border-2 bg-card mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Free Plan</h2>
                    <p className="text-sm text-muted-foreground">Limited features</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/premium')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Upgrade
                  </Button>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">AI Recipes Today</p>
                    <p className="text-2xl font-bold text-green-600">
                      {aiUsage?.count || 0}/1
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Resets daily at 3 AM</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Saved Recipes</p>
                    <p className="text-2xl font-bold text-green-600">
                      {savedCount?.count || 0}/50
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">50 recipe limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UPGRADE TO PREMIUM CARD */}
            <Card className="rounded-xl shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="text-yellow-600" size={24} />
                  <h3 className="text-lg font-bold">Upgrade to Premium</h3>
                </div>
                
                <div className="bg-white rounded-lg p-3 mb-3">
                  <div className="text-3xl font-bold text-green-600">$2.99</div>
                  <div className="text-sm text-muted-foreground">per month • Cancel anytime</div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">5 AI Recipes Daily</p>
                      <p className="text-sm text-muted-foreground">vs 1 on free plan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Unlimited Chef Quinn AI Chat</p>
                      <p className="text-sm text-muted-foreground">Get cooking help anytime</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Nutritional Facts</p>
                      <p className="text-sm text-muted-foreground">Track calories & macros</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Unlimited Recipe Saves</p>
                      <p className="text-sm text-muted-foreground">vs 50 on free plan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Export as PDF</p>
                      <p className="text-sm text-muted-foreground">Print & share recipes</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/premium')}
                  className="w-full bg-green-600 hover:bg-green-700 text-base py-4"
                >
                  Upgrade to Premium Now
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
                          {/* PREMIUM USER CARD */}
              <Card className="rounded-xl shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Crown className="text-yellow-600" size={32} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold">Premium Member</h2>
                          {profileData?.subscription_status === 'cancel_at_period_end' && (
                            <Badge variant="outline" className="border-orange-500 text-orange-600">
                              Cancelling
                            </Badge>
                          )}
                        </div>
                                                  <p className="text-sm text-muted-foreground">$2.99/month</p>
                        {profileData?.subscription_status === 'cancel_at_period_end' && (
                          <p className="text-xs text-orange-600 mt-1">
                            Cancelling at end of billing period
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => setSubscriptionModalOpen(true)}
                    >
                      Manage Plan
                    </Button>
                  </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">AI Recipes Today</p>
                    <p className="text-2xl font-bold text-green-600">
                      {aiUsage?.count || 0}/5
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Resets daily at 3 AM</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Saved Recipes</p>
                    <p className="text-2xl font-bold text-green-600">
                      {savedCount?.count || 0}/∞
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Unlimited</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* YOUR PREMIUM BENEFITS */}
            <Card className="rounded-xl shadow-sm bg-card mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Your Premium Benefits</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={20} /> 5 AI recipes daily
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={20} /> Unlimited Chef Quinn chat
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={20} /> Nutritional facts unlocked
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={20} /> Unlimited recipe saves
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={20} /> PDF export enabled
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

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
              {showInstallButton && (
                <Button
                  variant="default"
                  className="w-full h-12 justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-[10px] mb-4"
                  onClick={handleInstallApp}
                >
                  <span className="text-base">📥</span>
                  <span className="text-[15px]">Install App</span>
                </Button>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 mt-4 mb-4">
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

        {/* DEVELOPER TESTING TOOLS - Only show in dev mode */}
        {import.meta.env.DEV && (
          <Card className="rounded-xl shadow-sm bg-card mt-6">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Developer Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                onClick={togglePremium}
                className={`w-full ${isPremium ? 'bg-green-100 border-green-500' : 'bg-gray-50'}`}
              >
                {isPremium ? '🔓 Dev Premium: ON' : '🔒 Dev Premium: OFF'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                {isPremium 
                  ? 'All premium features unlocked for testing' 
                  : 'Click to enable premium features for testing'
                }
              </p>
            </CardContent>
          </Card>
        )}

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
        subscriptionStatus={profileData?.subscription_status}
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
