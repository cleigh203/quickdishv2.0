import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  onSearchTrigger?: () => void;
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const VoiceSearchButton = ({ 
  onTranscript, 
  onSearchTrigger,
  variant = "ghost",
  size = "icon",
  className = ""
}: VoiceSearchButtonProps) => {
  const { isListening, isSupported, startListening, stopListening } = useVoiceSearch(
    (text) => {
      onTranscript(text);
      // Auto-trigger search after 2 seconds of silence (handled by recognition.onend)
      if (onSearchTrigger) {
        setTimeout(() => {
          onSearchTrigger();
        }, 100);
      }
    }
  );

  if (!isSupported) {
    return null; // Hide button if browser doesn't support speech recognition
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`transition-all ${
        isListening 
          ? 'text-primary animate-pulse' 
          : 'text-muted-foreground hover:text-primary'
      } ${className}`}
      title={isListening ? "Listening..." : "Voice search"}
    >
      {isListening ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};
