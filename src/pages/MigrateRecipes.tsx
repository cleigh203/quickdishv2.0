import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { allRecipes } from "@/data/recipes";

const MigrateRecipes = () => {
  const [recipeNames, setRecipeNames] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleMigrate = async () => {
    if (!recipeNames.trim()) {
      toast({
        title: "Error",
        description: "Please enter recipe names",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const names = recipeNames.split('\n').map(n => n.trim()).filter(n => n);
      
      // Find recipes in static data
      const recipesToMigrate = names.map(name => {
        const recipe = allRecipes.find(r => 
          r.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(r.name.toLowerCase())
        );
        return recipe;
      }).filter(r => r !== undefined);

      if (recipesToMigrate.length === 0) {
        toast({
          title: "No recipes found",
          description: "Could not find any matching recipes in the static data",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Processing...",
        description: `Found ${recipesToMigrate.length} recipes to migrate. This will take several minutes.`,
      });

      const { data, error } = await supabase.functions.invoke('migrate-static-recipes', {
        body: { recipes: recipesToMigrate }
      });

      if (error) throw error;

      setResults(data.results);
      
      toast({
        title: "Migration complete",
        description: `Successfully processed ${data.successCount} of ${data.totalProcessed} recipes`,
      });

    } catch (error: any) {
      console.error('Migration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to migrate recipes",
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
            <CardTitle>Migrate Static Recipes to Database</CardTitle>
            <CardDescription>
              Enter recipe names (one per line) to migrate them from static data to the database with ultra-realistic AI-generated images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Red Lobster Cheddar Bay Biscuits
Texas Roadhouse Rolls
Outback Bloomin Onion
..."
              value={recipeNames}
              onChange={(e) => setRecipeNames(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleMigrate} 
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Migrating Recipes... (This may take several minutes)
                </>
              ) : (
                "Migrate Recipes with Ultra-Realistic Images"
              )}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Migration Results</CardTitle>
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

export default MigrateRecipes;