import { useState, useEffect, useRef } from "react";
import { X, List, ChevronLeft, ChevronRight, Mic, MicOff, Clock, Play, Pause, XCircle } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Timer {
  id: string;
  stepNumber: number;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
}

const CookingMode = ({ recipe, onExit }: CookingModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFullRecipe, setShowFullRecipe] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef(false); // Track voice state for closures
  const currentStepRef = useRef(currentStep); // Track current step for closures
  const timersRef = useRef(timers); // Track timers for closures
  const { toast } = useToast();

  // Update refs when state changes (for voice command closures)
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    timersRef.current = timers;
  }, [timers]);

  // Check browser support and mic permission
  useEffect(() => {
    const hasVoiceRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    setVoiceSupported(hasVoiceRecognition && hasSpeechSynthesis);

    // Check mic permission
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setMicPermission(result.state === 'granted' ? 'granted' : 'denied');
          result.onchange = () => {
            setMicPermission(result.state === 'granted' ? 'granted' : 'denied');
          };
        })
        .catch(() => setMicPermission('pending'));
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timers.some(t => t.isRunning)) {
      timerIntervalRef.current = setInterval(() => {
        setTimers(prevTimers => 
          prevTimers.map(timer => {
            if (!timer.isRunning || timer.remainingSeconds <= 0) return timer;
            
            const newRemaining = timer.remainingSeconds - 1;
            
            // Timer complete
            if (newRemaining <= 0) {
              playTimerSound();
              toast({
                title: `⏰ Timer Complete!`,
                description: `Step ${timer.stepNumber} timer finished`,
              });
              return { ...timer, remainingSeconds: 0, isRunning: false };
            }
            
            return { ...timer, remainingSeconds: newRemaining };
          })
        );
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timers]);

  // Parse ALL times from instruction (handles multiple timers)
  const parseTimeFromInstruction = (instruction: string): number[] => {
    const timesSet = new Set<number>();
    
    // Single regex to match ranges AND standalone times
    // This prevents "12-15 minutes" from being matched as both a range AND as "15 minutes"
    const pattern = /(\d+)(?:-(\d+))?\s*(?:more\s+)?(?:minute|min|mins|minutes|hour|hours|hr|hrs)/gi;
    
    let match;
    while ((match = pattern.exec(instruction)) !== null) {
      const firstNum = parseInt(match[1]);
      const secondNum = match[2] ? parseInt(match[2]) : null;
      const unit = match[0].toLowerCase();
      const isHour = unit.includes('hour') || unit.includes('hr');
      
      // If range exists (like "12-15"), use the higher value
      const value = secondNum ? secondNum : firstNum;
      const minutes = isHour ? value * 60 : value;
      
      timesSet.add(minutes);
    }

    const times = Array.from(timesSet);
    console.log('Parsed times from instruction:', instruction, '→', times);
    return times;
  };

  const playTimerSound = () => {
    // Create audio context for beep
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 300);
  };

  const startTimer = (stepNumber: number, minutes: number) => {
    const timerId = `timer-${Date.now()}`;
    const totalSeconds = minutes * 60;
    
    setTimers(prev => [...prev, {
      id: timerId,
      stepNumber,
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: true,
    }]);

    toast({
      title: "Timer Started",
      description: `${minutes} minute${minutes > 1 ? 's' : ''} for Step ${stepNumber}`,
    });
  };

  const pauseTimer = (timerId: string) => {
    setTimers(prev => prev.map(t => 
      t.id === timerId ? { ...t, isRunning: false } : t
    ));
  };

  const resumeTimer = (timerId: string) => {
    setTimers(prev => prev.map(t => 
      t.id === timerId ? { ...t, isRunning: true } : t
    ));
  };

  const cancelTimer = (timerId: string) => {
    setTimers(prev => prev.filter(t => t.id !== timerId));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-read step when it changes (for any navigation method)
  useEffect(() => {
    if (!voiceSupported || !autoRead || !isListening) return;
    if (currentStep < 0 || currentStep >= recipe.instructions.length) return;

    // Small delay to let UI update first
    const timer = setTimeout(() => {
      speakCurrentStep();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, autoRead, isListening, voiceSupported]);

  // Initialize speech recognition with better error handling
  useEffect(() => {
    if (!voiceSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
      isListeningRef.current = true;
    };

    recognitionInstance.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log('Voice command detected:', command);
      setLastCommand(command);
      handleVoiceCommand(command);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        console.log('No speech detected, continuing...');
        return;
      }
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicPermission('denied');
        setIsListening(false);
        toast({
          title: "Microphone access denied",
          description: "Please enable microphone permissions in your browser settings",
          variant: "destructive"
        });
        return;
      }

      if (event.error === 'aborted') {
        console.log('Recognition aborted, will restart if needed');
        return;
      }
      
      toast({
        title: "Voice error",
        description: `${event.error} - Please try again`,
        variant: "destructive"
      });
    };

    recognitionInstance.onend = () => {
      console.log('Voice recognition ended, should restart:', isListeningRef.current);
      // Auto-restart if still supposed to be listening (use ref, not stale state)
      if (isListeningRef.current) {
        setTimeout(() => {
          try {
            console.log('Restarting voice recognition...');
            recognitionInstance.start();
          } catch (error) {
            console.error('Recognition restart error:', error);
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [voiceSupported]);

  const handleVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command);
    console.log('Current step from ref:', currentStepRef.current);
    console.log('Active timers from ref:', timersRef.current);

    // Timer commands
    if (command.includes('start timer') || command.includes('set timer')) {
      const step = currentStepRef.current;
      const currentInstruction = recipe.instructions[step] || '';
      const times = parseTimeFromInstruction(currentInstruction);
      console.log('Detected times:', times);
      if (times.length > 0) {
        // Start timer with the first detected time
        const minutes = times[0];
        toast({ title: `Heard: "${command}"`, description: `Starting ${minutes} minute timer` });
        startTimer(step + 1, minutes);
      } else {
        toast({ title: "No timer found", description: "This step doesn't have a time" });
      }
      return;
    }

    if (command.includes('pause timer')) {
      const activeTimers = timersRef.current;
      const runningTimer = activeTimers.find(t => t.isRunning);
      if (runningTimer) {
        toast({ title: `Heard: "${command}"`, description: "Timer paused" });
        pauseTimer(runningTimer.id);
      } else {
        toast({ title: "No running timer", description: "No timer is currently running" });
      }
      return;
    }

    if (command.includes('time left') || command.includes('how much time')) {
      const activeTimers = timersRef.current.filter(t => t.remainingSeconds > 0);
      console.log('Checking time left, active timers:', activeTimers);
      if (activeTimers.length === 0) {
        speakText("No active timers");
        toast({ title: "No active timers" });
      } else {
        activeTimers.forEach(timer => {
          const mins = Math.floor(timer.remainingSeconds / 60);
          const secs = timer.remainingSeconds % 60;
          speakText(`Step ${timer.stepNumber}: ${mins} minutes ${secs} seconds remaining`);
        });
      }
      return;
    }

    // Navigation commands - use functional setState to avoid stale closures
    if (command.includes('next') || command.includes('forward')) {
      toast({ title: `Heard: "${command}"`, description: "Moving to next step" });
      setCurrentStep(prev => {
        console.log('Next: moving from', prev, 'to', prev + 1);
        if (prev >= recipe.instructions.length - 1) {
          if (isListeningRef.current) {
            const speech = new SpeechSynthesisUtterance("Cooking complete! Enjoy your meal!");
            speech.rate = 0.9;
            window.speechSynthesis.speak(speech);
          }
          toast({ title: "Cooking complete! Enjoy! 🎉" });
          setTimeout(onExit, 2000);
          return prev;
        }
        return prev + 1;
      });
    } else if (command.includes('previous') || command.includes('back') || command.includes('last')) {
      toast({ title: `Heard: "${command}"`, description: "Going back" });
      setCurrentStep(prev => {
        console.log('Back: moving from', prev, 'to', Math.max(0, prev - 1));
        return Math.max(0, prev - 1);
      });
    } else if (command.includes('repeat') || command.includes('again') || command.includes('read')) {
      toast({ title: `Heard: "${command}"`, description: "Repeating step" });
      // Use ref to read current step
      const step = currentStepRef.current;
      const instruction = recipe.instructions[step]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
      const announcement = `Step ${step + 1}. ${instruction}`;
      speakText(announcement);
    } else if (command.includes('ingredient')) {
      toast({ title: `Heard: "${command}"`, description: "Showing ingredients" });
      setShowFullRecipe(true);
    } else if (command.includes('recipe') || command.includes('list')) {
      toast({ title: `Heard: "${command}"`, description: "Showing full recipe" });
      setShowFullRecipe(true);
    } else if (command.includes('exit') || command.includes('close') || command.includes('quit')) {
      toast({ title: `Heard: "${command}"`, description: "Exiting cooking mode" });
      onExit();
    } else {
      console.log('Unknown command:', command);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const currentInstruction = recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
    const announcement = `Step ${currentStep + 1}. ${currentInstruction}`;
    
    const speech = new SpeechSynthesisUtterance(announcement);
    speech.rate = 0.85;
    speech.pitch = 1;
    speech.volume = 1;
    
    console.log('Speaking:', announcement);
    window.speechSynthesis.speak(speech);
  };

  const announceStep = (step: number) => {
    if (!('speechSynthesis' in window)) return;
    if (step < 0 || step >= recipe.instructions.length) return;

    window.speechSynthesis.cancel();
    
    const announcement = new SpeechSynthesisUtterance(`Step ${step + 1}`);
    announcement.rate = 0.9;
    announcement.volume = 0.7;
    
    window.speechSynthesis.speak(announcement);
  };

  const toggleVoiceControl = async () => {
    if (!voiceSupported) {
      toast({
        title: "Voice control not supported",
        description: "Your browser doesn't support voice commands. Try Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      console.log('Stopping voice control');
      isListeningRef.current = false;
      recognition?.abort();
      setIsListening(false);
      window.speechSynthesis.cancel();
      toast({ title: "Voice control off" });
    } else {
      try {
        // Request microphone permission first
        console.log('Requesting microphone permission...');
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            stream.getTracks().forEach(track => track.stop());
            setMicPermission('granted');
            console.log('Microphone permission granted');
          })
          .catch(err => {
            console.error('Microphone permission error:', err);
            setMicPermission('denied');
            throw new Error('Microphone access denied');
          });

        console.log('Starting voice recognition...');
        isListeningRef.current = true;
        recognition?.start();
        setIsListening(true);
        toast({ 
          title: "🎤 Voice control active",
          description: "Say: Next, Back, Repeat, Start Timer, Time Left"
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        isListeningRef.current = false;
        toast({
          title: "Couldn't start voice control",
          description: error instanceof Error ? error.message : "Please enable microphone access",
          variant: "destructive"
        });
      }
    }
  };

  // Keep screen awake during cooking
  useEffect(() => {
    if ('wakeLock' in navigator) {
      let wakeLock: any = null;
      (navigator as any).wakeLock.request('screen')
        .then((wl: any) => wakeLock = wl)
        .catch((err: any) => console.log('Wake Lock error:', err));
      
      return () => wakeLock?.release();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showFullRecipe) return;
      
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
      if (e.key === 'Escape') {
        onExit();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, showFullRecipe]);

  const handleNext = () => {
    setCurrentStep(prev => {
      if (prev < recipe.instructions.length - 1) {
        return prev + 1;
      } else {
        if (isListening) {
          const speech = new SpeechSynthesisUtterance("Cooking complete! Enjoy your meal!");
          speech.rate = 0.9;
          window.speechSynthesis.speak(speech);
        }
        toast({ title: "Cooking complete! Enjoy! 🎉" });
        setTimeout(onExit, 1000);
        return prev;
      }
    });
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Extract ingredients mentioned in current step
  const getStepIngredients = (instruction: string) => {
    const ingredients: string[] = [];
    const instructionLower = instruction.toLowerCase();
    
    recipe.ingredients.forEach(ing => {
      const ingredientText = `${ing.amount} ${ing.unit} ${ing.item}`.trim();
      const itemName = ing.item.toLowerCase();
      
      // Match full item name or key words from it
      const itemWords = itemName.split(/[\s,]+/).filter(w => w.length > 3);
      const matches = itemWords.some(word => instructionLower.includes(word)) || 
                     instructionLower.includes(itemName);
      
      if (matches) {
        ingredients.push(ingredientText);
      }
    });
    return ingredients;
  };

  // Highlight ingredients and measurements in instruction text
  const renderInstructionWithHighlights = (instruction: string) => {
    const pattern = /(\d+\.?\d*\s*(?:cup|cups|tbsp|tsp|tablespoon|tablespoons|teaspoon|teaspoons|oz|ounce|ounces|lb|lbs|pound|pounds|g|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|liter|liters|minute|minutes|mins?|hour|hours|hrs?|°F|°C|degrees)[s]?(?:\s+[\w\s-]+)?)/gi;
    
    const parts = instruction.split(pattern);
    
    return parts.map((part, index) => {
      if (pattern.test(part)) {
        return (
          <span key={index} className="text-green-600 font-semibold">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const currentInstruction = recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
  const stepIngredients = getStepIngredients(currentInstruction);
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;
  const stepTimes = parseTimeFromInstruction(currentInstruction);
  const hasActiveTimerForStep = timers.some(t => t.stepNumber === currentStep + 1 && t.remainingSeconds > 0);

  if (showFullRecipe) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col text-black">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white px-5 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{recipe.name}</h2>
            <button
              onClick={() => setShowFullRecipe(false)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-all"
            >
              ×
            </button>
          </div>
        </div>

        {/* Full Recipe Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-[#10b981]">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, index) => {
                const ingredientText = `${ing.amount} ${ing.unit} ${ing.item}`.trim();
                return (
                  <li key={index} className="flex items-start text-lg">
                    <span className="text-[#10b981] mr-2">•</span>
                    <span>{ingredientText}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#10b981]">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className={`flex p-4 rounded-lg ${
                    index === currentStep ? 'bg-green-100 border-2 border-[#10b981]' : 'bg-gray-50'
                  }`}
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center mr-4 font-bold">
                    {index + 1}
                  </span>
                  <p className="flex-1 pt-1 text-lg">{instruction.replace(/\[|\]/g, '')}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col text-black">
      {/* Green Gradient Header with Progress */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white px-5 py-6">
        {/* Top Bar - Back/Close and Menu */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onExit}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-lg hover:bg-white/30 transition-all"
          >
            ←
          </button>
          <button 
            onClick={() => setShowFullRecipe(true)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-lg hover:bg-white/30 transition-all"
          >
            ☰
          </button>
        </div>
        
        {/* Recipe Name */}
        <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
        
        {/* Progress Bar */}
        <div className="bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress Text */}
        <p className="text-sm opacity-90">Step {currentStep + 1} of {recipe.instructions.length}</p>
      </div>

      {/* Voice Listening Indicator */}
      {isListening && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 animate-pulse">
          🎤 Listening...
        </div>
      )}

      {micPermission === 'denied' && !isListening && (
        <div className="mx-4 mt-4 p-3 bg-red-100 rounded-lg text-center">
          <p className="text-xs text-red-600 font-medium">
            ⚠️ Microphone access denied. Enable it in browser settings.
          </p>
        </div>
      )}

      {/* Step Content Area */}
      <div className="p-8 bg-white flex-1 overflow-y-auto">
        {/* Step Header with Large Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
            {currentStep + 1}
          </div>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Step {currentStep + 1}
          </span>
        </div>
        
        {/* Instruction - Large Text with Highlights */}
        <p className="text-2xl leading-relaxed text-gray-900 font-medium mb-7">
          {renderInstructionWithHighlights(currentInstruction)}
        </p>

        {/* Ingredient Amounts - ONLY SHOW ON STEP 1 (PREP) */}
        {currentStep === 0 && stepIngredients.length > 0 && (
          <div className="mt-6 p-6 bg-green-50 rounded-xl border-2 border-green-200">
            <h3 className="text-[#10b981] text-xl font-bold mb-4">You'll need:</h3>
            <ul className="space-y-2">
              {stepIngredients.map((ing, index) => (
                <li key={index} className="text-lg text-gray-700">
                  • {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timer Button (if step has timing) */}
        {stepTimes.length > 0 && !hasActiveTimerForStep && (
          <div className="mt-6 flex flex-col gap-3">
            {stepTimes.map((minutes, index) => (
              <button
                key={index}
                onClick={() => startTimer(currentStep + 1, minutes)}
                className="w-full h-14 bg-[#10b981] text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-[#059669] transition-all flex items-center justify-center gap-2"
              >
                ⏱️ Start {minutes} Minute Timer {stepTimes.length > 1 ? `(${index + 1}/${stepTimes.length})` : ''}
              </button>
            ))}
          </div>
        )}
        
        {/* Voice Control Button */}
        {voiceSupported && (
          <button 
            onClick={toggleVoiceControl}
            className="mt-4 w-full h-12 bg-green-50 text-green-700 rounded-xl font-semibold border-2 border-green-200 hover:bg-green-100 transition-all flex items-center justify-center gap-2"
          >
            🎤 {isListening ? 'Voice Control Active' : 'Enable Hands-Free Voice Control'}
          </button>
        )}
      </div>

      {/* Active Timers Display */}
      {timers.length > 0 && (
        <div className="bg-green-50 border-t-2 border-green-200 p-4">
          <div className="text-sm font-semibold text-green-800 mb-2">Active Timers:</div>
          <div className="space-y-2">
            {timers.map(timer => (
              <div 
                key={timer.id} 
                className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm"
              >
                <span className="font-medium text-gray-700">Step {timer.stepNumber}</span>
                <span className="text-2xl font-bold text-green-600">{formatTime(timer.remainingSeconds)}</span>
                <div className="flex gap-2">
                  {timer.remainingSeconds > 0 && (
                    <>
                      <button
                        onClick={() => timer.isRunning ? pauseTimer(timer.id) : resumeTimer(timer.id)}
                        className="text-sm text-gray-600 hover:text-gray-900 px-2"
                      >
                        {timer.isRunning ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => cancelTimer(timer.id)}
                        className="text-sm text-red-600 hover:text-red-800 px-2"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex gap-3 p-4 bg-white border-t border-gray-200">
        <button 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex-1 h-14 bg-gray-100 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          ← BACK
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 h-14 bg-[#10b981] text-white rounded-xl font-semibold text-base shadow-md hover:bg-[#059669] transition-all flex items-center justify-center gap-2"
        >
          {currentStep === recipe.instructions.length - 1 ? '✓ DONE!' : 'NEXT →'}
        </button>
      </div>
    </div>
  );
};

export default CookingMode;
