import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link2, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeName: string;
  recipeId: string;
  recipeImage?: string;
  recipeDescription?: string;
}

export const ShareModal = ({
  open,
  onOpenChange,
  recipeName,
  recipeId,
  recipeImage,
  recipeDescription
}: ShareModalProps) => {
  const { toast } = useToast();

  const getRecipeUrl = () => {
    return `${window.location.origin}/recipe/${recipeId}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getRecipeUrl());
      toast({
        title: "Link copied to clipboard! 🔗",
        description: "Share this recipe with your friends",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShareToPinterest = () => {
    const url = getRecipeUrl();
    const description = `${recipeName} - Recipe from QuickDish`;
    const media = recipeImage || '';
    
    const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`;
    
    window.open(pinterestUrl, '_blank', 'width=750,height=550');
    onOpenChange(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeName,
          text: recipeDescription || `Check out this recipe: ${recipeName}`,
          url: getRecipeUrl(),
        });
        onOpenChange(false);
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or error:', error);
      }
    }
  };

  // Check if native share is available (mobile devices)
  const canUseNativeShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 py-4">
          {/* Native Share (Mobile) */}
          {canUseNativeShare && (
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="w-full h-14 justify-start gap-4"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Share via...</div>
                <div className="text-sm text-muted-foreground">Use your device's share menu</div>
              </div>
            </Button>
          )}

          {/* Copy Link */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full h-14 justify-start gap-4"
          >
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <Link2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold">Copy Link</div>
              <div className="text-sm text-muted-foreground">Share anywhere you want</div>
            </div>
          </Button>

          {/* Pinterest */}
          <Button
            onClick={handleShareToPinterest}
            variant="outline"
            className="w-full h-14 justify-start gap-4"
          >
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-xl">
              📌
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold">Share to Pinterest</div>
              <div className="text-sm text-muted-foreground">Pin to your board</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
