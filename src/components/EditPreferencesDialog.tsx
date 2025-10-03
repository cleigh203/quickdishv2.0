import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Kosher',
  'Halal',
  'Low-Carb',
];

const CUISINE_OPTIONS = [
  'Italian',
  'Mexican',
  'Asian',
  'American',
  'French',
  'Mediterranean',
  'Indian',
  'Thai',
];

const LEARNING_OPTIONS = [
  'Baking',
  'Grilling',
  'Meal Prep',
  'Quick Meals',
  'Healthy Cooking',
  'Desserts',
  'International Cuisine',
  'Knife Skills',
];

interface EditPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPreferences: {
    dietary_preferences: string[] | null;
    skill_level: string | null;
    favorite_cuisines: string[] | null;
    learning_goals: string[] | null;
  };
  onUpdate: () => void;
}

export function EditPreferencesDialog({
  open,
  onOpenChange,
  currentPreferences,
  onUpdate,
}: EditPreferencesDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(
    currentPreferences.dietary_preferences || []
  );
  const [skillLevel, setSkillLevel] = useState(currentPreferences.skill_level || 'beginner');
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>(
    currentPreferences.favorite_cuisines || []
  );
  const [learningGoals, setLearningGoals] = useState<string[]>(
    currentPreferences.learning_goals || []
  );

  useEffect(() => {
    if (open) {
      setDietaryPreferences(currentPreferences.dietary_preferences || []);
      setSkillLevel(currentPreferences.skill_level || 'beginner');
      setFavoriteCuisines(currentPreferences.favorite_cuisines || []);
      setLearningGoals(currentPreferences.learning_goals || []);
    }
  }, [currentPreferences, open]);

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          dietary_preferences: dietaryPreferences.length > 0 ? dietaryPreferences : null,
          skill_level: skillLevel,
          favorite_cuisines: favoriteCuisines.length > 0 ? favoriteCuisines : null,
          learning_goals: learningGoals.length > 0 ? learningGoals : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Preferences updated',
        description: 'Your cooking preferences have been updated',
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Preferences</DialogTitle>
          <DialogDescription>Update your cooking preferences and goals</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dietary Restrictions */}
          <div>
            <Label className="text-base mb-3 block">Dietary Restrictions</Label>
            <div className="grid grid-cols-2 gap-3">
              {DIETARY_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-dietary-${option}`}
                    checked={dietaryPreferences.includes(option)}
                    onCheckedChange={() =>
                      toggleArrayItem(dietaryPreferences, setDietaryPreferences, option)
                    }
                  />
                  <label
                    htmlFor={`edit-dietary-${option}`}
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <Label className="text-base mb-3 block">Skill Level</Label>
            <RadioGroup value={skillLevel} onValueChange={setSkillLevel}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="edit-beginner" />
                <Label htmlFor="edit-beginner" className="cursor-pointer font-normal">
                  Beginner
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="edit-intermediate" />
                <Label htmlFor="edit-intermediate" className="cursor-pointer font-normal">
                  Intermediate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="edit-advanced" />
                <Label htmlFor="edit-advanced" className="cursor-pointer font-normal">
                  Advanced
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Favorite Cuisines */}
          <div>
            <Label className="text-base mb-3 block">Favorite Cuisines</Label>
            <div className="grid grid-cols-2 gap-3">
              {CUISINE_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-cuisine-${option}`}
                    checked={favoriteCuisines.includes(option)}
                    onCheckedChange={() =>
                      toggleArrayItem(favoriteCuisines, setFavoriteCuisines, option)
                    }
                  />
                  <label
                    htmlFor={`edit-cuisine-${option}`}
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div>
            <Label className="text-base mb-3 block">Learning Goals</Label>
            <div className="grid grid-cols-2 gap-3">
              {LEARNING_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-learning-${option}`}
                    checked={learningGoals.includes(option)}
                    onCheckedChange={() =>
                      toggleArrayItem(learningGoals, setLearningGoals, option)
                    }
                  />
                  <label
                    htmlFor={`edit-learning-${option}`}
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
