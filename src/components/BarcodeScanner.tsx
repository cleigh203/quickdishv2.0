import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, AlertCircle } from "lucide-react";

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ open, onOpenChange, onScan }: BarcodeScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerIdRef = useRef("barcode-scanner-" + Date.now());

  useEffect(() => {
    if (open && !scanning) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [open]);

  const startScanner = async () => {
    try {
      setError("");
      const scannerId = scannerIdRef.current;
      
      // Create scanner instance
      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      // Request camera permission and start scanning
      await scanner.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Successfully scanned
          handleSuccessfulScan(decodedText);
        },
        (errorMessage) => {
          // Scanning error (usually just "no barcode found")
          // We can ignore these as they happen continuously
        }
      );

      setScanning(true);
    } catch (err: any) {
      console.error("Scanner error:", err);
      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please enable camera permissions and try again.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Unable to start camera. Please try manual entry.");
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setScanning(false);
  };

  const handleSuccessfulScan = async (barcode: string) => {
    // Provide feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Stop scanner
    await stopScanner();

    // Close dialog and pass barcode to parent
    onScan(barcode);
    onOpenChange(false);
  };

  const handleManualEntry = () => {
    stopScanner();
    onOpenChange(false);
    // Parent can show manual entry form
  };

  const handleClose = () => {
    stopScanner();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scan Barcode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scanner View */}
          <div className="relative">
            <div
              id={scannerIdRef.current}
              className="rounded-lg overflow-hidden border-2 border-primary/20"
              style={{ minHeight: "300px" }}
            />
            {!scanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Starting camera...</p>
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Instructions */}
          {scanning && !error && (
            <p className="text-sm text-center text-muted-foreground">
              Point camera at product barcode
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleManualEntry} className="flex-1">
              Enter Manually
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
