import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PremiumPaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export const PremiumPaywallModal = ({ open, onClose }: PremiumPaywallModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const benefits = [
    "Track nutrition & calories",
    "Meal planning insights",
    "Detailed macro breakdowns",
    "Ad-free experience"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-emerald-700 rounded-full flex items-center justify-center text-3xl">
              👑
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Unlock Nutritional Information
          </DialogTitle>
          <DialogDescription className="text-center">
            Upgrade to Premium to see detailed nutrition facts for all recipes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => {
                if (!user) {
                  navigate('/auth');
                } else {
                  navigate('/premium');
                }
                onClose();
              }}
              className="w-full bg-gradient-to-r from-yellow-400 to-emerald-700 hover:from-yellow-500 hover:to-emerald-800 text-white font-semibold"
            >
              {user ? 'Upgrade to Premium' : 'Sign In to Upgrade'}
            </Button>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
