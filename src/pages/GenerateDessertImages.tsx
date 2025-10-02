import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/BottomNav";

const dessertRecipes = [
  "Classic Tiramisu",
  "New York Cheesecake",
  "Fudgy Chocolate Brownies",
  "French Macarons",
  "Crème Brûlée",
  "Classic Apple Pie",
  "Chocolate Lava Cake",
  "Pavlova",
  "Baklava",
  "Churros",
  "Panna Cotta",
  "Cannoli",
  "Bread Pudding",
  "Flan",
  "Chocolate Éclairs",
  "Tres Leches Cake",
  "Cinnamon Rolls",
  "Chocolate Chip Cookies",
  "Carrot Cake",
  "Chocolate Mousse",
  "Profiteroles",
  "Red Velvet Cake",
  "Key Lime Pie",
  "Bananas Foster",
  "Lemon Bars"
];

interface GeneratedImage {
  dessertName: string;
  imageBase64: string;
  filename: string;
}

const GenerateDessertImages = () => {
  const [generating, setGenerating] = useState(false);
  const [currentDessert, setCurrentDessert] = useState("");
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const generateImages = async () => {
    setGenerating(true);
    setGeneratedImages([]);
    setErrors([]);
    setProgress(0);

    for (let i = 0; i < dessertRecipes.length; i++) {
      const dessertName = dessertRecipes[i];
      setCurrentDessert(dessertName);
      setProgress(((i + 1) / dessertRecipes.length) * 100);

      try {
        console.log(`Generating image for: ${dessertName}`);
        
        const { data, error } = await supabase.functions.invoke('generate-dessert-images', {
          body: { dessertName, index: i }
        });

        if (error) throw error;

        if (data?.imageBase64) {
          const filename = `dessert-${dessertName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
          setGeneratedImages(prev => [...prev, {
            dessertName,
            imageBase64: data.imageBase64,
            filename
          }]);
          toast.success(`Generated: ${dessertName}`);
        }
      } catch (error: any) {
        console.error(`Error generating ${dessertName}:`, error);
        const errorMsg = `${dessertName}: ${error.message}`;
        setErrors(prev => [...prev, errorMsg]);
        toast.error(`Failed: ${dessertName}`);
      }

      // Wait 3 seconds between requests to avoid rate limiting
      if (i < dessertRecipes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setGenerating(false);
    setCurrentDessert("");
    toast.success("Image generation complete!");
  };

  const downloadImage = (imageBase64: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageBase64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    generatedImages.forEach(({ imageBase64, filename }) => {
      setTimeout(() => downloadImage(imageBase64, filename), 100);
    });
    toast.success("Downloading all images...");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Generate Dessert Images</h1>
          <p className="text-muted-foreground">
            Generate AI images for all 25 dessert recipes using Nano banana
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generation Control</CardTitle>
            <CardDescription>
              This will generate images for all {dessertRecipes.length} dessert recipes. 
              Each image takes ~3 seconds. Total time: ~{Math.ceil(dessertRecipes.length * 3 / 60)} minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateImages} 
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate All Images"
              )}
            </Button>

            {generating && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">
                  {currentDessert} ({Math.round(progress)}%)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {generatedImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Images ({generatedImages.length})</CardTitle>
              <CardDescription>
                Download these images and save them to src/assets/recipes/
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={downloadAll} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download All Images
              </Button>

              <div className="space-y-2">
                {generatedImages.map(({ dessertName, imageBase64, filename }) => (
                  <div key={dessertName} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-3">
                      <img 
                        src={imageBase64} 
                        alt={dessertName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{dessertName}</p>
                        <p className="text-xs text-muted-foreground">{filename}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage(imageBase64, filename)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {errors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Errors ({errors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive">{error}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Click "Generate All Images" above</li>
              <li>Wait for all images to generate (~{Math.ceil(dessertRecipes.length * 3 / 60)} minutes)</li>
              <li>Click "Download All Images" or download individually</li>
              <li>Manually save all images to <code className="bg-muted px-1 py-0.5 rounded">src/assets/recipes/</code></li>
              <li>Tell the AI to update recipe imports in recipes.ts</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default GenerateDessertImages;
