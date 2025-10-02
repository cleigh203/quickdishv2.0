import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Store {
  name: string;
  url: string;
  logo?: string;
}

const STORES: Store[] = [
  { name: "Instacart", url: "https://www.instacart.com/" },
  { name: "Walmart", url: "https://www.walmart.com/grocery" },
  { name: "Target", url: "https://www.target.com/" },
  { name: "Kroger", url: "https://www.kroger.com/" },
  { name: "Amazon Fresh", url: "https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo" },
];

interface StoreSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoreSelected: (storeUrl: string) => void;
}

export const StoreSelectionDialog = ({
  open,
  onOpenChange,
  onStoreSelected,
}: StoreSelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Store</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {STORES.map((store) => (
            <Button
              key={store.name}
              variant="outline"
              className="w-full justify-between"
              onClick={() => {
                onStoreSelected(store.url);
                onOpenChange(false);
              }}
            >
              <span>{store.name}</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
