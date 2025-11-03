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
  onSubscriptionCanceled: (periodEnd?: string) => void;
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
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to invoke customer portal');
      }
      
      if (data?.error) {
        console.error('Customer portal error:', data.error);
        throw new Error(data.error);
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to open payment settings';
      toast({
        title: "Error",
        description: errorMessage,
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
      const { data, error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) {
        console.error('Cancel subscription error:', error);
        // Provide user-friendly error messages
        if (error.message?.includes('No authorization')) {
          throw new Error('You must be signed in to cancel your subscription');
        } else if (error.message?.includes('No subscription')) {
          throw new Error('No active subscription found to cancel');
        } else if (error.message?.includes('not configured')) {
          throw new Error('Subscription system is not available. Please contact support.');
        } else {
          throw new Error(error.message || 'Failed to cancel subscription. Please try again or contact support.');
        }
      }

      if (data?.error) {
        console.error('Cancel subscription response error:', data.error);
        throw new Error(data.error || 'Failed to cancel subscription. Please try again.');
      }

      // Get period end date from response
      const periodEndDate = data?.period_end || subscriptionEnd;
      const formattedDate = periodEndDate 
        ? new Date(periodEndDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : 'the end of your billing period';

      toast({
        title: "Subscription cancellation scheduled",
        description: `Your subscription will remain active until ${formattedDate}. You'll continue to have access to premium features until then.`,
      });
      
      setCancelDialogOpen(false);
      onOpenChange(false);
      onSubscriptionCanceled(periodEndDate || undefined);
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel subscription. Please try again or contact support.';
      toast({
        title: "Error canceling subscription",
        description: errorMessage,
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
