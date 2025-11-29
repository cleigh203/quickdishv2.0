import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Bug } from 'lucide-react';

export const DevTools = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const clearAllCaches = async () => {
    try {
      console.log('🗑️ Starting comprehensive cache clear...');
      
      // Clear service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => {
            console.log('🗑️ Unregistering SW:', registration.scope);
            return registration.unregister();
          })
        );
      }

      // Clear ALL caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('🗑️ Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }

      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      console.log('🗑️ Storage cleared');

      // Clear IndexedDB (mobile fix)
      if (window.indexedDB) {
        try {
          const databases = await window.indexedDB.databases();
          databases.forEach(db => {
            if (db.name) {
              window.indexedDB.deleteDatabase(db.name);
              console.log('🗑️ Deleted IndexedDB:', db.name);
            }
          });
        } catch (e) {
          console.log('IndexedDB not available or already clear');
        }
      }

      console.log('✅ All caches cleared! Reloading...');
      
      // Force hard reload
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error('❌ Error clearing caches:', error);
      alert('Error clearing caches. Check console for details.');
    }
  };

  const hardReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-64 shadow-lg border-emerald-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="w-4 h-4" />
              DevTools
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              DEV
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={clearAllCaches}
            variant="destructive"
            size="lg"
            className="w-full h-11 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Caches
          </Button>

          <Button
            onClick={hardReload}
            variant="outline"
            size="lg"
            className="w-full h-11 min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Hard Reload
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
