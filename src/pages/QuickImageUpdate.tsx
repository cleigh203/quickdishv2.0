import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const QuickImageUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // Direct database updates with the new image paths
      const updates = [
        { id: 'copycat-mcdonald-s-egg-mcmuffin', path: '/src/assets/recipes/egg-mcmuffin-new.jpg' },
        { id: 'copycat-olive-garden-house-salad-with-dressing', path: '/src/assets/recipes/olive-garden-salad-new.jpg' },
        { id: 'copycat-panera-chipotle-chicken-avocado-melt', path: '/src/assets/recipes/panera-sandwich-new.jpg' },
        { id: 'copycat-olive-garden-5-cheese-ziti', path: '/src/assets/recipes/ziti-alforno-new.jpg' }
      ];

      let successCount = 0;
      for (const update of updates) {
        const { error } = await supabase
          .from('recipes')
          .update({ image_url: update.path })
          .eq('recipe_id', update.id);
        
        if (!error) successCount++;
      }

      toast({
        title: "Success!",
        description: `Updated ${successCount}/${updates.length} images successfully`,
      });

      setTimeout(() => {
        window.location.href = '/discover?collection=Restaurant%20Copycats';
      }, 1500);

    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update images",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update Recipe Images</CardTitle>
          <CardDescription>
            Click the button below to update 4 copycat recipe images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full"
            size="lg"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Images Now'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickImageUpdate;
