import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { toast } from "sonner";
import { Capacitor } from '@capacitor/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    // Check immediately on mount if native platform
    if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Don't show install prompt if running as native app (Android/iOS)
    if (Capacitor.isNativePlatform()) {
      setIsInstalled(true);
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a short delay (don't be too aggressive)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Thanks for installing QuickDish!');
      setIsInstalled(true);
    } else {
      toast.info('You can install QuickDish anytime from your browser menu');
    }
    
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    toast.info('You can install QuickDish anytime from Profile settings');
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-2 right-2 md:left-auto md:right-4 md:w-80 md:max-w-sm z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <button
          onClick={handleDismiss}
          className="absolute top-1 right-1 p-1 hover:bg-accent rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Download className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm mb-0.5">Install QuickDish</h3>
            <p className="text-xs text-muted-foreground leading-tight">
              Quick access, offline recipes, better experience
            </p>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button
            onClick={handleInstallClick}
            className="flex-1 text-xs py-1.5"
            size="sm"
          >
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="text-xs py-1.5 px-2"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};
