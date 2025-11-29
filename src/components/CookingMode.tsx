// VERSION 1005 - REMOVED DEBUG UI (Listening, Last Heard, etc.)
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, Menu, Mic, Volume2, Play, FastForward, Rewind, Timer, CheckCircle, RotateCcw } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/hooks/use-toast";
import { Capacitor } from '@capacitor/core';
import { formatIngredient } from '@/utils/recipeHelpers';

// Define SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: (event: Event) => void;
  onerror: (event: any) => void;
  onstart: (event: Event) => void;
}

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [timers, setTimers] = useState<Timer[]>([]);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentStepRef = useRef(currentStep);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false); // Track if TTS is active
  const lastCommandTimeRef = useRef<{ time: number; lastCmd: string }>({ time: 0, lastCmd: '' });
  const hasAutoReadOnStartRef = useRef(false);
  const hasReadInitialStep = useRef(false);
  const hasShownCompletionRef = useRef(false);
  const { toast } = useToast();

  // Update refs
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Check for Web Speech API support
  useEffect(() => {
    const hasSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setVoiceSupported(hasSupport);
    if (import.meta.env.DEV) console.log('Voice supported:', hasSupport);
  }, []);

  // Timer logic
  useEffect(() => {
    if (timers.some(t => t.isRunning)) {
      timerIntervalRef.current = setInterval(() => {
        setTimers(prevTimers => 
          prevTimers.map(timer => {
            if (!timer.isRunning || timer.remainingSeconds <= 0) return timer;
            const newRemaining = timer.remainingSeconds - 1;
            if (newRemaining <= 0) {
              playTimerSound();
              toast({
                title: `Timer Complete!`,
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
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timers]);

  const parseTimeFromInstruction = (instruction: string): number[] => {
    const timesSet = new Set<number>();
    const pattern = /(\d+)(?:-(\d+))?\s*(?:more\s+)?(?:minute|min|mins|minutes|hour|hours|hr|hrs)/gi;
    let match;
    while ((match = pattern.exec(instruction)) !== null) {
      const firstNum = parseInt(match[1]);
      const secondNum = match[2] ? parseInt(match[2]) : null;
      const unit = match[0].toLowerCase();
      const isHour = unit.includes('hour') || unit.includes('hr');
      const value = secondNum ? secondNum : firstNum;
      const minutes = isHour ? value * 60 : value;
      timesSet.add(minutes);
    }
    return Array.from(timesSet);
  };

  const playTimerSound = () => {
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
    setTimers(prev => prev.map(t => t.id === timerId ? { ...t, isRunning: false } : t));
  };

  const resumeTimer = (timerId: string) => {
    setTimers(prev => prev.map(t => t.id === timerId ? { ...t, isRunning: true } : t));
  };

  const cancelTimer = (timerId: string) => {
    setTimers(prev => prev.filter(t => t.id !== timerId));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- CORE FUNCTIONALITY: TTS & MIC CONTROL ---

  // 1. Speak text - STOPS MIC, SPEAKS, THEN RESTARTS MIC
  const speakText = async (text: string) => {
    console.log('?? [V4-CLEAN] Speaking:', text.substring(0, 50));

    // Remember if voice control was active
    const wasListening = isListeningRef.current; 
    
    // MARK SPEAKING START - prevents onend from auto-restarting
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    // STOP MIC BEFORE SPEAKING
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        console.log('?? [V4-CLEAN] Mic stopped for TTS');
      } catch (e) {
        console.log('Mic already stopped');
      }
    }
    
    try {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      await TextToSpeech.speak({
        text: text,
        lang: 'en-US',
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
        category: 'playback',
      });
      console.log('? [V4-CLEAN] TTS done');
      
      // MARK SPEAKING END
      isSpeakingRef.current = false;
      setIsSpeaking(false);

      // RESTART MIC AFTER TTS FINISHES (if voice control was active)
      if (wasListening) {
        console.log('?? [V4-CLEAN] Restarting mic after TTS...');
        // Ensure we restart cleanly
        if (!recognitionRef.current) {
            setTimeout(() => {
                startMicListening();
            }, 200);
        }
      } else {
        console.log('?? [V4-CLEAN] NOT restarting - wasListening is false');
      }
    } catch (error) {
      console.error('? [V4-CLEAN] TTS error:', error);
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      // Try to recover mic if TTS fails
      if (wasListening) {
          startMicListening();
      }
    }
  };

  // 2. Handle Commands
  const handleVoiceCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    console.log('?? Command received:', cmd);
    console.log('?? Call stack:', new Error().stack?.split('\n')[2]);
    
    // Cooldown
    const now = Date.now();
    if (now - lastCommandTimeRef.current.time < 1000 && cmd === lastCommandTimeRef.current.lastCmd) {
      console.log('?? [V4-CLEAN] BLOCKED by cooldown');
      return;
    }
    lastCommandTimeRef.current = { time: now, lastCmd: cmd };
    setLastCommand(cmd);
    setTimeout(() => setLastCommand(""), 3000);
    
    console.log('? [V4-CLEAN] Command EXECUTING:', cmd);

    // LOGIC
    if (cmd.includes('next')) {
      const newStep = Math.min(currentStepRef.current + 1, recipe.instructions.length - 1);
      setCurrentStep(newStep);
      const instruction = recipe.instructions[newStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
      const prefix = newStep === recipe.instructions.length - 1 ? "Final step." : `Step ${newStep + 1}.`;
      speakText(`${prefix} ${instruction}`);
    }
    else if (cmd.includes('back') || cmd.includes('previous')) {
      const newStep = Math.max(currentStepRef.current - 1, 0);
      setCurrentStep(newStep);
      const instruction = recipe.instructions[newStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
      speakText(`Step ${newStep + 1}. ${instruction}`);
    }
    else if (cmd.includes('start') && (cmd.includes('recipe') || cmd.includes('cooking'))) {
      setCurrentStep(0);
      const instruction = recipe.instructions[0]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
      speakText(`Starting ${recipe.name}. Step 1. ${instruction}`);
    }
    else if (cmd.includes('repeat')) {
      const step = currentStepRef.current;
      const instruction = recipe.instructions[step]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
      speakText(`Step ${step + 1}. ${instruction}`);
    }
    else if (cmd.includes('timer')) {
      const step = currentStepRef.current;
      const instruction = recipe.instructions[step] || '';
      const times = parseTimeFromInstruction(instruction);
      if (times.length > 0) {
        startTimer(step + 1, times[0]);
        speakText(`Timer started for ${times[0]} minutes`);
      } else {
        speakText("No timer found in this step");
      }
    }
    else if (cmd.includes('done') || cmd.includes('finish') || cmd.includes('complete')) {
      // Exit cooking mode
      speakText("Cooking complete! Enjoy your meal!");
      setTimeout(() => {
        handleExit();
      }, 1000); // Give TTS time to start
    }
  };

  // 3. CONTINUOUS VOICE CONTROL - WITH WAKE WORD (using Web Speech API)
  // Helper to start mic listening
  const startMicListening = () => {
    if (!isListeningRef.current) {
      console.log('?? [V4-CLEAN] Voice control is OFF');
      return;
    }

    try {
      console.log('?? [V4-CLEAN] Starting continuous listening...');
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true; // CONTINUOUS MODE
      recognition.interimResults = false; // Set to false to reduce beeping
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1; // Reduce processing overhead
      
      // Try to suppress audio feedback (if supported)
      try {
        // Some browsers support this to reduce beeping
        if ('serviceURI' in recognition) {
          (recognition as any).serviceURI = '';
        }
      } catch (e) {
        // Not supported, ignore
      }

      recognition.onstart = () => {
        setIsListening(true); // Update UI state
        console.log('?? [V4-CLEAN] Listening for "Quick Dish"...');
      };

      recognition.onresult = (event: any) => {
        // Loop through results for continuous recognition
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result && result[0]) {
                const transcript = result[0].transcript.toLowerCase().trim();
                
                // Only process final results or high confidence interim
                if (result.isFinal) {
                    console.log('?? [V4-CLEAN] Final heard:', transcript);
                    const hasWakeWord = transcript.includes('quick dish') || transcript.includes('quickdish');
            
                    if (hasWakeWord) {
                        console.log('? [V4-CLEAN] Wake word detected! Processing command...');
                        handleVoiceCommand(transcript);
                        // Note: handleVoiceCommand calls speakText, which handles the mic stop/restart
                    } else {
                        console.log('? [V4-CLEAN] No wake word - ignoring');
                        // Continues listening...
                    }
                }
            }
        }
      };

      recognition.onend = () => {
        console.log('?? [V4-CLEAN] Mic ended');
        recognitionRef.current = null;
        
        // CRITICAL FIX: Only auto-restart if we are NOT speaking (TTS)
        // If we are speaking, speakText will handle the restart after TTS is done
        if (isListeningRef.current && !isSpeakingRef.current) {
           console.log('?? [V4-CLEAN] Auto-restarting mic (not speaking)...');
           // Increased delay to reduce beeping frequency
           setTimeout(() => startMicListening(), 1000);
        } else if (!isListeningRef.current) {
           setIsListening(false);
           console.log('?? [V4-CLEAN] Stopped (user disabled)');
        } else {
           console.log('?? [V4-CLEAN] Paused for TTS (will resume after speech)');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('? [V4-CLEAN] Error:', event.error);
        // If aborted (usually by us stopping it) or no-speech, just ignore or restart if needed
        if (isListeningRef.current && !isSpeakingRef.current) {
           if (event.error === 'aborted' || event.error === 'no-speech' || event.error === 'no-speech') {
              // Ignore aborted and no-speech errors to prevent unnecessary restarts/beeping
              // Rely on onend to restart if needed.
              return;
           } else {
              console.log('?? [V4-CLEAN] Error, restarting mic...');
              // Increased delay to reduce beeping frequency
              setTimeout(() => startMicListening(), 1000);
           }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (error) {
      console.error('? [V4-CLEAN] Failed to start:', error);
      toast({ title: "Voice control failed", variant: "destructive" });
      setIsListening(false);
    }
  };

  const toggleVoiceControl = async () => {
    if (!voiceSupported) {
      toast({ title: "Voice not supported", variant: "destructive" });
      return;
    }

    if (isListeningRef.current) { // If currently listening, stop it
      console.log('?? [V4-CLEAN] Stopping voice control');
      isListeningRef.current = false; // Set this early to indicate intent
      setIsListening(false); // Update UI state
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }

    // Start hands-free mode
    console.log('?? [V4-CLEAN] Starting voice control');
    isListeningRef.current = true; // Set this early to indicate intent
    setIsListening(true); // Update UI state

    // NO AUTO-READ ON START - just start listening
      console.log('?? [V4-CLEAN] No auto-read on start');
    startMicListening();
  };

  // Keep screen awake
  useEffect(() => {
    if ('wakeLock' in navigator) {
      let wakeLock: any = null;
      (navigator as any).wakeLock.request('screen')
        .then((wl: any) => wakeLock = wl)
        .catch((err: any) => { if (import.meta.env.DEV) console.log('Wake Lock error:', err); });
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
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, showFullRecipe]);

  // Handle recipe completion toast (manual exit)
  useEffect(() => {
    if (recipe.instructions.length === 0) return;
    if (currentStep === recipe.instructions.length - 1) {
      if (!hasShownCompletionRef.current) {
        hasShownCompletionRef.current = true;
        toast({ title: "Cooking complete! Enjoy! ??" });
      }
    } else {
      hasShownCompletionRef.current = false;
    }
  }, [currentStep, recipe.instructions.length]);

  const handleNext = () => {
    setCurrentStep(prev => {
      if (prev < recipe.instructions.length - 1) {
        return prev + 1;
      }

      // On last step, clicking "DONE!" should exit
      if (isListeningRef.current) {
        speakText("Cooking complete! Enjoy your meal!");
        setTimeout(() => {
          handleExit();
        }, 1000); // Give TTS time to start
      } else {
        handleExit();
      }
      return prev; // Already on last step
    });
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Handle exit - stop voice recognition before exiting
  const handleExit = async () => {
    if (isListeningRef.current) {
       setIsListening(false);
       isListeningRef.current = false;
       if (recognitionRef.current) {
          try {
             recognitionRef.current.abort();
             recognitionRef.current = null;
          } catch(e) {}
       }
    }
    onExit();
  };

  // Extract ingredients needed for current step
  const getStepIngredients = (instruction: string) => {
    const stepIngredients: Array<{amount: string, unit: string, item: string}> = [];
    const instructionLower = instruction.toLowerCase();
    
    recipe.ingredients.forEach(ing => {
      const itemName = ing.item.toLowerCase();
      // Check if this ingredient is mentioned in the current step
      const itemWords = itemName.split(/[\s,]+/).filter(w => w.length > 2);
      const isInStep = itemWords.some(word => instructionLower.includes(word)) || instructionLower.includes(itemName);
      
      if (isInStep) {
        stepIngredients.push(ing);
      }
    });
    
    return stepIngredients;
  };

  const currentInstruction = recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
  const stepIngredients = getStepIngredients(currentInstruction);
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;
  const stepTimes = parseTimeFromInstruction(currentInstruction);
  const hasActiveTimerForStep = timers.some(t => t.stepNumber === currentStep + 1 && t.remainingSeconds > 0);

  if (showFullRecipe) {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col text-black">
        <div className="bg-gradient-to-r from-[#047857] to-[#065f46] text-white px-5 py-6" style={{ paddingTop: 'calc(var(--sat) + 1rem)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{recipe.name}</h2>
            <button onClick={() => setShowFullRecipe(false)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">
                            ×
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-[#047857]">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="flex items-start text-lg">
                  <span className="text-[#047857] mr-2">•</span>
                  <span>{formatIngredient(ing)}</span>
                </li>
              )) || <li className="text-gray-500">No ingredients available</li>}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#047857]">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions?.map((instruction, i) => (
                <li key={i} className={`flex p-4 rounded-lg ${i === currentStep ? 'bg-green-100 border-2 border-[#047857]' : 'bg-gray-50'}`}>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#047857] text-white flex items-center justify-center mr-4 font-bold">{i + 1}</span>
                  <p className="flex-1 pt-1 text-lg">{instruction.replace(/\[|\]/g, '')}</p>
                </li>
              )) || <li className="text-gray-500 p-4">No instructions available</li>}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col text-black">
      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[60]">
          <span className="text-2xl">🔊</span>
          <span className="font-bold">SPEAKING</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#047857] to-[#065f46] text-white px-4 sm:px-6 py-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleExit} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-lg">
            ←
          </button>
          <div className="flex gap-2">
            <button onClick={handleExit} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
              <X size={20} />
            </button>
            <button onClick={() => setShowFullRecipe(true)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-lg">
              ☰
            </button>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2">{recipe.name}</h1>
        <div className="bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
          <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm opacity-90">Step {currentStep + 1} of {recipe.instructions.length}</p>
      </div>

      {/* Step Content */}
      <div className="p-4 sm:p-6 md:p-8 bg-white flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#047857] rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
            {currentStep + 1}
          </div>
          <span className="text-sm font-semibold text-gray-500 uppercase">Step {currentStep + 1}</span>
        </div>
        {/* Current Step Instruction */}
        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-900 font-medium mb-6">
          {currentInstruction}
        </p>

        {/* Ingredients for this step only */}
        {stepIngredients.length > 0 && (
          <div className="mb-6 p-6 bg-green-50 rounded-xl border-2 border-green-200">
            <h3 className="text-[#047857] text-xl font-bold mb-4">You'll need for this step:</h3>
            <ul className="space-y-2">
              {stepIngredients.map((ing, i) => (
                <li key={i} className="text-lg text-gray-700">• {formatIngredient(ing)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timer Buttons */}
        {stepTimes.length > 0 && !hasActiveTimerForStep && (
          <div className="mt-6 flex flex-col gap-3">
            {stepTimes.map((minutes, i) => (
              <button
                key={i}
                onClick={() => startTimer(currentStep + 1, minutes)}
                className="w-full h-12 sm:h-14 bg-[#047857] text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:bg-[#065f46] transition-all"
              >
                Start {minutes} Minute Timer
              </button>
            ))}
          </div>
        )}

        {/* VOICE CONTROL */}
        {voiceSupported && (
          <div className="mt-6 space-y-3">
            {/* Main Voice Toggle */}
            <button 
              onClick={toggleVoiceControl}
              className={`mt-4 w-full h-14 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                isListening 
                  ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' 
                  : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
              }`}
            >
              {isListening ? (
                <><Mic size={20} /> Stop Voice Control</>
              ) : (
                <><Mic size={20} /> Enable Voice Control</>
              )}
            </button>

            {/* VOICE COMMANDS HELP */}
            {isListening && (
              <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Mic size={18} /> Voice Commands
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600"><Play size={16} /></span>
                    <div>
                      <p className="font-semibold text-gray-900">"Quick Dish Start Recipe"</p>
                      <p className="text-gray-600 text-xs">Start from beginning with audio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600"><FastForward size={16} /></span>
                    <div>
                      <p className="font-semibold text-gray-900">"Quick Dish Next"</p>
                      <p className="text-gray-600 text-xs">Move to next step</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600"><Rewind size={16} /></span>
                    <div>
                      <p className="font-semibold text-gray-900">"Quick Dish Back"</p>
                      <p className="text-gray-600 text-xs">Go to previous step</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600"><RotateCcw size={16} /></span>
                    <div>
                      <p className="font-semibold text-gray-900">"Quick Dish Repeat"</p>
                      <p className="text-gray-600 text-xs">Read current step aloud</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600"><Timer size={16} /></span>
                    <div>
                      <p className="font-semibold text-gray-900">"Quick Dish Start Timer"</p>
                      <p className="text-gray-600 text-xs">Start timer for current step</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600"><CheckCircle size={16} /></span>
                    <div>
                      <p className="font-semibold text-gray-900">"Quick Dish Done"</p>
                      <p className="text-gray-600 text-xs">Finish recipe and exit</p>
                    </div>
                  </div>
                </div>
                
                {/* Volume Tip */}
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <div className="flex items-start gap-2 text-xs text-blue-800">
                    <span className="text-lg">💡</span>
                    <p>
                      <strong>Too much beeping?</strong><br/>
                      Try lowering your phone's <strong>Notification</strong> volume.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Timers */}
      {timers.length > 0 && (
        <div className="bg-green-50 border-t-2 border-green-200 p-4">
          <div className="text-sm font-semibold text-green-800 mb-2">Active Timers:</div>
          <div className="space-y-2">
            {timers.map(timer => (
              <div key={timer.id} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                <span className="font-medium text-gray-700">Step {timer.stepNumber}</span>
                <span className="text-2xl font-bold text-green-600">{formatTime(timer.remainingSeconds)}</span>
                <div className="flex gap-2">
                  {timer.remainingSeconds > 0 && (
                    <>
                      <button onClick={() => timer.isRunning ? pauseTimer(timer.id) : resumeTimer(timer.id)} className="text-sm text-gray-600 px-2">
                        {timer.isRunning ? 'Pause' : 'Resume'}
                      </button>
                      <button onClick={() => cancelTimer(timer.id)} className="text-sm text-red-600 px-2">
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
      <div 
        className="flex gap-3 p-4 bg-white border-t border-gray-200"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 3rem)' }}
      >
        <button 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex-1 h-12 sm:h-14 bg-gray-100 text-gray-700 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-200 disabled:opacity-50"
        >
          BACK
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 h-12 sm:h-14 bg-[#047857] text-white rounded-xl font-semibold text-base sm:text-lg shadow-md hover:bg-[#065f46]"
        >
          {currentStep === recipe.instructions.length - 1 ? 'DONE!' : 'NEXT'}
        </button>
      </div>
    </div>
  );
};

export default CookingMode;





