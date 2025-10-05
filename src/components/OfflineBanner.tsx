import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { WifiOff, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export const OfflineBanner = () => {
  const { isOnline } = useNetworkStatus();
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      // Show "back online" message briefly
      setShowOnlineMessage(true);
      const timer = setTimeout(() => {
        setShowOnlineMessage(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top">
        <WifiOff className="h-4 w-4" />
        You're offline. Viewing cached recipes only.
      </div>
    );
  }

  if (showOnlineMessage) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top">
        <Wifi className="h-4 w-4" />
        Back online! Syncing data...
      </div>
    );
  }

  return null;
};
