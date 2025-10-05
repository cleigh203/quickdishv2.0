import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function GenerateNewRecipeImages() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const recipes = [
    { name: "Chicken and Dumplings", description: "Tender chicken with fluffy dumplings in rich broth", filename: "one-pot-chicken-dumplings.jpg" },
    { name: "Beef Bourguignon", description: "Classic French beef stew with red wine and vegetables", filename: "one-pot-beef-bourguignon.jpg" },
    { name: "Jambalaya", description: "Spicy Creole rice dish with sausage, chicken and shrimp", filename: "one-pot-jambalaya.jpg" },
    { name: "Chicken Tortilla Soup", description: "Mexican-inspired soup with tortilla strips and avocado", filename: "one-pot-chicken-tortilla-soup.jpg" },
    { name: "Vegetable Curry", description: "Indian-spiced vegetable curry with coconut milk", filename: "one-pot-vegetable-curry.jpg" },
    { name: "Beef Stroganoff", description: "Creamy beef and mushroom pasta in sour cream sauce", filename: "one-pot-beef-stroganoff.jpg" },
    { name: "Minestrone Soup", description: "Italian vegetable soup with beans and pasta", filename: "one-pot-minestrone.jpg" },
    { name: "Seafood Paella", description: "Spanish rice with mixed seafood and saffron", filename: "one-pot-seafood-paella.jpg" },
    { name: "Chili Con Carne", description: "Hearty beef chili with beans and spices", filename: "one-pot-chili-con-carne.jpg" },
    { name: "Moroccan Tagine", description: "North African stew with lamb and dried fruits", filename: "one-pot-moroccan-tagine.jpg" },
    { name: "Chicken Cacciatore", description: "Italian chicken braised with tomatoes and herbs", filename: "one-pot-chicken-cacciatore.jpg" },
    { name: "Thai Red Curry", description: "Spicy Thai curry with vegetables and coconut milk", filename: "one-pot-thai-red-curry.jpg" },
    { name: "Shepherd's Pie", description: "Ground lamb with vegetables topped with mashed potatoes", filename: "one-pot-shepherds-pie.jpg" },
    { name: "Gumbo", description: "Louisiana stew with okra, sausage and seafood", filename: "one-pot-gumbo.jpg" },
    { name: "Baked Ziti", description: "Italian pasta bake with ricotta and mozzarella", filename: "one-pot-baked-ziti.jpg" },
    { name: "Chicken and Rice", description: "One-pot meal with seasoned chicken and fluffy rice", filename: "one-pot-chicken-rice.jpg" },
    { name: "Pork Carnitas", description: "Mexican slow-cooked shredded pork with citrus", filename: "one-pot-pork-carnitas.jpg" },
    { name: "Ratatouille", description: "French vegetable stew with eggplant and zucchini", filename: "one-pot-ratatouille.jpg" },
    { name: "Chicken Biryani", description: "Aromatic Indian rice dish with spiced chicken", filename: "one-pot-chicken-biryani.jpg" },
    { name: "Stuffed Pepper Casserole", description: "Deconstructed stuffed peppers in tomato sauce", filename: "one-pot-stuffed-pepper-casserole.jpg" }
  ];

  const generateBatch = async (batch: any[]) => {
    for (const recipe of batch) {
      const { data } = await supabase.functions.invoke('generate-bulk-recipe-images', {
        body: { recipes: [recipe] }
      });
      console.log('Generated:', recipe.name, data);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const batches = [];
    for (let i = 0; i < recipes.length; i += 5) {
      batches.push(recipes.slice(i, i + 5));
    }

    for (let i = 0; i < batches.length; i++) {
      await generateBatch(batches[i]);
      setProgress(((i + 1) / batches.length) * 100);
    }

    setGenerating(false);
    toast.success('All images generated!');
  };

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-4">Generate Recipe Images</h1>
      <Button onClick={handleGenerate} disabled={generating}>
        {generating ? `Generating... ${Math.round(progress)}%` : 'Generate All Images'}
      </Button>
    </div>
  );
}
