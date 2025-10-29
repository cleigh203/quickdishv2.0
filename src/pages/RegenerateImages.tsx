import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { useAllRecipes } from "@/hooks/useAllRecipes";

const RECIPES_TO_REGENERATE = [
  "Red Lobster Cheddar Bay Biscuits",
  "Texas Roadhouse Rolls",
  "Outback Bloomin Onion",
  "Bread Pudding",
  "Peach Cobbler",
  "Pumpkin Cheesecake",
  "Chocolate Chip Banana Bread",
  "Chicken Shawarma Wrap",
  "Southwest Chicken Bowl",
  "Banh Mi Sandwich",
  "Tuna Niçoise Salad",
  "California Roll Bowl",
  "Mediterranean Quinoa Bowl",
];

const RegenerateImages = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();
  const { allRecipes } = useAllRecipes();

  const handleRegenerate = async () => {
    setIsProcessing(true);
    setResults([]);

    try {
      // Find recipes in static data
      const recipesToMigrate = RECIPES_TO_REGENERATE.map(name => {
        const recipe = allRecipes.find(r => 
          r.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(r.name.toLowerCase())
        );
        return recipe;
      }).filter(r => r !== undefined);

      if (recipesToMigrate.length === 0) {
        toast({
          title: "No recipes found",
          description: "Could not find matching recipes in the static data",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Generating images...",
        description: `Processing ${recipesToMigrate.length} recipes. This will take several minutes.`,
      });

      const { data, error } = await supabase.functions.invoke('migrate-static-recipes', {
        body: { recipes: recipesToMigrate }
      });

      if (error) throw error;

      setResults(data.results);
      
      toast({
        title: "Complete!",
        description: `Successfully processed ${data.successCount} of ${data.totalProcessed} recipes`,
      });

      // Refresh the page after 2 seconds to show new images
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate images",
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
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Generate Realistic Food Images
            </CardTitle>
            <CardDescription>
              Click the button below to generate ultra-realistic AI images for featured recipes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Recipes to process:</h3>
              <ul className="text-sm space-y-1">
                {RECIPES_TO_REGENERATE.map((name, i) => (
                  <li key={i}>• {name}</li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={handleRegenerate} 
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Images... (This may take 3-5 minutes)
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate All Images Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
                        <p className="font-medium">{result.recipeName}</p>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegenerateImages;
