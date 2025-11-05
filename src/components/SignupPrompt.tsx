import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface SignupPromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export const SignupPrompt = ({ isOpen, onClose, feature }: SignupPromptProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Sign Up to Get Started!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Create a free account to {feature} and unlock all features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-green-900 dark:text-green-100">
              Free Features Included:
            </h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Save up to 50 favorite recipes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Create weekly meal plans</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Auto-generate shopping lists with added Instacart integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>1 free AI recipe per day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Voice-controlled cooking mode</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
              size="lg"
            >
              Sign Up Free
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              variant="ghost"
              className="w-full"
            >
              Already have an account? Sign In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

