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

  const currentInstruction = recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
  const stepIngredients = getStepIngredients(currentInstruction);
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;
  const stepTimes = parseTimeFromInstruction(currentInstruction);
  const hasActiveTimerForStep = timers.some(t => t.stepNumber === currentStep + 1 && t.remainingSeconds > 0);

  if (showFullRecipe) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col text-black">
      {/* Header */}
        <div className="p-4 bg-gray-50 flex justify-between items-center gap-4">
          <h2 className="text-xl font-bold flex-1">{recipe.name}</h2>
          {voiceSupported && (
            <Button
              onClick={toggleVoiceControl}
              variant={isListening ? "default" : "outline"}
              size="icon"
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
          )}
          <button
            onClick={() => setShowFullRecipe(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Full Recipe Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-green-500">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, index) => {
                const ingredientText = `${ing.amount} ${ing.unit} ${ing.item}`.trim();
                return (
                  <li key={index} className="flex items-start text-lg">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{ingredientText}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-green-500">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className={`flex p-4 rounded-lg ${
                    index === currentStep ? 'bg-green-500/20 border border-green-500' : 'bg-gray-50'
                  }`}
                >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center mr-4 font-bold">
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
      {/* Header with Progress */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            {voiceSupported && (
              <Button
                onClick={toggleVoiceControl}
                variant={isListening ? "default" : "outline"}
                size="sm"
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Listening
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Voice
                  </>
                )}
              </Button>
            )}
            <button
              onClick={() => setShowFullRecipe(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isListening && (
          <div className="mb-3 p-2 bg-green-500/20 rounded-lg text-center animate-pulse">
            <p className="text-xs text-green-500 font-medium">
              🎤 LISTENING... Say: "Next", "Back", "Start Timer", "Time Left"
            </p>
            {lastCommand && (
              <p className="text-xs text-gray-600 mt-1">
                Last heard: "{lastCommand}"
              </p>
            )}
          </div>
        )}

        {micPermission === 'denied' && !isListening && (
          <div className="mb-3 p-2 bg-red-100 rounded-lg text-center">
            <p className="text-xs text-red-600 font-medium">
              ⚠️ Microphone access denied. Enable it in browser settings.
            </p>
          </div>
        )}

        <Progress value={progress} className="h-3" />
        <p className="text-gray-400 text-center mt-2 text-sm">
          Step {currentStep + 1} of {recipe.instructions.length}
        </p>
      </div>

      {/* Current Step Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="text-center max-w-4xl w-full">
          <h2 className="text-green-500 text-3xl md:text-4xl mb-6 font-bold">
            Step {currentStep + 1}
          </h2>
          
          <p className="text-black text-2xl md:text-3xl leading-relaxed font-light mb-8">
            {currentInstruction}
          </p>

          {/* Ingredient Amounts - ONLY SHOW ON STEP 1 (PREP) */}
          {currentStep === 0 && stepIngredients.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-green-500 text-xl font-bold mb-4">You'll need:</h3>
              <ul className="space-y-2">
                {stepIngredients.map((ing, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    • {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Smart Timer Buttons - Show ALL detected timers */}
          {stepTimes.length > 0 && !hasActiveTimerForStep && (
            <div className="mt-8 flex flex-col gap-3 items-center">
              {stepTimes.map((minutes, index) => (
                <Button
                  key={index}
                  onClick={() => startTimer(currentStep + 1, minutes)}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-6 px-8 rounded-xl w-full max-w-md"
                >
                  <Clock className="w-6 h-6 mr-3" />
                  Start {minutes} Min Timer {stepTimes.length > 1 ? `(${index + 1}/${stepTimes.length})` : ''}
                </Button>
              ))}
            </div>
          )}

          {/* Voice control helper for mobile */}
          {voiceSupported && !isListening && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={toggleVoiceControl}
                variant="outline"
                size="lg"
                className="text-lg w-full max-w-md"
              >
                <Mic className="w-5 h-5 mr-2" />
                Enable Hands-Free Voice Control
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active Timers Display */}
      {timers.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-200 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-600 mb-3">Active Timers:</h3>
          <div className="space-y-2">
            {timers.map(timer => (
              <div 
                key={timer.id} 
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border-l-4 border-green-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-green-500 text-white">
                    <Clock className="w-5 h-5 mb-1" />
                    <span className="text-xl font-bold">{formatTime(timer.remainingSeconds)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-black">Step {timer.stepNumber}</p>
                    <p className="text-xs text-gray-500">
                      {timer.remainingSeconds > 0 ? (timer.isRunning ? 'Running' : 'Paused') : 'Complete'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {timer.remainingSeconds > 0 && (
                    <>
                      <Button
                        onClick={() => timer.isRunning ? pauseTimer(timer.id) : resumeTimer(timer.id)}
                        variant="outline"
                        size="sm"
                      >
                        {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => cancelTimer(timer.id)}
                        variant="outline"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handlePrevious}
            className="py-4 bg-gray-200 text-black text-lg font-bold rounded-xl disabled:opacity-30 active:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-5 h-5" />
            BACK
          </button>
          <button
            onClick={handleNext}
            className="py-4 bg-green-500 hover:bg-green-600 text-black text-lg font-bold rounded-xl active:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            {currentStep === recipe.instructions.length - 1 ? 'DONE!' : 'NEXT'}
            {currentStep < recipe.instructions.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingMode;
