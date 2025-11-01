import { useState, useEffect } from "react";
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
      
      // Get subscription end date if premium
      if (profileData?.is_premium) {
        const { data: subData } = await supabase.functions.invoke('check-subscription');
        if (subData?.subscription_end) {
          setSubscriptionEnd(subData.subscription_end);
        }
      }
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
          <Card className="rounded-xl shadow-sm bg-card col-span-2">
            <CardContent className="p-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-xs text-muted-foreground">Plan</div>
                <div className="font-semibold">Free (Ad-Supported)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DAILY GENERATIONS CARD */}
        <Card className="rounded-xl shadow-sm bg-gradient-to-br from-green-100 to-emerald-100 border-emerald-200">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-emerald-900">🎨 Your Daily AI Generations</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-emerald-800">
                {((profileData?.free_generations_used_today ?? 0))}/2 free generations used
              </span>
              <div className="flex items-center gap-1">
                {[0,1].map(i => (
                  <span key={i} className={`w-2.5 h-2.5 rounded-full ${ ((profileData?.free_generations_used_today ?? 0)) > i ? 'bg-emerald-600' : 'bg-emerald-300'}`}></span>
                ))}
              </div>
            </div>
            <div className="text-sm text-emerald-900">
              <div>Watch ads to unlock premium features:</div>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Chat with AI Chef (unlimited with ads)</li>
                <li>Detailed Nutrition Info (unlimited with ads)</li>
              </ul>
              <div className="mt-2 text-emerald-800">Note: AI recipe generation limited to 2 per day</div>
            </div>
            <div className="text-sm text-emerald-900">⏰ Resets in: <span className="font-semibold">{resetCountdown}</span></div>
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


        {/* SETTINGS */}
        <div className="space-y-3">
          {showInstallButton && (
            <Button
              variant="default"
              className="w-full h-11 justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleInstallApp}
            >
              <Download className="w-4 h-4" /> Install App
            </Button>
          )}
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
