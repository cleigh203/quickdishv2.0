import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function GenerateNewRecipeImages() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState("");
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Array<{ name: string; success: boolean }>>([]);

  const recipes = [
    { name: "Chicken and Dumplings", description: "Tender chicken with fluffy dumplings in rich broth", filename: "one-pot-chicken-dumplings.jpg" },
    { name: "Beef Bourguignon", description: "Classic French beef stew with red wine and vegetables", filename: "one-pot-beef-bourguignon.jpg" },
    { name: "Jambalaya", description: "Spicy Creole rice dish with sausage, chicken and shrimp", filename: "one-pot-jambalaya.jpg" },
    { name: "Chicken Tortilla Soup", description: "Mexican-inspired soup with tortilla strips and avocado", filename: "one-pot-chicken-tortilla-soup.jpg" },
    { name: "Vegetable Curry", description: "Indian-spiced vegetable curry with coconut milk", filename: "one-pot-vegetable-curry.jpg" },
    { name: "Beef Stroganoff", description: "Creamy beef and mushroom pasta in sour cream sauce", filename: "one-pot-beef-stroganoff.jpg" },
    { name: "Minestrone Soup", description: "Italian vegetable soup with beans and pasta", filename: "one-pot-minestrone.jpg" },
    { name: "Seafood Paella", description: "Spanish rice with mixed seafood and saffron", filename: "one-pot-seafood-paella.jpg" },
    { name: "Chili Con Carne", description: "Hearty beef chili with beans and spices", filename: "one-pot-chili-con-carne.jpg" },
    { name: "Moroccan Tagine", description: "North African stew with lamb and dried fruits", filename: "one-pot-moroccan-tagine.jpg" },
    { name: "Chicken Cacciatore", description: "Italian chicken braised with tomatoes and herbs", filename: "one-pot-chicken-cacciatore.jpg" },
    { name: "Thai Red Curry", description: "Spicy Thai curry with vegetables and coconut milk", filename: "one-pot-thai-red-curry.jpg" },
    { name: "Shepherd's Pie", description: "Ground lamb with vegetables topped with mashed potatoes", filename: "one-pot-shepherds-pie.jpg" },
    { name: "Gumbo", description: "Louisiana stew with okra, sausage and seafood", filename: "one-pot-gumbo.jpg" },
    { name: "Baked Ziti", description: "Italian pasta bake with ricotta and mozzarella", filename: "one-pot-baked-ziti.jpg" },
    { name: "Chicken and Rice", description: "One-pot meal with seasoned chicken and fluffy rice", filename: "one-pot-chicken-rice.jpg" },
    { name: "Pork Carnitas", description: "Mexican slow-cooked shredded pork with citrus", filename: "one-pot-pork-carnitas.jpg" },
    { name: "Ratatouille", description: "French vegetable stew with eggplant and zucchini", filename: "one-pot-ratatouille.jpg" },
    { name: "Chicken Biryani", description: "Aromatic Indian rice dish with spiced chicken", filename: "one-pot-chicken-biryani.jpg" },
    { name: "Stuffed Pepper Casserole", description: "Deconstructed stuffed peppers in tomato sauce", filename: "one-pot-stuffed-pepper-casserole.jpg" }
  ];

  const generateBatch = async (batch: any[]) => {
    for (const recipe of batch) {
      setCurrentRecipe(recipe.name);
      try {
        const { data, error } = await supabase.functions.invoke('generate-bulk-recipe-images', {
          body: { recipes: [recipe] }
        });
        
        if (error) {
          console.error('Error generating:', recipe.name, error);
          setGeneratedImages(prev => [...prev, { name: recipe.name, success: false }]);
          toast.error(`Failed to generate ${recipe.name}`);
        } else {
          console.log('Generated:', recipe.name, data);
          setGeneratedImages(prev => [...prev, { name: recipe.name, success: true }]);
          toast.success(`Generated ${recipe.name}`);
        }
      } catch (err) {
        console.error('Exception generating:', recipe.name, err);
        setGeneratedImages(prev => [...prev, { name: recipe.name, success: false }]);
      }
      
      setCompleted(prev => prev + 1);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setCompleted(0);
    setTotal(recipes.length);
    setGeneratedImages([]);
    
    const batches = [];
    for (let i = 0; i < recipes.length; i += 3) {
      batches.push(recipes.slice(i, i + 3));
    }

    for (let i = 0; i < batches.length; i++) {
      await generateBatch(batches[i]);
      setProgress(((i + 1) / batches.length) * 100);
    }

    setGenerating(false);
    setCurrentRecipe("");
    toast.success(`Generation complete! ${generatedImages.filter(img => img.success).length}/${recipes.length} images generated successfully`);
  };

  // Auto-start generation on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="container p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">One Pot Wonders - Image Generation</h1>
      <p className="text-muted-foreground mb-6">
        Generating realistic food photography for all {recipes.length} One Pot Wonder recipes
      </p>
      
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg border">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completed}/{total} recipes
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {currentRecipe && (
              <div className="text-sm text-muted-foreground animate-pulse">
                Currently generating: <span className="font-medium">{currentRecipe}</span>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={generating}
          size="lg"
          className="w-full"
        >
          {generating ? 'Generating Images...' : 'Restart Generation'}
        </Button>

        {generatedImages.length > 0 && (
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="font-semibold mb-4">Generation Results</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {generatedImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-2 rounded ${
                    img.success ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                >
                  <span className="text-sm">{img.name}</span>
                  <span className="text-xs">
                    {img.success ? '✓ Success' : '✗ Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
