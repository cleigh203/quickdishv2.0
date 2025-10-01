import { useState, useEffect } from "react";
import { X, List, ChevronLeft, ChevronRight, Mic, MicOff } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const { toast } = useToast();

  // Check browser support for voice features
  useEffect(() => {
    const hasVoiceRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    setVoiceSupported(hasVoiceRecognition && hasSpeechSynthesis);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!voiceSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      setLastCommand(command);
      handleVoiceCommand(command);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Silently restart
        return;
      }
      toast({
        title: "Voice error",
        description: "Please try again",
        variant: "destructive"
      });
    };

    recognitionInstance.onend = () => {
      // Auto-restart if still supposed to be listening
      if (isListening) {
        try {
          recognitionInstance.start();
        } catch (error) {
          console.log('Recognition restart error:', error);
        }
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance?.stop();
    };
  }, [voiceSupported]);

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command:', command);

    if (command.includes('next') || command.includes('forward')) {
      toast({ title: `Heard: "${command}"`, description: "Moving to next step" });
      handleNext();
      announceStep(currentStep + 1);
    } else if (command.includes('previous') || command.includes('back') || command.includes('last')) {
      toast({ title: `Heard: "${command}"`, description: "Going back" });
      handlePrevious();
      announceStep(currentStep - 1);
    } else if (command.includes('repeat') || command.includes('again') || command.includes('read')) {
      toast({ title: `Heard: "${command}"`, description: "Repeating step" });
      speakCurrentStep();
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
      // Unknown command - don't show error, just log it
      console.log('Unknown command:', command);
    }
  };

  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const currentInstruction = recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '').replace(/\[|\]/g, '') || '';
    const speech = new SpeechSynthesisUtterance(currentInstruction);
    speech.rate = 0.85;
    speech.pitch = 1;
    speech.volume = 1;
    
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

  const toggleVoiceControl = () => {
    if (!voiceSupported) {
      toast({
        title: "Voice control not supported",
        description: "Your browser doesn't support voice commands. Try Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
      window.speechSynthesis.cancel();
      toast({ title: "Voice control off" });
    } else {
      try {
        recognition?.start();
        setIsListening(true);
        toast({ 
          title: "Voice control active",
          description: "Say: Next, Back, Repeat, Ingredients"
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Couldn't start voice control",
          description: "Please try again",
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
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (isListening) {
        const speech = new SpeechSynthesisUtterance("Cooking complete! Enjoy your meal!");
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
      }
      toast({ title: "Cooking complete! Enjoy! 🎉" });
      onExit();
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
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

  if (showFullRecipe) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header */}
        <div className="p-4 bg-gray-900 flex justify-between items-center gap-4">
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
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Full Recipe Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-primary">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, index) => {
                const ingredientText = `${ing.amount} ${ing.unit} ${ing.item}`.trim();
                return (
                  <li key={index} className="flex items-start text-lg">
                    <span className="text-primary mr-2">•</span>
                    <span>{ingredientText}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className={`flex p-4 rounded-lg ${
                    index === currentStep ? 'bg-primary/20 border border-primary' : 'bg-gray-900'
                  }`}
                >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center mr-4 font-bold">
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header with Progress */}
      <div className="p-4 bg-gray-900">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
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
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isListening && (
          <div className="mb-3 p-2 bg-primary/20 rounded-lg text-center">
            <p className="text-xs text-primary font-medium">
              🎤 Say: "Next", "Back", "Repeat", "Ingredients", "Exit"
            </p>
            {lastCommand && (
              <p className="text-xs text-gray-400 mt-1">
                Last heard: "{lastCommand}"
              </p>
            )}
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
          <h2 className="text-primary text-4xl md:text-5xl mb-6 font-bold">
            Step {currentStep + 1}
          </h2>
          
          <p className="text-white text-3xl md:text-5xl leading-relaxed font-light mb-8">
            {currentInstruction}
          </p>

          {/* Ingredient Amounts for This Step */}
          {stepIngredients.length > 0 && (
            <div className="mt-8 p-6 bg-gray-900 rounded-xl">
              <h3 className="text-primary text-2xl font-bold mb-4">You'll need:</h3>
              <ul className="space-y-2">
                {stepIngredients.map((ing, index) => (
                  <li key={index} className="text-xl text-gray-200">
                    • {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Voice control helper for mobile */}
          {voiceSupported && !isListening && (
            <div className="mt-8">
              <Button
                onClick={toggleVoiceControl}
                variant="outline"
                size="lg"
                className="text-lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Enable Hands-Free Voice Control
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons - HUGE for elbow tapping */}
      <div className="p-4 bg-gray-900">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handlePrevious}
            className="py-8 bg-gray-700 text-white text-2xl font-bold rounded-xl disabled:opacity-30 active:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-8 h-8" />
            BACK
          </button>
          <button
            onClick={handleNext}
            className="py-8 bg-primary text-black text-2xl font-bold rounded-xl active:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {currentStep === recipe.instructions.length - 1 ? 'DONE!' : 'NEXT'}
            {currentStep < recipe.instructions.length - 1 && <ChevronRight className="w-8 h-8" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingMode;
