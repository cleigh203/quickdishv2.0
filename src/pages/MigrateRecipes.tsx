import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useRecipes } from "@/contexts/RecipesContext";

const MigrateRecipes = () => {
  const [recipeNames, setRecipeNames] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();
  const { recipes: allRecipes } = useRecipes();

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
      
      console.log(`📋 Total names to match: ${names.length}`);
      console.log(`📚 Total recipes in allRecipes: ${allRecipes.length}`);
      console.log(`🔍 First few names:`, names.slice(0, 5));
      console.log(`🔍 First few recipe names:`, allRecipes.slice(0, 5).map(r => r.name));
      
      // Find recipes in static data (exact match by name)
      const recipesToMigrate = names.map(name => {
        const recipe = allRecipes.find(r => 
          r.name.toLowerCase() === name.toLowerCase()
        );
        if (!recipe) {
          console.log(`❌ Not found: "${name}"`);
        }
        return recipe;
      }).filter(r => r !== undefined);

      console.log(`✅ Found ${recipesToMigrate.length} matching recipes`);

      if (recipesToMigrate.length === 0) {
        toast({
          title: "No recipes found",
          description: `Could not find any matching recipes. Found ${allRecipes.length} total recipes. Check console for details.`,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Processing...",
        description: `Found ${recipesToMigrate.length} recipes to migrate directly to database.`,
      });

      const migrationResults = [];

      // Helper: normalize image to absolute URL and avoid placeholders
      const toAbsoluteImageUrl = (img?: string) => {
        if (!img) return null;
        // Already absolute (http/https/data)
        if (/^(https?:)?\/\//i.test(img) || img.startsWith('data:')) return img;
        // Vite dev origin for local assets and public files
        const origin = window.location.origin;
        // Ensure it starts with a single leading slash
        const path = img.startsWith('/') ? img : `/${img}`;
        return `${origin}${path}`;
      };

      // Migrate recipes one by one
      for (const recipe of recipesToMigrate) {
        try {
          console.log(`Migrating: ${recipe.name}`);

          // Check if recipe already exists
          const { data: existingRecipes } = await supabase
            .from('recipes')
            .select('recipe_id')
            .eq('recipe_id', recipe.id)
            .limit(1);

          const absoluteImage = toAbsoluteImageUrl(recipe.image) || toAbsoluteImageUrl(recipe.imageUrl);

          const recipeData = {
            recipe_id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            cook_time: recipe.cookTime,
            prep_time: recipe.prepTime,
            difficulty: recipe.difficulty,
            servings: recipe.servings,
            ingredients: recipe.ingredients as any,
            instructions: recipe.instructions as any,
            cuisine: recipe.cuisine,
            // Preserve existing images; do NOT use placeholders
            image_url: absoluteImage,
            nutrition: recipe.nutrition as any || null,
            tags: recipe.tags || [],
            category: recipe.tags?.includes('copycat') ? 'Restaurant Copycats' : 
                      recipe.tags?.includes('dessert') ? 'Desserts' : 
                      recipe.tags?.includes('breakfast') ? 'Breakfast' : 
                      recipe.tags?.includes('lunch') ? 'Lunch' : 
                      'Dinner',
            verified: true,
            ai_generated: false,
            source: 'curated'
          };

          if (existingRecipes && existingRecipes.length > 0) {
            // Update existing recipe (exclude recipe_id from update)
            const { recipe_id, ...updateData } = recipeData;
            // Do not overwrite existing DB image with null/undefined
            if (!absoluteImage) {
              delete (updateData as any).image_url;
            }
            const { error: updateError } = await supabase
              .from('recipes')
              .update(updateData)
              .eq('recipe_id', recipe.id);

            if (updateError) throw updateError;

            migrationResults.push({
              recipeName: recipe.name,
              success: true,
              message: 'Recipe updated successfully'
            });
          } else {
            // Insert new recipe (let database generate id)
            const insertPayload = { ...recipeData } as any;
            if (!absoluteImage) {
              delete insertPayload.image_url;
            }
            const { error: insertError } = await supabase
              .from('recipes')
              .insert([insertPayload]);

            if (insertError) throw insertError;

            migrationResults.push({
              recipeName: recipe.name,
              success: true,
              message: 'Recipe inserted successfully'
            });
          }

          console.log(`✅ ${recipe.name}`);

          // Update results incrementally
          setResults([...migrationResults]);

        } catch (error: any) {
          console.error(`❌ Error migrating ${recipe.name}:`, error);
          migrationResults.push({
            recipeName: recipe.name,
            success: false,
            error: error.message || 'Unknown error'
          });
          setResults([...migrationResults]);
        }

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const successCount = migrationResults.filter(r => r.success).length;
      
      toast({
        title: "Migration complete!",
        description: `Successfully processed ${successCount} of ${migrationResults.length} recipes`,
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
              Enter recipe names (one per line) to migrate them from static data to the database with their existing images and nutrition data
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
                  Migrating Recipes... ({results.length} processed)
                </>
              ) : (
                "Migrate Recipes to Database"
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