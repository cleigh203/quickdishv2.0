import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export type PremiumFeature = 'chef-quinn' | 'nutrition' | 'unlimited-saves' | 'pdf-export' | 'ai-recipes';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: PremiumFeature;
}

interface FeatureDetails {
  title: string;
  description: string;
  icon: string;
}

const featureDetailsMap: Record<PremiumFeature, FeatureDetails> = {
  'chef-quinn': {
    title: 'Ask Chef Quinn Unlimited Questions',
    description: 'Get instant cooking help, substitutions, and tips',
    icon: '👨‍🍳'
  },
  'nutrition': {
    title: 'See Nutritional Facts',
    description: 'Track calories, macros, and vitamins for every recipe',
    icon: '📊'
  },
  'unlimited-saves': {
    title: 'Save Unlimited Recipes',
    description: 'Build your complete digital cookbook',
    icon: '❤️'
  },
  'pdf-export': {
    title: 'Export as PDF',
    description: 'Print recipes for your cookbook or share with family',
    icon: '📄'
  },
  'ai-recipes': {
    title: 'Generate 5 AI Recipes Daily',
    description: 'Create custom recipes based on your preferences',
    icon: '⭐'
  }
};

export const PremiumModal = ({ isOpen, onClose, feature }: PremiumModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const details = featureDetailsMap[feature] || featureDetailsMap['ai-recipes'];

  const handleUpgrade = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/premium');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0">
        <div className="text-center py-4 px-4">
          {feature === 'ai-recipes' ? (
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 2a1 1 0 10-2 0v6.5a.5.5 0 01-1 0V3a1 1 0 10-2 0v5.5a.5.5 0 01-1 0V2a1 1 0 10-2 0v6.5a.5.5 0 01-.5.5 1 1 0 000 2h.5c.28 0 .5.22.5.5V18a1 1 0 102 0v-6.5c0-.28.22-.5.5-.5s.5.22.5.5V18a1 1 0 102 0v-6.5c0-.28.22-.5.5-.5h.5a1 1 0 000-2 .5.5 0 01-.5-.5V2zM16 2a1 1 0 00-1 1v4a1 1 0 001 1 1 1 0 001-1V3a1 1 0 00-1-1zm-1 7.5c0-.28-.22-.5-.5-.5a1 1 0 000 2 .5.5 0 00.5-.5V9.5zm0 2c0-.28-.22-.5-.5-.5V18a1 1 0 102 0v-6.5c0-.28-.22-.5-.5-.5a.5.5 0 00-.5.5z"/>
              </svg>
            </div>
          ) : (
            <div className="text-6xl mb-3">{details?.icon || '⭐'}</div>
          )}
          <h2 className="text-2xl font-bold mb-2">{details?.title || 'Premium Feature'}</h2>
          <p className="text-gray-600 mb-4">{details?.description || 'Upgrade to unlock this feature'}</p>
          
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-500 mb-2">$2.99/month</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cancel anytime</div>
          </div>

          <div className="space-y-2 text-left mb-4">
            <h3 className="font-semibold text-center">Premium includes:</h3>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">5 AI recipes daily</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Unlimited Chef Quinn chat</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Nutritional facts for all recipes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Unlimited recipe saves</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Export as PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Offline access</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Ad-free experience</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={handleUpgrade}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
          >
            Upgrade to Premium
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full mt-2 py-3"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



