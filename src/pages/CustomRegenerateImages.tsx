import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const RECIPES_TO_REGENERATE = [
  {
    recipeId: "copycat-mcdonald-s-egg-mcmuffin",
    recipeName: "McDonald's Egg McMuffin",
    prompt: "Professional food photography of a McDonald's Egg McMuffin copycat. A homemade breakfast sandwich styled to look like McDonald's Egg McMuffin - toasted English muffin with round egg, melted cheese, and Canadian bacon. Shot from side angle showing all layers clearly. Warm, appetizing morning light. Ultra high resolution."
  },
  {
    recipeId: "copycat-olive-garden-house-salad-with-dressing",
    recipeName: "Olive Garden House Salad",
    prompt: "Professional food photography of Olive Garden House Salad. Fresh crisp salad with romaine lettuce, red onion slices, black olives, cherry tomatoes, and croutons. Dressed with Italian dressing. Served in a white bowl. Bright, fresh colors with natural lighting. Ultra high resolution."
  },
  {
    recipeId: "copycat-panera-chipotle-chicken-avocado-melt",
    recipeName: "Panera Chipotle Chicken Avocado Melt",
    prompt: "Professional food photography. The sandwich features toasted sourdough bread with visible grill marks, layers of seasoned grilled chicken breast, fresh avocado slices, melted white cheese, sun-dried tomatoes or roasted red peppers, and fresh greens. The sandwich is cut in half and stacked to showcase the colorful layers. Soft natural lighting from the side, cream and white background, minimalist styling with a halved avocado visible in the soft-focus background. Ultra high resolution."
  },
  {
    recipeId: "copycat-olive-garden-5-cheese-ziti",
    recipeName: "Olive Garden 5-Cheese Ziti Al Forno",
    prompt: "Professional food photography of Olive Garden 5-Cheese Ziti Al Forno. Baked ziti pasta tubes with grilled chicken pieces, covered in rich marinara sauce, dollops of creamy ricotta cheese, and melted mozzarella on top. Served in a rustic baking dish, garnished with fresh basil. Cheese is bubbling and golden brown on the edges. Warm, appetizing colors with soft natural lighting. Ultra high resolution."
  }
];

const CustomRegenerateImages = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [autoTriggered, setAutoTriggered] = useState(false);
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
          window.location.href = '/discover?collection=Restaurant%20Copycats';
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

  // Auto-trigger on mount
  useEffect(() => {
    if (!autoTriggered) {
      setAutoTriggered(true);
      handleRegenerate();
    }
  }, []);

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
