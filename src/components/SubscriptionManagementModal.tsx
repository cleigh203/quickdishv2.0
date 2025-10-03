import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionEnd: string | null;
  onSubscriptionCanceled: () => void;
}

export const SubscriptionManagementModal = ({
  open,
  onOpenChange,
  subscriptionEnd,
  onSubscriptionCanceled,
}: SubscriptionManagementModalProps) => {
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleUpdatePaymentMethod = async () => {
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open payment settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      // Call edge function to cancel subscription
      const { error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) throw error;

      toast({
        title: "Subscription canceled",
        description: "Your premium features will remain active until the end of your billing period.",
      });
      
      setCancelDialogOpen(false);
      onOpenChange(false);
      onSubscriptionCanceled();
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Manage Subscription</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Current Plan */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Premium - $2.99/month</span>
                <Badge className="bg-green-500 hover:bg-green-500">Active</Badge>
              </div>
            </div>

            {/* Next Billing Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Next Billing Date</span>
              </div>
              <p className="text-base font-medium">{formatDate(subscriptionEnd)}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleUpdatePaymentMethod}
                disabled={loadingPortal}
              >
                {loadingPortal ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                Update Payment Method
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setCancelDialogOpen(true)}
              >
                <AlertTriangle className="w-4 h-4" />
                Cancel Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? You'll lose access to nutritional facts and premium features at the end of your billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={canceling}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700"
            >
              {canceling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Canceling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
