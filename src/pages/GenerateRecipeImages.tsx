import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const RECIPES_TO_GENERATE = [
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
];

const GenerateRecipeImages = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const generateImages = async () => {
      try {
        toast({
          title: "Generating images...",
          description: `Processing ${RECIPES_TO_GENERATE.length} recipes with Gemini AI`,
        });

        const { data, error } = await supabase.functions.invoke('generate-gemini-recipe-images', {
          body: { recipeNames: RECIPES_TO_GENERATE }
        });

        if (error) throw error;

        setResults(data.results);
        
        const successCount = data.results.filter((r: any) => r.success).length;
        toast({
          title: "Complete!",
          description: `${successCount}/${RECIPES_TO_GENERATE.length} images generated successfully`,
        });

      } catch (error: any) {
        console.error('Generation error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate images",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    generateImages();
  }, [toast]);

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generating Recipe Images with Gemini AI</CardTitle>
            <CardDescription>
              Professional food photography for {RECIPES_TO_GENERATE.length} recipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-3">Generating images... This will take 2-3 minutes</span>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateRecipeImages;
