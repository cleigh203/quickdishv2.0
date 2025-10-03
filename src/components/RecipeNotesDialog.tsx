import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface RecipeNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeName: string;
  currentNotes: string | null;
  onSave: (notes: string) => Promise<{ success: boolean; message?: string }>;
  isSaved: boolean;
}

export const RecipeNotesDialog = ({
  open,
  onOpenChange,
  recipeName,
  currentNotes,
  onSave,
  isSaved,
}: RecipeNotesDialogProps) => {
  const [notes, setNotes] = useState(currentNotes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotes(currentNotes || '');
  }, [currentNotes, open]);

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(notes);
    setSaving(false);
    
    if (result.success) {
      onOpenChange(false);
    }
  };

  if (!isSaved) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Recipe First</DialogTitle>
            <DialogDescription>
              You need to save this recipe to your favorites before you can add notes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recipe Notes</DialogTitle>
          <DialogDescription>
            Add your personal notes for {recipeName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Add your cooking tips, modifications, or memories about this recipe..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            maxLength={10000}
            className="resize-none"
          />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              💡 Tip: Use notes to remember ingredient substitutions, cooking tips, or special occasions you made this recipe.
            </div>
            <div className="text-xs">
              {notes.length}/10000
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Notes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
