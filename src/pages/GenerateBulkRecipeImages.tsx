import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Recipe definitions for image generation
const recipesToGenerate = [
  // DESSERTS (20)
  { name: "Chocolate Soufflé", description: "Light and airy French chocolate dessert", filename: "dessert-chocolate-souffle.jpg" },
  { name: "Strawberry Shortcake", description: "Classic American dessert with fresh strawberries and whipped cream", filename: "dessert-strawberry-shortcake.jpg" },
  { name: "Crème Caramel", description: "Silky custard with caramel sauce", filename: "dessert-creme-caramel.jpg" },
  { name: "Chocolate Chip Cookie Dough Brownies", description: "Fudgy brownies topped with edible cookie dough", filename: "dessert-cookie-dough-brownies.jpg" },
  { name: "Raspberry Tart", description: "Buttery tart shell filled with pastry cream and fresh raspberries", filename: "dessert-raspberry-tart.jpg" },
  { name: "Chocolate Mousse Cake", description: "Rich chocolate cake with airy mousse layers", filename: "dessert-chocolate-mousse-cake.jpg" },
  { name: "Lemon Meringue Pie", description: "Tangy lemon curd topped with fluffy meringue", filename: "dessert-lemon-meringue-pie.jpg" },
  { name: "Boston Cream Pie", description: "Vanilla cake with custard filling and chocolate glaze", filename: "dessert-boston-cream-pie.jpg" },
  { name: "Peach Cobbler", description: "Warm peaches topped with buttery biscuit crust", filename: "dessert-peach-cobbler.jpg" },
  { name: "Chocolate Truffles", description: "Rich ganache rolled in cocoa powder", filename: "dessert-chocolate-truffles.jpg" },
  { name: "Biscotti", description: "Twice-baked Italian almond cookies", filename: "dessert-biscotti.jpg" },
  { name: "Pumpkin Cheesecake", description: "Creamy pumpkin spice cheesecake with graham crust", filename: "dessert-pumpkin-cheesecake.jpg" },
  { name: "Chocolate Chip Banana Bread", description: "Moist banana bread studded with chocolate chips", filename: "dessert-banana-bread-chocolate.jpg" },
  { name: "Salted Caramel Tart", description: "Buttery tart with rich salted caramel filling", filename: "dessert-salted-caramel-tart.jpg" },
  { name: "Sticky Toffee Pudding", description: "Warm date cake with toffee sauce", filename: "dessert-sticky-toffee-pudding.jpg" },
  { name: "Opera Cake", description: "Elegant French almond sponge with coffee buttercream", filename: "dessert-opera-cake.jpg" },
  { name: "Chocolate Fondue", description: "Rich melted chocolate for dipping fruits and treats", filename: "dessert-chocolate-fondue.jpg" },
  { name: "Raspberry White Chocolate Cheesecake", description: "Creamy white chocolate cheesecake swirled with raspberry", filename: "dessert-raspberry-white-chocolate-cheesecake.jpg" },
  { name: "S'mores Bars", description: "Graham cracker base with chocolate and toasted marshmallow", filename: "dessert-smores-bars.jpg" },
  { name: "Coconut Cream Pie", description: "Creamy coconut custard in flaky crust topped with whipped cream", filename: "dessert-coconut-cream-pie.jpg" },

  // LUNCH (20)
  { name: "Mediterranean Quinoa Bowl", description: "Healthy quinoa with feta, olives, cucumbers, and hummus", filename: "lunch-mediterranean-quinoa-bowl.jpg" },
  { name: "Buffalo Chicken Wrap", description: "Crispy buffalo chicken in a tortilla with ranch and lettuce", filename: "lunch-buffalo-chicken-wrap.jpg" },
  { name: "Greek Salad with Grilled Chicken", description: "Fresh vegetables, feta, olives, and grilled chicken", filename: "lunch-greek-salad-chicken.jpg" },
  { name: "Turkey Avocado Club", description: "Triple-decker sandwich with turkey, bacon, and avocado", filename: "lunch-turkey-avocado-club.jpg" },
  { name: "Asian Chicken Lettuce Wraps", description: "Seasoned ground chicken in crisp lettuce cups", filename: "lunch-asian-lettuce-wraps.jpg" },
  { name: "Caprese Panini", description: "Grilled sandwich with mozzarella, tomato, and basil pesto", filename: "lunch-caprese-panini.jpg" },
  { name: "Tuna Nicoise Salad", description: "French salad with tuna, potatoes, green beans, and eggs", filename: "lunch-tuna-nicoise-salad.jpg" },
  { name: "California Roll Bowl", description: "Deconstructed sushi bowl with crab, avocado, and cucumber", filename: "lunch-california-roll-bowl.jpg" },
  { name: "BBQ Pulled Pork Sandwich", description: "Slow-cooked pulled pork with coleslaw on brioche bun", filename: "lunch-bbq-pulled-pork-sandwich.jpg" },
  { name: "Falafel Pita", description: "Crispy falafel in pita with tahini and vegetables", filename: "lunch-falafel-pita.jpg" },
  { name: "Chicken Caesar Salad", description: "Classic Caesar with grilled chicken and parmesan", filename: "lunch-chicken-caesar-salad.jpg" },
  { name: "Banh Mi Sandwich", description: "Vietnamese sandwich with pork, pickled vegetables, and cilantro", filename: "lunch-banh-mi-sandwich.jpg" },
  { name: "Southwest Chicken Bowl", description: "Rice bowl with chicken, black beans, corn, and avocado", filename: "lunch-southwest-chicken-bowl.jpg" },
  { name: "Margherita Flatbread", description: "Thin crust flatbread with fresh mozzarella and basil", filename: "lunch-margherita-flatbread.jpg" },
  { name: "Cobb Salad", description: "Chopped salad with chicken, bacon, egg, and blue cheese", filename: "lunch-cobb-salad.jpg" },
  { name: "Pesto Pasta Salad", description: "Cold pasta with pesto, mozzarella, and cherry tomatoes", filename: "lunch-pesto-pasta-salad.jpg" },
  { name: "Korean BBQ Beef Bowl", description: "Rice bowl with marinated beef, kimchi, and vegetables", filename: "lunch-korean-bbq-beef-bowl.jpg" },
  { name: "Shrimp Po' Boy", description: "Fried shrimp sandwich with remoulade and lettuce", filename: "lunch-shrimp-po-boy.jpg" },
  { name: "Chicken Shawarma Wrap", description: "Spiced chicken with tahini in warm flatbread", filename: "lunch-chicken-shawarma-wrap.jpg" },
  { name: "Tomato Basil Soup with Grilled Cheese", description: "Creamy tomato soup paired with crispy grilled cheese", filename: "lunch-tomato-soup-grilled-cheese.jpg" },

  // ONE POT WONDERS (20)
  { name: "Chicken and Dumplings", description: "Comforting stew with tender chicken and fluffy dumplings", filename: "one-pot-chicken-dumplings.jpg" },
  { name: "Beef Bourguignon", description: "French braised beef in red wine with mushrooms", filename: "one-pot-beef-bourguignon.jpg" },
  { name: "Jambalaya", description: "Spicy Louisiana rice with chicken, sausage, and shrimp", filename: "one-pot-jambalaya.jpg" },
  { name: "Creamy Tuscan Chicken", description: "Chicken in sun-dried tomato cream sauce with spinach", filename: "one-pot-creamy-tuscan-chicken.jpg" },
  { name: "Chili Con Carne", description: "Hearty beef chili with beans and spices", filename: "one-pot-chili-con-carne.jpg" },
  { name: "Seafood Paella", description: "Spanish rice with shrimp, mussels, and saffron", filename: "one-pot-seafood-paella.jpg" },
  { name: "Chicken Cacciatore", description: "Italian braised chicken with tomatoes and peppers", filename: "one-pot-chicken-cacciatore.jpg" },
  { name: "Moroccan Tagine", description: "Slow-cooked lamb with apricots and warm spices", filename: "one-pot-moroccan-tagine.jpg" },
  { name: "Tuscan White Bean Soup", description: "Creamy soup with white beans, kale, and Italian sausage", filename: "one-pot-tuscan-white-bean-soup.jpg" },
  { name: "Chicken Tikka Masala", description: "Creamy Indian curry with tender chicken pieces", filename: "one-pot-chicken-tikka-masala.jpg" },
  { name: "Pot Roast", description: "Classic braised beef with carrots and potatoes", filename: "one-pot-pot-roast.jpg" },
  { name: "Creamy Cajun Pasta", description: "Spicy pasta with chicken, sausage, and peppers", filename: "one-pot-creamy-cajun-pasta.jpg" },
  { name: "Irish Stew", description: "Lamb stew with potatoes, carrots, and herbs", filename: "one-pot-irish-stew.jpg" },
  { name: "Chicken and Rice", description: "Classic one-pot meal with tender chicken and seasoned rice", filename: "one-pot-chicken-rice.jpg" },
  { name: "Shakshuka", description: "Eggs poached in spiced tomato sauce", filename: "one-pot-shakshuka.jpg" },
  { name: "Sausage and Lentil Stew", description: "Hearty stew with sausage, lentils, and vegetables", filename: "one-pot-sausage-lentil-stew.jpg" },
  { name: "Chicken Tortilla Soup", description: "Mexican soup with chicken, tortillas, and lime", filename: "one-pot-chicken-tortilla-soup.jpg" },
  { name: "Beef Stroganoff", description: "Tender beef in creamy mushroom sauce over noodles", filename: "one-pot-beef-stroganoff.jpg" },
  { name: "Ratatouille", description: "French vegetable stew with eggplant, zucchini, and tomatoes", filename: "one-pot-ratatouille.jpg" },
  { name: "Chicken Paprikash", description: "Hungarian chicken in creamy paprika sauce", filename: "one-pot-chicken-paprikash.jpg" },

  // BREAKFAST (20)
  { name: "Belgian Waffles", description: "Crispy waffles with whipped cream and berries", filename: "breakfast-belgian-waffles.jpg" },
  { name: "Eggs Benedict", description: "Poached eggs with hollandaise on English muffins", filename: "breakfast-eggs-benedict.jpg" },
  { name: "Breakfast Burrito", description: "Scrambled eggs, cheese, and bacon in a tortilla", filename: "breakfast-burrito.jpg" },
  { name: "French Toast", description: "Thick-cut bread soaked in custard and griddled", filename: "breakfast-french-toast.jpg" },
  { name: "Shakshuka", description: "Eggs poached in spiced tomato sauce with feta", filename: "breakfast-shakshuka.jpg" },
  { name: "Avocado Toast", description: "Smashed avocado on sourdough with everything seasoning", filename: "breakfast-avocado-toast.jpg" },
  { name: "Huevos Rancheros", description: "Fried eggs on tortillas with salsa and beans", filename: "breakfast-huevos-rancheros.jpg" },
  { name: "Blueberry Pancakes", description: "Fluffy pancakes studded with fresh blueberries", filename: "breakfast-blueberry-pancakes.jpg" },
  { name: "Breakfast Pizza", description: "Pizza crust topped with eggs, bacon, and cheese", filename: "breakfast-pizza.jpg" },
  { name: "Smoked Salmon Bagel", description: "Toasted bagel with cream cheese, lox, and capers", filename: "breakfast-smoked-salmon-bagel.jpg" },
  { name: "Acai Bowl", description: "Acai smoothie bowl topped with granola and fruit", filename: "breakfast-acai-bowl.jpg" },
  { name: "Breakfast Quesadilla", description: "Scrambled eggs and cheese in crispy tortilla", filename: "breakfast-quesadilla.jpg" },
  { name: "Biscuits and Gravy", description: "Fluffy biscuits smothered in sausage gravy", filename: "breakfast-biscuits-gravy.jpg" },
  { name: "Croque Madame", description: "French ham and cheese sandwich topped with fried egg", filename: "breakfast-croque-madame.jpg" },
  { name: "Breakfast Tacos", description: "Soft tacos filled with scrambled eggs and chorizo", filename: "breakfast-tacos.jpg" },
  { name: "Chilaquiles", description: "Fried tortilla chips in salsa topped with eggs", filename: "breakfast-chilaquiles.jpg" },
  { name: "Banana Nut Oatmeal", description: "Creamy oats with bananas, walnuts, and honey", filename: "breakfast-banana-nut-oatmeal.jpg" },
  { name: "Full English Breakfast", description: "Eggs, bacon, sausage, beans, toast, and tomatoes", filename: "breakfast-full-english.jpg" },
  { name: "Breakfast Sausage Casserole", description: "Layered casserole with eggs, sausage, and cheese", filename: "breakfast-sausage-casserole.jpg" },
  { name: "Greek Yogurt Parfait", description: "Layers of yogurt, granola, honey, and berries", filename: "breakfast-greek-yogurt-parfait.jpg" },

  // RESTAURANT COPYCATS (20)
  { name: "Chick-fil-A Chicken Sandwich", description: "Crispy chicken breast on buttered bun with pickles", filename: "copycat-chick-fil-a-sandwich.jpg" },
  { name: "Chipotle Burrito Bowl", description: "Rice bowl with chicken, beans, fajita veggies, and guac", filename: "copycat-chipotle-burrito-bowl.jpg" },
  { name: "Olive Garden Breadsticks", description: "Soft garlic butter breadsticks", filename: "copycat-olive-garden-breadsticks.jpg" },
  { name: "Panera Broccoli Cheddar Soup", description: "Creamy soup with broccoli and sharp cheddar", filename: "copycat-panera-broccoli-soup.jpg" },
  { name: "Red Lobster Biscuits", description: "Cheesy garlic butter biscuits", filename: "copycat-red-lobster-biscuits.jpg" },
  { name: "Cracker Barrel Hashbrown Casserole", description: "Cheesy hashbrown casserole with sour cream", filename: "copycat-cracker-barrel-hashbrowns.jpg" },
  { name: "Texas Roadhouse Butter", description: "Whipped cinnamon honey butter", filename: "copycat-texas-roadhouse-butter.jpg" },
  { name: "PF Chang's Lettuce Wraps", description: "Ground chicken with water chestnuts in lettuce cups", filename: "copycat-pf-changs-wraps.jpg" },
  { name: "Cheesecake Factory Avocado Egg Rolls", description: "Crispy rolls filled with avocado and sun-dried tomatoes", filename: "copycat-cheesecake-factory-avocado-rolls.jpg" },
  { name: "KFC Coleslaw", description: "Creamy sweet and tangy coleslaw", filename: "copycat-kfc-coleslaw.jpg" },
  { name: "Subway Meatball Sub", description: "Italian meatballs in marinara with melted cheese", filename: "copycat-subway-meatball-sub.jpg" },
  { name: "Starbucks Egg Bites", description: "Sous vide egg bites with cheese and vegetables", filename: "copycat-starbucks-egg-bites.jpg" },
  { name: "Wendy's Chili", description: "Hearty beef and bean chili", filename: "copycat-wendys-chili.jpg" },
  { name: "McDonald's McGriddles", description: "Pancake sandwich with sausage, egg, and cheese", filename: "copycat-mcdonalds-mcgriddles.jpg" },
  { name: "Pizza Hut Pan Pizza", description: "Thick crust pizza with cheese and pepperoni", filename: "copycat-pizza-hut-pan.jpg" },
  { name: "Applebee's Oriental Chicken Salad", description: "Asian-inspired salad with crispy chicken", filename: "copycat-applebees-oriental-salad.jpg" },
  { name: "Cinnabon Cinnamon Rolls", description: "Giant cinnamon rolls with cream cheese frosting", filename: "copycat-cinnabon-rolls.jpg" },
  { name: "Panda Express Orange Chicken", description: "Crispy chicken in sweet and tangy orange sauce", filename: "copycat-panda-orange-chicken.jpg" },
  { name: "Chili's Molten Chocolate Cake", description: "Warm chocolate cake with molten center and ice cream", filename: "copycat-chilis-molten-cake.jpg" },
  { name: "Outback Bloomin' Onion", description: "Fried onion blossom with spicy dipping sauce", filename: "copycat-outback-bloomin-onion.jpg" },
];

export default function GenerateBulkRecipeImages() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);

  const handleGenerateImages = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);

    try {
      // Generate in smaller batches to avoid timeouts
      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < recipesToGenerate.length; i += batchSize) {
        batches.push(recipesToGenerate.slice(i, i + batchSize));
      }

      let allImages: any[] = [];

      for (let i = 0; i < batches.length; i++) {
        toast.info(`Generating batch ${i + 1} of ${batches.length}...`);
        
        const { data, error } = await supabase.functions.invoke('generate-bulk-recipe-images', {
          body: { recipes: batches[i] }
        });

        if (error) throw error;

        if (data?.images) {
          allImages = [...allImages, ...data.images];
          setGeneratedImages(allImages);
        }

        setProgress(((i + 1) / batches.length) * 100);
      }

      toast.success(`Generated ${allImages.length} images successfully!`);
      
      // Trigger downloads
      allImages.forEach((img, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = img.image;
          link.download = img.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, index * 100);
      });

    } catch (error: any) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-4">Generate Recipe Images</h1>
        <p className="text-muted-foreground mb-6">
          Generate {recipesToGenerate.length} high-quality recipe images using Lovable AI
        </p>

        <div className="space-y-4">
          <Button 
            onClick={handleGenerateImages} 
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating... {Math.round(progress)}%
              </>
            ) : (
              'Generate All Images'
            )}
          </Button>

          {generatedImages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Generated {generatedImages.length} images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {generatedImages.map((img, index) => (
                  <div key={index} className="space-y-2">
                    <img 
                      src={img.image} 
                      alt={img.name}
                      className="w-full h-32 object-cover rounded"
                    />
                    <p className="text-xs truncate">{img.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
