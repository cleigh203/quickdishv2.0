import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Camera, ChevronRight, ChevronLeft } from 'lucide-react';

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

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [learningGoals, setLearningGoals] = useState<string[]>([]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = null;

      // Upload avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName || null,
          avatar_url: avatarUrl,
          dietary_preferences: dietaryPreferences.length > 0 ? dietaryPreferences : null,
          skill_level: skillLevel,
          favorite_cuisines: favoriteCuisines.length > 0 ? favoriteCuisines : null,
          learning_goals: learningGoals.length > 0 ? learningGoals : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile setup complete!',
        description: 'Welcome to QuickDish AI',
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error completing profile setup:', error);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg p-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s === step
                      ? 'bg-primary text-primary-foreground'
                      : s < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      s < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome! Let's set up your profile</h2>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/128/10b981/ffffff?text=User';
                      }}
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">Upload a profile picture (optional)</p>
            </div>

            {/* Display name */}
            <div>
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Cooking Preferences</h2>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>

            {/* Dietary restrictions */}
            <div>
              <Label className="text-base mb-3 block">Dietary Restrictions</Label>
              <div className="grid grid-cols-2 gap-3">
                {DIETARY_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dietary-${option}`}
                      checked={dietaryPreferences.includes(option)}
                      onCheckedChange={() =>
                        toggleArrayItem(dietaryPreferences, setDietaryPreferences, option)
                      }
                    />
                    <label
                      htmlFor={`dietary-${option}`}
                      className="text-sm cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill level */}
            <div>
              <Label className="text-base mb-3 block">Skill Level</Label>
              <RadioGroup value={skillLevel} onValueChange={setSkillLevel}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="cursor-pointer font-normal">
                    Beginner - Just starting out
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="cursor-pointer font-normal">
                    Intermediate - Comfortable in the kitchen
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced" className="cursor-pointer font-normal">
                    Advanced - Experienced cook
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Favorite cuisines */}
            <div>
              <Label className="text-base mb-3 block">Favorite Cuisines</Label>
              <div className="grid grid-cols-2 gap-3">
                {CUISINE_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cuisine-${option}`}
                      checked={favoriteCuisines.includes(option)}
                      onCheckedChange={() =>
                        toggleArrayItem(favoriteCuisines, setFavoriteCuisines, option)
                      }
                    />
                    <label
                      htmlFor={`cuisine-${option}`}
                      className="text-sm cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What do you want to learn?</h2>
              <p className="text-muted-foreground">Select your cooking interests</p>
            </div>

            <div>
              <Label className="text-base mb-3 block">Learning Goals</Label>
              <div className="grid grid-cols-2 gap-3">
                {LEARNING_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`learning-${option}`}
                      checked={learningGoals.includes(option)}
                      onCheckedChange={() =>
                        toggleArrayItem(learningGoals, setLearningGoals, option)
                      }
                    />
                    <label
                      htmlFor={`learning-${option}`}
                      className="text-sm cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip
          </Button>

          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={loading}>
              {loading ? (
                'Saving...'
              ) : step === 3 ? (
                'Complete'
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
