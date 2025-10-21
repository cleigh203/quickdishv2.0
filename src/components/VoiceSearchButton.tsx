import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useRef, useEffect } from "react";

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  onSearchTrigger?: (text?: string) => void;
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
  const lastTranscriptRef = useRef('');
  
  const { isListening, isSupported, startListening, stopListening } = useVoiceSearch(
    (text) => {
      lastTranscriptRef.current = text;
      onTranscript(text);
    }
  );

  // Trigger search when user stops speaking
  useEffect(() => {
    if (!isListening && lastTranscriptRef.current && onSearchTrigger) {
      // Pass the transcript directly to the search function
      const transcript = lastTranscriptRef.current;
      console.log('🎤 Voice search triggering with:', transcript);
      
      // Small delay to ensure UI updates, then trigger with the transcript
      setTimeout(() => {
        onSearchTrigger(transcript);
        lastTranscriptRef.current = '';
      }, 300);
    }
  }, [isListening, onSearchTrigger]);

  if (!isSupported) {
    return null; // Hide button if browser doesn't support speech recognition
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      lastTranscriptRef.current = ''; // Reset before starting
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
