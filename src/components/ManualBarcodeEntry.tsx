import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Barcode, Search } from "lucide-react";

interface ManualBarcodeEntryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (barcode: string) => void;
}

export const ManualBarcodeEntry = ({
  open,
  onOpenChange,
  onSubmit,
}: ManualBarcodeEntryProps) => {
  const [barcode, setBarcode] = useState("");

  const handleSubmit = () => {
    if (barcode.trim()) {
      onSubmit(barcode.trim());
      setBarcode("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Barcode className="w-5 h-5" />
            Enter Barcode Manually
          </DialogTitle>
          <DialogDescription>
            Type in the barcode number if you can't scan it
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode Number</Label>
            <Input
              id="barcode"
              type="text"
              placeholder="e.g., 041220576425"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
              className="text-lg tracking-wider"
            />
            <p className="text-xs text-muted-foreground">
              Enter the barcode number from the product package
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!barcode.trim()}>
            <Search className="w-4 h-4 mr-2" />
            Look Up Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
