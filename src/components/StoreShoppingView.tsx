import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";

interface ShoppingItem {
  id: number;
  item: string;
  amount?: string;
  checked: boolean;
  recipes?: string[];
}

interface StoreShoppingViewProps {
  storeUrl: string;
  items: ShoppingItem[];
  onClose: () => void;
  onItemChecked: (id: number) => void;
}

export const StoreShoppingView = ({
  storeUrl,
  items,
  onClose,
  onItemChecked,
}: StoreShoppingViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [iframeError, setIframeError] = useState(false);
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

  const handleOpenInNewTab = () => {
    window.open(storeUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header with close button */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Shop Online</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Store iframe or fallback message */}
      <div className="pt-16 pb-48 h-full">
        {!iframeError ? (
          <iframe
            src={storeUrl}
            className="w-full h-full border-0"
            title="Store Website"
            onError={() => setIframeError(true)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
            <Alert>
              <AlertDescription className="text-center">
                This store cannot be displayed in an embedded view due to security restrictions.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleOpenInNewTab}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open {storeUrl.includes('walmart') ? 'Walmart' : storeUrl.includes('target') ? 'Target' : storeUrl.includes('kroger') ? 'Kroger' : storeUrl.includes('amazon') ? 'Amazon Fresh' : storeUrl.includes('instacart') ? 'Instacart' : 'Store'} in New Tab
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Keep this window open to track your shopping progress below.
            </p>
          </div>
        )}
      </div>

      {/* Fixed bottom overlay */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Card className="rounded-t-2xl rounded-b-none border-t bg-background/95 backdrop-blur-lg shadow-2xl">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Shopping for:</p>
              <p className="text-2xl font-bold">
                {currentItem.amount && (
                  <span className="text-muted-foreground">{currentItem.amount} </span>
                )}
                {currentItem.item}
              </p>
              <p className="text-base text-muted-foreground font-medium">
                {currentIndex + 1} / {totalItems}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={currentIndex === 0}
                className="shrink-0 h-12 w-12 p-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 h-12 text-base"
              >
                Skip
              </Button>
              <Button
                onClick={handleGotIt}
                className="flex-1 h-12 text-base bg-green-600 hover:bg-green-700 text-white"
              >
                Got it
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
