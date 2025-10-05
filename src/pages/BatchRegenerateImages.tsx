import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export default function BatchRegenerateImages() {
  const [recipeNames, setRecipeNames] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleRegenerate = async () => {
    const names = recipeNames
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      toast.error('Please enter at least one recipe name');
      return;
    }

    setIsProcessing(true);
    toast.info(`Processing ${names.length} recipes... This may take a few minutes.`);

    try {
      const { data, error } = await supabase.functions.invoke('batch-regenerate-images', {
        body: { recipeNames: names }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setResults(data.results || []);
      
      const successful = data.results?.filter((r: any) => r.success).length || 0;
      const failed = data.results?.filter((r: any) => !r.success).length || 0;

      toast.success(`Completed! ${successful} successful, ${failed} failed`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Batch Regenerate Recipe Images</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Recipe Names (one per line)
          </label>
          <Textarea
            value={recipeNames}
            onChange={(e) => setRecipeNames(e.target.value)}
            placeholder="Red Lobster Cheddar Bay Biscuits&#10;Texas Roadhouse Rolls&#10;Outback Bloomin' Onion"
            className="min-h-[200px]"
            disabled={isProcessing}
          />
        </div>

        <Button 
          onClick={handleRegenerate}
          disabled={isProcessing}
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Processing...' : 'Regenerate Images'}
        </Button>

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <div className="font-medium">{result.recipeName}</div>
                  <div className="text-sm">
                    {result.success ? result.message : `Error: ${result.error}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
