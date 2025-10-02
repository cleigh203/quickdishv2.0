import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

interface ShoppingOverlayProps {
  items: ShoppingItem[];
  onClose: () => void;
  onItemChecked: (id: number) => void;
}

export const ShoppingOverlay = ({
  items,
  onClose,
  onItemChecked,
}: ShoppingOverlayProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const uncheckedItems = items.filter(item => !item.checked);
  
  if (uncheckedItems.length === 0) {
    onClose();
    return null;
  }

  const currentItem = uncheckedItems[currentIndex];
  const totalItems = uncheckedItems.length;

  const handleGotIt = () => {
    onItemChecked(currentItem.id);
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom">
      <Card className="rounded-t-2xl rounded-b-none border-t bg-card/95 backdrop-blur-sm shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <p className="text-sm text-muted-foreground">Shopping for:</p>
              <p className="text-xl font-semibold">
                {currentItem.amount && <span className="text-muted-foreground">{currentItem.amount} </span>}
                {currentItem.item}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} / {totalItems}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleGotIt}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Got it
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
