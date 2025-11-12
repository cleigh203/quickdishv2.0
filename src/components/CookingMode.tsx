import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/hooks/use-toast";

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
  const [lastCommand, setLastCommand] = useState<string>("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [timers, setTimers] = useState<Timer[]>([]);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const currentStepRef = useRef(currentStep);
  const isListeningRef = useRef(false);
  const { toast } = useToast();

  // Update refs
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Check platform
  useEffect(() => {
    const checkPlatform = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const native = Capacitor.isNativePlatform();
        setIsNative(native);
        setVoiceSupported(true);
        console.log('Platform:', native ? 'NATIVE' : 'WEB');
      } catch (error) {
        setIsNative(false);
        const hasVoice = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        setVoiceSupported(hasVoice);
        console.log('Platform: WEB, Voice:', hasVoice);
      }
    };
    checkPlatform();
  }, []);

  // Timer countdown
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

  // Simple text to speech - NO mic stopping
  const speakText = async (text: string) => {
    try {
      console.log('🔊 Speaking:', text.substring(0, 40));

      if (isNative) {
        const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
        await TextToSpeech.speak({
          text: text,
          lang: 'en-US',
          rate: 1.0, // Slightly faster for clarity
          pitch: 1.1, // Slightly higher pitch
          volume: 1.0, // Max volume
          category: 'playback', // Changed from 'ambient' for louder output
        });
      } else {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const speech = new SpeechSynthesisUtterance(text);
          speech.rate = 1.0;
          speech.volume = 1.0;
          speech.pitch = 1.1;
          window.speechSynthesis.speak(speech);
        }
      }
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  // Stop voice recognition function - reusable cleanup
  const stopVoiceRecognition = async () => {
    if (!isListeningRef.current) return; // Already stopped
    
    console.log('Stopping voice recognition');
    setIsListening(false);
    isListeningRef.current = false;
    
    try {
      if (isNative) {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        await SpeechRecognition.removeAllListeners();
        await SpeechRecognition.stop();
      } else if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  // Cleanup voice recognition on unmount
  useEffect(() => {
    return () => {
      // Stop voice recognition on unmount
      if (isListeningRef.current) {
        setIsListening(false);
        isListeningRef.current = false;
        
        // Stop web recognition if active
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
            recognitionRef.current.stop();
            recognitionRef.current = null;
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
        
        // Stop native recognition if active (try regardless of platform check)
        import('@capacitor-community/speech-recognition').then(({ SpeechRecognition }) => {
          SpeechRecognition.removeAllListeners().catch(() => {});
          SpeechRecognition.stop().catch(() => {});
        }).catch(() => {
          // Not native platform, ignore
        });
      }
    };
  }, []);

  // Voice command handler
  const handleVoiceCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    console.log('🎤 COMMAND:', cmd);

    if (!cmd) return;

    setLastCommand(cmd);
    setTimeout(() => setLastCommand(""), 3000);
 
    // Timer commands
    if (cmd.includes('timer') || cmd.includes('start timer') || cmd.includes('set timer')) {
      const step = currentStepRef.current;
      const instruction = recipe.instructions[step] || '';
      const times = parseTimeFromInstruction(instruction);
      if (times.length > 0) {
        startTimer(step + 1, times[0]);
        speakText(`Timer set for ${times[0]} minutes`);
      } else {
        speakText("No timer found in this step");
      }
      return;
    }

    // Navigation
    if (cmd.includes('next')) {
          setCurrentStep(prev => {
        if (prev >= recipe.instructions.length - 1) {
          speakText("Recipe complete! Enjoy your meal!");
          // Stop microphone when recipe is done
          stopVoiceRecognition();
          setTimeout(handleExit, 2000);
          return prev;
        }
        return prev + 1; // Auto-read handled by useEffect
      });
    } 
    else if (cmd.includes('previous') || cmd.includes('back')) {
      setCurrentStep(prev => Math.max(0, prev - 1)); // Auto-read handled by useEffect
    }
    else if (cmd.includes('repeat') || cmd.includes('again')) {
      const step = currentStepRef.current;
      const instruction = recipe.instructions[step]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
      speakText(`Step ${step + 1}. ${instruction}`);
    }
    else if (cmd.includes('done') || cmd.includes('finish')) {
      if (currentStepRef.current === recipe.instructions.length - 1) {
        speakText("Congratulations! You finished this recipe!");
        // Stop microphone when user says done on last step
        stopVoiceRecognition();
        setTimeout(handleExit, 3000);
      } else {
        speakText("You're not on the last step yet");
      }
    }
  };

  // Voice control toggle
  const toggleVoiceControl = async () => {
    if (!voiceSupported) {
      toast({
        title: "Voice not supported",
        description: "Your device doesn't support voice commands",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      // STOP LISTENING
      await stopVoiceRecognition();
      toast({ title: "Voice control stopped" });
    } else {
      // START LISTENING
      try {
        console.log('Starting voice control');

        if (isNative) {
          // NATIVE
          const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
          
          await SpeechRecognition.removeAllListeners();
          await SpeechRecognition.requestPermissions();
          
          await SpeechRecognition.addListener('partialResults', (data: any) => {
            if (data?.matches?.[0]) {
              handleVoiceCommand(data.matches[0]);
            }
          });

          await SpeechRecognition.addListener('listeningState', async (state: any) => {
            if (state?.status === 'stopped' && isListeningRef.current) {
              console.log('Stopped, restarting...');
              setTimeout(async () => {
                // Triple-check before actually restarting
                if (!isListeningRef.current) {
                  console.log('Restart cancelled - listening stopped');
                  return;
                }
                try {
                  await SpeechRecognition.start({
                    language: 'en-US',
                    maxResults: 5,
                    prompt: '',
                    partialResults: true,
                    popup: false,
                  });
                } catch (e) {
                  console.log('Restart failed:', e);
                }
              }, 1000);
            }
          });

          await SpeechRecognition.start({
            language: 'en-US',
            maxResults: 5,
            prompt: '',
            partialResults: true,
            popup: false,
          });
 
          setIsListening(true);
          isListeningRef.current = true;
          toast({ 
            title: "🎤 Voice control started",
            description: 'Say "Quick Dish Next"'
          });
        } else {
          // WEB
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (!SpeechRecognition) {
            toast({
              title: "Voice not supported",
              description: "This browser does not support speech recognition",
              variant: "destructive"
            });
            return;
          }

          if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            const hotwordRegex = /^quick dish\b/i;

            recognition.onresult = (event: any) => {
              if (!event.results || event.results.length === 0) return;
              const transcript = event.results[0][0].transcript.trim();
              if (hotwordRegex.test(transcript)) {
                const command = transcript.replace(hotwordRegex, '').trim();
                if (command) {
                  handleVoiceCommand(command);
                }
              } else {
                console.log('❌ Hotword missing:', transcript);
              }
            };

            recognition.onerror = (event: any) => {
              console.error('Recognition error:', event.error);
              if (event.error === 'not-allowed') {
                isListeningRef.current = false;
                recognition.onend = null;
                setIsListening(false);
                toast({
                  title: "Microphone access denied",
                  description: "Please enable microphone permissions",
                  variant: "destructive"
                });
                try {
                  recognition.stop();
                } catch (error) {
                  console.error('Manual stop failed:', error);
                }
                recognitionRef.current = null;
              }
            };

            recognition.onend = () => {
              if (isListeningRef.current) {
                try {
                  recognition.start();
                } catch (error) {
                  console.error('Restart failed:', error);
                }
              }
            };

            recognitionRef.current = recognition;
          }

          isListeningRef.current = true;
          setIsListening(true);

          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Recognition start error:', error);
          }

          toast({ 
            title: "🎤 Voice control started",
            description: 'Say "Quick Dish" before your command'
          });
        }

      } catch (error) {
        console.error('Voice start error:', error);
        toast({
          title: "Couldn't start voice control",
          description: "Please check microphone permissions",
          variant: "destructive"
        });
      }
    }
  };

  // Auto-read step when it changes (if voice is active)
  useEffect(() => {
    if (!isListening || currentStep < 0 || currentStep >= recipe.instructions.length) return;

    const timer = setTimeout(() => {
      const instruction = recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
      speakText(`Step ${currentStep + 1}. ${instruction}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentStep, isListening, recipe.instructions]);

  // Keep screen awake
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
        handleExit();
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
        toast({ title: "Cooking complete! Enjoy! 🎉" });
        // Stop voice recognition when recipe completes
        stopVoiceRecognition();
        setTimeout(handleExit, 2000);
        return prev;
      }
    });
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Handle exit - stop voice recognition before exiting
  const handleExit = async () => {
    await stopVoiceRecognition();
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
      <div className="fixed inset-0 bg-white z-50 flex flex-col text-black">
        <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white px-5 py-6 pt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{recipe.name}</h2>
            <button onClick={() => setShowFullRecipe(false)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">
              ×
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-[#10b981]">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="flex items-start text-lg">
                  <span className="text-[#10b981] mr-2">•</span>
                  <span>{`${ing.amount} ${ing.unit} ${ing.item}`.trim()}</span>
                </li>
              )) || <li className="text-gray-500">No ingredients available</li>}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#10b981]">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions?.map((instruction, i) => (
                <li key={i} className={`flex p-4 rounded-lg ${i === currentStep ? 'bg-green-100 border-2 border-[#10b981]' : 'bg-gray-50'}`}>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center mr-4 font-bold">{i + 1}</span>
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col text-black">
      {/* Voice Listening Indicator - MOVED TO TOP */}
      {isListening && (
        <div className="bg-green-600 text-white px-4 py-2 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <div className="animate-pulse">🎤</div>
          <span>VOICE CONTROL ACTIVE</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white px-5 py-6 pt-12">
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
        <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
        <div className="bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
          <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm opacity-90">Step {currentStep + 1} of {recipe.instructions.length}</p>
      </div>

      {/* Last Command */}
      {lastCommand && (
        <div className="bg-blue-500 text-white px-4 py-2 text-center text-sm">
          Heard: "{lastCommand}"
        </div>
      )}

      {/* Step Content */}
      <div className="p-8 bg-white flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {currentStep + 1}
          </div>
          <span className="text-sm font-semibold text-gray-500 uppercase">Step {currentStep + 1}</span>
        </div>
        {/* Current Step Instruction */}
        <p className="text-2xl leading-relaxed text-gray-900 font-medium mb-7">
          {currentInstruction}
        </p>

        {/* Ingredients for this step only */}
        {stepIngredients.length > 0 && (
          <div className="mb-6 p-6 bg-green-50 rounded-xl border-2 border-green-200">
            <h3 className="text-[#10b981] text-xl font-bold mb-4">You'll need for this step:</h3>
            <ul className="space-y-2">
              {stepIngredients.map((ing, i) => (
                <li key={i} className="text-lg text-gray-700">
                  • {ing.amount} {ing.unit} {ing.item}
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
                className="w-full h-14 bg-[#10b981] text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-[#059669] transition-all"
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
              className={`w-full h-14 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isListening ? '🔴 Stop Voice Control' : '🎤 Start Voice Control'}
            </button>

            {/* Help text - Always show when listening */}
            {isListening && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <p className="font-semibold text-green-800 mb-2">Voice Commands:</p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">QUICK DISH NEXT</span><br />
                  <span className="font-semibold">QUICK DISH BACK</span><br />
                  <span className="font-semibold">QUICK DISH START TIMER</span>
                </p>
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
      <div className="flex gap-3 p-4 pb-8 bg-white border-t border-gray-200">
        <button 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex-1 h-14 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
        >
                     BACK
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 h-14 bg-[#10b981] text-white rounded-xl font-semibold shadow-md hover:bg-[#059669]"
        >
                     {currentStep === recipe.instructions.length - 1 ? 'DONE!' : 'NEXT'}
        </button>
      </div>
    </div>
  );
};

export default CookingMode;
