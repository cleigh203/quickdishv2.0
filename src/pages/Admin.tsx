// TODO: REMOVE ENTIRE ADMIN PANEL BEFORE APP STORE SUBMISSION
// This is for development only - users should NEVER see this

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Database, Key, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storageData, setStorageData] = useState<any>({});
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Check if user is developer, redirect if not
    const isDeveloper = localStorage.getItem('developerMode') === 'true';
    if (!isDeveloper) {
      navigate('/profile');
      return;
    }

    // Load all localStorage data
    loadStorageData();
  }, [navigate]);

  const loadStorageData = () => {
    const data: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    setStorageData(data);
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ This will DELETE ALL app data. Continue?')) {
      localStorage.clear();
      toast({
        title: "All data cleared",
        variant: "destructive",
      });
      loadStorageData();
    }
  };

  const resetDailyLimit = () => {
    localStorage.setItem('recipesGenerated', '0');
    localStorage.setItem('lastResetDate', new Date().toISOString());
    toast({
      title: "Daily limit reset",
    });
    loadStorageData();
  };

  const disableDeveloperMode = () => {
    localStorage.removeItem('developerMode');
    toast({
      title: "Developer mode disabled",
    });
    navigate('/profile');
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('openai_api_key', apiKey);
    toast({
      title: "API key saved successfully",
    });
    loadStorageData();
    setApiKey("");
  };

  return (
    <div className="min-h-screen pb-20 px-4 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-400">Admin Panel</h1>
            <p className="text-muted-foreground">Developer Tools - Testing Only</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <Card className="glass-card border-red-500/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-red-400">Warning</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              This panel is for development testing only. It will be removed before App Store submission.
              Do not use in production builds.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <Database className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Storage Data</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Recipes: {storageData.recipes?.length || 0}
                </p>
                <p className="text-muted-foreground">
                  Favorites: {storageData.favorites?.length || 0}
                </p>
                <p className="text-muted-foreground">
                  Shopping Items: {storageData.shoppingList?.length || 0}
                </p>
                <p className="text-muted-foreground">
                  Daily Usage: {storageData.recipesGenerated || 0}/5
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <Key className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Settings</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Premium: {storageData.premiumUser === 'true' ? '✓ Active' : '✗ Inactive'}
                </p>
                <p className="text-muted-foreground">
                  Developer Mode: ✓ Active
                </p>
                <p className="text-muted-foreground">
                  OpenAI Key: {storageData.openai_api_key ? '✓ Set' : '✗ Not Set'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card mb-6">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold mb-4">OpenAI API Key</h3>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="sk-proj-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-background/50"
              />
              <Button
                onClick={saveApiKey}
                className="w-full"
                variant="outline"
              >
                Save API Key
              </Button>
              <p className="text-sm text-muted-foreground">
                Status: {storageData.openai_api_key ? '✓ Set' : '✗ Not Set'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            
            <Button
              onClick={resetDailyLimit}
              className="w-full"
              variant="outline"
            >
              Reset Daily Recipe Limit
            </Button>

            <Button
              onClick={() => {
                localStorage.setItem('premiumUser', 'true');
                loadStorageData();
                toast({ title: "Premium activated" });
              }}
              className="w-full"
              variant="outline"
            >
              Activate Premium Mode
            </Button>

            <Button
              onClick={disableDeveloperMode}
              className="w-full"
              variant="outline"
            >
              Disable Developer Mode
            </Button>

            <Button
              onClick={clearAllData}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Raw localStorage Data</h3>
            <pre className="bg-black/50 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(storageData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Admin;
