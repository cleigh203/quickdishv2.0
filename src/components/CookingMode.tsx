import { useState, useEffect } from "react";
import { X, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
}

const CookingMode = ({ recipe, onExit }: CookingModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFullRecipe, setShowFullRecipe] = useState(false);
  const { toast } = useToast();

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

  const currentInstruction = recipe.instructions[currentStep]?.replace(/^\d+\.\s*/, '') || '';
  const stepIngredients = getStepIngredients(currentInstruction);
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;

  if (showFullRecipe) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col text-white">
        {/* Header */}
        <div className="p-4 bg-gray-900 flex justify-between items-center">
          <h2 className="text-xl font-bold">{recipe.name}</h2>
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
                  <p className="flex-1 pt-1 text-lg">{instruction}</p>
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
          <button
            onClick={() => setShowFullRecipe(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <List className="w-6 h-6" />
          </button>
        </div>
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
                ))
              }
              </ul>
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
