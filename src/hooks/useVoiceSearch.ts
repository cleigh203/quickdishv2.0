import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVoiceSearch = (onTranscript: (text: string) => void) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const recognitionRef = useRef<any>(null);
  const nativeListenersRef = useRef<any[]>([]);
  const inactivityTimerRef = useRef<any>(null);
  const lastHeardAtRef = useRef<number>(0);

  useEffect(() => {
    const checkPlatform = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const native = Capacitor.isNativePlatform();
        setIsNative(native);
        
        if (native) {
          // Check native speech recognition
          try {
            const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
            const { available } = await SpeechRecognition.available();
            setIsSupported(available);
          } catch (error) {
            console.log('Native speech recognition not available');
            setIsSupported(false);
          }
        } else {
          // Check web speech recognition
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          setIsSupported(!!SpeechRecognition);
        }
      } catch (error) {
        // Web mode, check browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);
        setIsNative(false);
      }
    };

    checkPlatform();
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Voice recognition is not available on this device",
      });
      return;
    }

    try {
      if (isNative) {
        // Native platform - use Capacitor plugin
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        
        await SpeechRecognition.requestPermissions();
        
        await SpeechRecognition.start({
          language: "en-US",
          maxResults: 1,
          prompt: "Say something...",
          partialResults: true,
          popup: false,
        });

        // Clean up previous listeners
        nativeListenersRef.current.forEach((l: any) => l.remove && l.remove());
        nativeListenersRef.current = [];

        const restartInactivity = () => {
          lastHeardAtRef.current = Date.now();
          if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = setTimeout(() => {
            // If no new speech for 1200ms, stop listening to finalize
            stopListening();
          }, 1200);
        };

        const l1 = await SpeechRecognition.addListener("partialResults", (data: any) => {
          if (data?.matches?.[0]) {
            onTranscript(data.matches[0]);
            restartInactivity();
          }
        });
        const l2 = await SpeechRecognition.addListener("result", (data: any) => {
          if (data?.matches?.[0]) {
            onTranscript(data.matches[0]);
            restartInactivity();
          }
        });
        const l3 = await SpeechRecognition.addListener("end", () => {
          setIsListening(false);
        });
        const l4 = await SpeechRecognition.addListener("error", () => {
          setIsListening(false);
        });
        nativeListenersRef.current.push(l1, l2, l3, l4);

        setIsListening(true);
        // Safety timeout: hard cap at 6s
        setTimeout(() => {
          stopListening();
        }, 6000);
      } else {
        // Web platform - use Web Speech API
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false; // Stop automatically when user finishes speaking
        recognition.interimResults = true; // Show real-time transcription
        recognition.lang = 'en-US';

        let finalTranscript = '';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Send the transcript (interim or final)
          onTranscript(finalTranscript || interimTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Automatically stops when user finishes speaking
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start voice recognition",
      });
      setIsListening(false);
    }
  }, [isSupported, isNative, onTranscript, toast]);

  const stopListening = useCallback(async () => {
    try {
      if (isNative) {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        await SpeechRecognition.stop();
        // Remove native listeners
        nativeListenersRef.current.forEach((l: any) => l.remove && l.remove());
        nativeListenersRef.current = [];
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
    setIsListening(false);
  }, [isNative]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
};
