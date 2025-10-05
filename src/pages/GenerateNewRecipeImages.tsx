import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function GenerateNewRecipeImages() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const recipes = [
    { name: "Chocolate Soufflé", filename: "dessert-chocolate-souffle.jpg" },
    { name: "Strawberry Shortcake", filename: "dessert-strawberry-shortcake.jpg" },
    // Add more recipes here
  ];

  const generateBatch = async (batch: any[]) => {
    for (const recipe of batch) {
      const { data } = await supabase.functions.invoke('generate-bulk-recipe-images', {
        body: { recipes: [recipe] }
      });
      console.log('Generated:', recipe.name, data);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const batches = [];
    for (let i = 0; i < recipes.length; i += 5) {
      batches.push(recipes.slice(i, i + 5));
    }

    for (let i = 0; i < batches.length; i++) {
      await generateBatch(batches[i]);
      setProgress(((i + 1) / batches.length) * 100);
    }

    setGenerating(false);
    toast.success('All images generated!');
  };

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-4">Generate Recipe Images</h1>
      <Button onClick={handleGenerate} disabled={generating}>
        {generating ? `Generating... ${Math.round(progress)}%` : 'Generate All Images'}
      </Button>
    </div>
  );
}
