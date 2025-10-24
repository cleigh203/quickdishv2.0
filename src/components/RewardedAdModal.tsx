import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RewardedAdModalProps {
  open: boolean;
  onClose: () => void;
  onReward: () => void;
  title?: string;
  description?: string;
}

// Placeholder rewarded ad modal. Integrate real rewarded SDK later.
export function RewardedAdModal({ open, onClose, onReward, title = 'Watch an ad to continue', description = 'This unlocks premium features without a subscription.' }: RewardedAdModalProps) {
  useEffect(() => {
    if (!open) return;
    // Simulate a short ad playback timer for now (replace with SDK callbacks)
    const t = setTimeout(() => {
      onReward();
      onClose();
    }, 3000);
    return () => clearTimeout(t);
  }, [open, onClose, onReward]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="h-40 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Ad playing… (demo)</span>
          </div>
          <Button onClick={() => { onReward(); onClose(); }} className="w-full">Simulate Reward</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RewardedAdModal;

