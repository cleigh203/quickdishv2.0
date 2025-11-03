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
    icon: '🤖'
  }
};

export const PremiumModal = ({ isOpen, onClose, feature }: PremiumModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const details = featureDetailsMap[feature];

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
      <DialogContent className="max-w-md p-0">
        <div className="text-center py-6 px-6">
          <div className="text-6xl mb-4">{details.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{details.title}</h2>
          <p className="text-gray-600 mb-6">{details.description}</p>
          
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 mb-6 border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-500 mb-2">$2.99/month</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cancel anytime</div>
          </div>

          <div className="space-y-3 text-left mb-6">
            <h3 className="font-semibold text-center">Premium includes:</h3>
            <ul className="space-y-2">
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
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
          >
            Upgrade to Premium
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full mt-2"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


