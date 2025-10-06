import { useState, useEffect } from "react";
import { User, ChefHat, Settings, Package, LogOut, Edit, Lock, Trash2, Loader2, Heart, Crown, HelpCircle, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { PantryDialog } from "@/components/PantryDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { EditPreferencesDialog } from "@/components/EditPreferencesDialog";
import { SubscriptionManagementModal } from "@/components/SubscriptionManagementModal";
import { InstallButton } from "@/components/InstallButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { recipeStorage } from "@/utils/recipeStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useShoppingList } from "@/hooks/useShoppingList";
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
  pantry_items: string[] | null;
  has_completed_onboarding: boolean;
  theme_preference: string | null;
}

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { showOnboarding } = useOnboarding();
  const [isPantryDialogOpen, setIsPantryDialogOpen] = useState(false);
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
  const [devMode, setDevMode] = useState(() => {
    return localStorage.getItem('developerMode') === 'true';
  });
  const [tapCount, setTapCount] = useState(0);

  const recipes = recipeStorage.getRecipes();
  const { savedRecipes } = useSavedRecipes();
  const { shoppingList } = useShoppingList();

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileData(data);
      // Update premium status from database
      setIsPremium(data?.is_premium || false);
      
      // Get subscription end date if premium
      if (data?.is_premium) {
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
          title: "Premium activated! 👑",
          description: "Enjoy all premium features for testing",
        });
      } else {
        toast({
          title: "Premium deactivated",
          description: "Back to free tier",
        });
      }

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

  const handleVersionTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount === 5) {
      setDevMode(true);
      localStorage.setItem('developerMode', 'true');
      toast({
        title: "Developer mode activated! 🛠️",
      });
      setTapCount(0);
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

      {/* Header - Orange Gradient matching My Kitchen */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white py-12 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-white/90">Manage your preferences and cooking journey</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* User Info Section */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center overflow-hidden flex-shrink-0 mb-4">
                {profileData?.avatar_url ? (
                  <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {(profileData?.display_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">
                  {profileData?.display_name || 'User'}
                </h2>
                {profileData?.is_premium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 font-semibold">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-4">{user.email}</p>
              
              <Button
                variant="outline"
                onClick={() => setEditProfileOpen(true)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 mb-3">
                <ChefHat className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{recipes.length}</p>
              <p className="text-sm text-muted-foreground">Generated</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 mb-3">
                <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400 fill-orange-600 dark:fill-orange-400" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{savedRecipes.length}</p>
              <p className="text-sm text-muted-foreground">Saved</p>
            </CardContent>
          </Card>
          
          <Card 
            className="rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setIsPantryDialogOpen(true)}
          >
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 mb-3">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{profileData?.pantry_items?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Pantry Items</p>
            </CardContent>
          </Card>
        </div>

        {/* Preferences Section */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Preferences</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditPreferencesOpen(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Skill Level</p>
              <Badge className="rounded-full px-4 py-2 font-medium bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/30 capitalize">
                {profileData?.skill_level || 'Not set'}
              </Badge>
            </div>
            
            {profileData?.favorite_cuisines && profileData.favorite_cuisines.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Favorite Cuisines</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.favorite_cuisines.map((cuisine) => (
                    <Badge key={cuisine} className="rounded-full px-4 py-2 font-medium bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/30">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData?.learning_goals && profileData.learning_goals.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Learning Goals</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.learning_goals.map((goal) => (
                    <Badge key={goal} className="rounded-full px-4 py-2 font-medium bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/30">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
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

        {/* Subscription Management */}
        <Card className={`rounded-xl shadow-sm bg-card ${profileData?.is_premium ? 'border-2 border-primary' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                {profileData?.is_premium ? 'Premium Subscription' : 'Subscription'}
              </CardTitle>
              {profileData?.is_premium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {profileData?.is_premium ? (
              <>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    You have access to all premium features including nutritional information, 
                    meal planning insights, and an ad-free experience.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-lg hover:bg-muted"
                  onClick={handleSubscriptionAction}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upgrade to Premium to unlock nutritional information, meal planning insights, and an ad-free experience.
                  </p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:opacity-90"
                  onClick={handleSubscriptionAction}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={() => {
                showOnboarding();
                toast({
                  title: "Starting tutorial",
                  description: "Let's review the app features!",
                });
              }}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Show Tutorial Again
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={handleChangePassword}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeleteAccountOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* PWA Install */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Install App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Install QuickDish on your device for quick access, offline recipes, and a better experience.
            </p>
            <InstallButton />
          </CardContent>
        </Card>

        {/* Legal */}
        <Card className="rounded-xl shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>

        {/* Developer Tools - Test Premium Mode */}
        {import.meta.env.DEV && (
          <Card className="p-4 border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded-xl shadow-sm">
            <p className="font-bold text-orange-800 dark:text-orange-300 mb-3">🧪 Developer Tools</p>
            <p className="text-sm text-orange-700 dark:text-orange-400 mb-4">
              Test premium features without Stripe. Changes take effect immediately.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await supabase
                      .from('profiles')
                      .update({ 
                        subscription_status: 'active',
                        is_premium: true
                      })
                      .eq('id', user.id);
                    
                    toast({
                      title: "Test Premium Enabled! 👑",
                      description: "Refreshing page...",
                    });
                    setTimeout(() => window.location.reload(), 1000);
                  }
                }}
                variant="outline"
                className="border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/20 flex-1"
              >
                🧪 Enable Test Premium
              </Button>
              <Button 
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await supabase
                      .from('profiles')
                      .update({ 
                        subscription_status: 'inactive',
                        is_premium: false
                      })
                      .eq('id', user.id);
                    
                    toast({
                      title: "Premium Disabled",
                      description: "Refreshing page...",
                    });
                    setTimeout(() => window.location.reload(), 1000);
                  }
                }}
                variant="outline"
                className="border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex-1"
              >
                ❌ Disable Premium
              </Button>
            </div>
          </Card>
        )}

        {/* Hidden Developer Tools - Only visible when dev mode is active */}
        {devMode && (
          <>
            <Card className="rounded-xl shadow-sm bg-card border-red-500/50">
              <CardContent className="p-6 space-y-3">
                <p className="text-red-400 text-xs">⚠️ Advanced Developer Tools</p>
                <Button
                  onClick={() => navigate('/admin')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Open Admin Panel
                </Button>
                <Button
                  onClick={() => {
                    setDevMode(false);
                    localStorage.removeItem('developerMode');
                    toast({ title: "Developer mode disabled" });
                  }}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Hide Developer Tools
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        <div 
          onClick={handleVersionTap}
          className="text-xs text-muted-foreground text-center cursor-pointer py-4"
        >
          Version 1.0.0
        </div>
      </div>
      
      <PantryDialog 
        open={isPantryDialogOpen} 
        onOpenChange={setIsPantryDialogOpen}
        onUpdate={fetchProfile}
      />

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
