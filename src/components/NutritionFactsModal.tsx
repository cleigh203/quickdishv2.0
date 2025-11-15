import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Nutrition } from "@/types/recipe";
import { Separator } from "@/components/ui/separator";

interface NutritionFactsModalProps {
  open: boolean;
  onClose: () => void;
  nutrition: Nutrition;
  recipeName: string;
}

export const NutritionFactsModal = ({ open, onClose, nutrition, recipeName }: NutritionFactsModalProps) => {
  // Calculate daily value percentages (based on 2000 calorie diet)
  const dailyValues = {
    fat: Math.round((nutrition.fat / 78) * 100),
    carbs: Math.round((nutrition.carbs / 275) * 100),
    fiber: Math.round((nutrition.fiber / 28) * 100),
    protein: Math.round((nutrition.protein / 50) * 100),
    sugar: Math.round((nutrition.sugar / 50) * 100),
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Nutrition Facts</DialogTitle>
          <DialogDescription className="text-center">
            {recipeName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="border-2 border-black p-4 space-y-2 font-sans">
          {/* Serving Size */}
          <div className="border-b-8 border-black pb-2">
            <div className="text-sm">Serving Size</div>
            <div className="font-bold">{nutrition.servingSize}</div>
          </div>

          {/* Calories */}
          <div className="border-b-4 border-black py-2">
            <div className="flex justify-between items-end">
              <span className="font-bold text-3xl">Calories</span>
              <span className="font-bold text-4xl">{nutrition.calories}</span>
            </div>
          </div>

          {/* Daily Value Header */}
          <div className="border-b-4 border-black py-1">
            <div className="text-xs text-right font-bold">% Daily Value*</div>
          </div>

          {/* Nutrients */}
          <div className="space-y-1">
            <NutrientRow 
              label="Total Fat" 
              amount={`${nutrition.fat}g`}
              dailyValue={dailyValues.fat}
              bold
            />
            <NutrientRow 
              label="Total Carbohydrate" 
              amount={`${nutrition.carbs}g`}
              dailyValue={dailyValues.carbs}
              bold
            />
            <NutrientRow 
              label="Dietary Fiber" 
              amount={`${nutrition.fiber}g`}
              dailyValue={dailyValues.fiber}
              indent
            />
            <NutrientRow 
              label="Total Sugars" 
              amount={`${nutrition.sugar}g`}
              dailyValue={dailyValues.sugar}
              indent
            />
            <Separator className="my-2 border-t-4 border-black" />
            <NutrientRow 
              label="Protein" 
              amount={`${nutrition.protein}g`}
              dailyValue={dailyValues.protein}
              bold
            />
          </div>

          <Separator className="my-2 border-t-8 border-black" />

          {/* Footer Note */}
          <div className="text-xs pt-2">
            <p>* Percent Daily Values are based on a 2,000 calorie diet.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface NutrientRowProps {
  label: string;
  amount: string;
  dailyValue?: number;
  bold?: boolean;
  indent?: boolean;
}

const NutrientRow = ({ label, amount, dailyValue, bold, indent }: NutrientRowProps) => (
  <div className={`flex justify-between border-b border-gray-300 py-1 ${indent ? 'pl-4' : ''}`}>
    <span className={bold ? 'font-bold' : ''}>{label} {amount}</span>
    {dailyValue !== undefined && (
      <span className={bold ? 'font-bold' : ''}>{dailyValue}%</span>
    )}
  </div>
);
