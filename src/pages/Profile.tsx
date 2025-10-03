import { useState, useEffect } from "react";
import { User, ChefHat, Settings, Package, LogOut, Edit, Key, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { PantryDialog } from "@/components/PantryDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { EditPreferencesDialog } from "@/components/EditPreferencesDialog";
import { recipeStorage } from "@/utils/recipeStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
}

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isPantryDialogOpen, setIsPantryDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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
  
  // Lazy load pantry count
  const pantryCount = (() => {
    try {
      const saved = localStorage.getItem('pantryItems');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  })();

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
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const togglePremium = () => {
    const newStatus = !isPremium;
    setIsPremium(newStatus);
    localStorage.setItem('premiumUser', newStatus.toString());
    
    if (newStatus) {
      localStorage.setItem('recipesGenerated', '0');
      toast({
        title: "Premium activated! Unlimited recipes enabled 🎉",
      });
    } else {
      toast({
        title: "Switched to free tier (5 recipes/day)",
      });
    }
  };

  const handleVersionTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount === 7) {
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
    <div className="min-h-screen pb-24 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Profile Header */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {profileData?.avatar_url ? (
                  <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold truncate">
                  {profileData?.display_name || 'User'}
                </h1>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setEditProfileOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <ChefHat className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{recipes.length}</p>
              <p className="text-xs text-muted-foreground">Generated</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <User className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{savedRecipes.length}</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{pantryCount}</p>
              <p className="text-xs text-muted-foreground">Pantry</p>
            </CardContent>
          </Card>
        </div>

        {/* Preferences */}
        <Card className="glass-card mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Preferences</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditPreferencesOpen(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Skill Level</p>
              <Badge variant="secondary" className="capitalize">
                {profileData?.skill_level || 'Not set'}
              </Badge>
            </div>
            
            {profileData?.dietary_preferences && profileData.dietary_preferences.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Dietary Restrictions</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.dietary_preferences.map((pref) => (
                    <Badge key={pref} variant="outline">{pref}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData?.favorite_cuisines && profileData.favorite_cuisines.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Favorite Cuisines</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.favorite_cuisines.map((cuisine) => (
                    <Badge key={cuisine} variant="outline">{cuisine}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData?.learning_goals && profileData.learning_goals.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Learning Goals</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.learning_goals.map((goal) => (
                    <Badge key={goal} variant="outline">{goal}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pantry */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">My Pantry</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {pantryCount} {pantryCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <Button
              onClick={() => setIsPantryDialogOpen(true)}
              variant="outline"
              className="w-full"
            >
              Manage Pantry
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleChangePassword}
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => setDeleteAccountOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Developer Testing */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="text-xs text-muted-foreground mb-3">Developer Testing</div>
            <Button
              onClick={togglePremium}
              className={`w-full ${
                isPremium 
                  ? 'bg-gradient-to-r from-primary to-pink-500 text-white hover:opacity-90' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              size="lg"
            >
              {isPremium ? '⭐ Premium Active' : '🔓 Activate Premium (Testing)'}
            </Button>
          </CardContent>
        </Card>

        {devMode && (
          <Card className="glass-card mb-6 border-red-500/50">
            <CardContent className="p-6">
              <p className="text-red-400 text-xs mb-3">⚠️ Developer Tools</p>
              <Button
                onClick={() => navigate('/admin')}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Open Admin Panel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-red-600 border-red-600 hover:bg-red-50 mb-6"
          size="lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <div 
          onClick={handleVersionTap}
          className="text-xs text-muted-foreground text-center cursor-pointer"
        >
          Version 1.0.0
        </div>
      </div>
      
      <PantryDialog 
        open={isPantryDialogOpen} 
        onOpenChange={setIsPantryDialogOpen}
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
