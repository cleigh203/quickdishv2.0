import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const RECIPES_TO_REGENERATE = [
  {
    recipeId: "copycat-mcdonalds-egg-mcmuffin",
    recipeName: "McDonald's Egg McMuffin",
    prompt: "Professional food photography of a homemade breakfast sandwich styled to look like McDonald's Egg McMuffin - toasted English muffin with round egg, melted cheese, and Canadian bacon. Shot from side angle showing all layers clearly. High-quality restaurant-style presentation. Soft natural lighting, shallow depth of field, appetizing colors. Ultra high resolution."
  },
  {
    recipeId: "copycat-olive-garden-house-salad",
    recipeName: "Olive Garden House Salad",
    prompt: "Professional food photography of Olive Garden house salad. Fresh mixed greens including romaine and iceberg lettuce, red onion rings, black olives, pepperoncini peppers, cherry tomatoes, and croutons. Italian dressing drizzled on top, sprinkled with grated Parmesan cheese. Served in a large white bowl. Soft natural lighting, shallow depth of field, fresh and appetizing colors. Ultra high resolution."
  },
  {
    recipeId: "copycat-chipotle-chicken-avocado-melt",
    recipeName: "Panera Chipotle Chicken Avocado Melt",
    prompt: "Professional food photography. The sandwich features toasted sourdough bread with visible grill marks, layers of seasoned grilled chicken breast, fresh avocado slices, melted white cheese, sun-dried tomatoes or roasted red peppers, and fresh greens. The sandwich is cut in half and stacked to showcase the colorful layers. Soft natural lighting from the side, cream and white background, minimalist styling with a halved avocado visible in the soft-focus background. Ultra high resolution."
  }
];

const CustomRegenerateImages = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleRegenerate = async () => {
    setIsProcessing(true);
    setResults([]);

    try {
      toast({
        title: "Regenerating images...",
        description: `Processing ${RECIPES_TO_REGENERATE.length} recipes`,
      });

      const { data, error } = await supabase.functions.invoke('batch-custom-regenerate', {
        body: { recipes: RECIPES_TO_REGENERATE }
      });

      if (error) throw error;

      setResults(data.results);
      
      const successCount = data.results.filter((r: any) => r.success).length;
      toast({
        title: "Complete!",
        description: `${successCount}/${RECIPES_TO_REGENERATE.length} images regenerated successfully`,
      });

      if (successCount > 0) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

    } catch (error: any) {
      console.error('Regeneration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate images",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Regenerate Recipe Images</CardTitle>
            <CardDescription>
              Custom image generation for {RECIPES_TO_REGENERATE.length} recipes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {RECIPES_TO_REGENERATE.map((recipe) => (
                <div key={recipe.recipeId} className="p-3 rounded-lg border">
                  <p className="font-medium">{recipe.recipeName}</p>
                  <p className="text-sm text-muted-foreground mt-1">{recipe.prompt}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleRegenerate}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating Images...
                </>
              ) : (
                'Regenerate All Images'
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2 mt-6">
                <h3 className="font-semibold">Results:</h3>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{result.recipeName || result.recipeId}</p>
                        {result.error && (
                          <p className="text-sm text-red-500">{result.error}</p>
                        )}
                        {result.message && (
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomRegenerateImages;
