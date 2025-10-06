import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateImagesForRecipes, RECIPE_IDS_TO_UPDATE } from "@/utils/generateRecipeImages";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const ExecuteImageGeneration = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const execute = async () => {
      try {
        toast({
          title: "Generating professional food images",
          description: `Processing ${RECIPE_IDS_TO_UPDATE.length} recipes with Gemini AI`,
        });

        const data = await generateImagesForRecipes(RECIPE_IDS_TO_UPDATE);
        
        setResults(data.results);
        
        toast({
          title: "✅ Generation complete!",
          description: data.completed + " recipes updated with AI images",
        });

      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error generating images",
          description: error.message || "Failed to generate images",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    execute();
  }, [toast]);

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Image Generation in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <div className="text-center">
                  <p className="font-medium">Generating professional food photography...</p>
                  <p className="text-sm text-muted-foreground mt-1">This will take 2-3 minutes</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.name || result.recipeId}</p>
                      {result.error && (
                        <p className="text-sm text-red-500">{result.error}</p>
                      )}
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

export default ExecuteImageGeneration;
