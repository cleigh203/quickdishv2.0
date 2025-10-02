import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const dessertPrompts: Record<string, string> = {
  "Classic Tiramisu": "Layered Italian dessert in a clear glass dish showing distinct layers of coffee-soaked ladyfingers and creamy mascarpone cheese, topped with a generous dusting of dark cocoa powder, elegant presentation on white background",
  "New York Cheesecake": "Thick slice of dense, creamy New York style cheesecake with golden graham cracker crust, smooth pale yellow filling, on a white plate, professional food photography",
  "Fudgy Chocolate Brownies": "Stack of three rich, dark chocolate brownies with glossy, crackly tops and fudgy centers, cut into squares, showing dense moist texture, chocolate chips visible",
  "French Macarons": "Arranged display of colorful French macarons in pastel colors (pink, lavender, mint green), showing smooth domed shells with delicate ruffled feet, filled with buttercream",
  "Crème Brûlée": "White porcelain ramekin of crème brûlée with perfectly caramelized golden-brown sugar crust being cracked with a spoon, showing creamy vanilla custard underneath",
  "Classic Apple Pie": "Whole golden-brown apple pie with lattice crust top, showing cinnamon-spiced apple filling through gaps, rustic American dessert on wooden surface",
  "Chocolate Lava Cake": "Individual chocolate lava cake on white plate with molten dark chocolate center flowing out from the cut cake, dusted with powdered sugar",
  "Pavlova": "Large white crispy meringue base topped with billowy whipped cream and fresh mixed berries (strawberries, blueberries, raspberries), elegant dessert presentation",
  "Baklava": "Diamond-cut pieces of golden flaky baklava showing layers of phyllo pastry filled with chopped walnuts and pistachios, glistening with honey syrup",
  "Churros": "Pile of golden-brown fried churros coated in cinnamon sugar with ridged texture, served with cup of rich dark chocolate dipping sauce",
  "Panna Cotta": "Elegant white porcelain ramekin of silky Italian panna cotta topped with fresh berry compote (mixed berries in syrup), on white background",
  "Cannoli": "Three crispy golden cannoli shells filled with sweet creamy ricotta filling studded with mini chocolate chips, ends dipped in chopped pistachios, dusted with powdered sugar",
  "Bread Pudding": "Rustic baking dish of golden-brown bread pudding with custardy interior, raisins throughout, served warm with vanilla sauce drizzled on top",
  "Flan": "Classic caramel flan on white plate showing smooth golden custard with caramel sauce pooled around base, inverted from mold",
  "Chocolate Éclairs": "Row of French chocolate éclairs with glossy dark chocolate glaze on top, showing cream filling inside, elegant pastry on white surface",
  "Tres Leches Cake": "Slice of ultra-moist tres leches cake on white plate showing sponge cake soaked in three milks, topped with billowy whipped cream",
  "Cinnamon Rolls": "Large soft fluffy cinnamon roll with generous swirls of cinnamon sugar filling, topped with thick white cream cheese frosting dripping down sides",
  "Chocolate Chip Cookies": "Stack of thick chewy chocolate chip cookies with golden-brown edges and gooey chocolate chips, classic American cookies on white surface",
  "Carrot Cake": "Slice of moist spiced carrot cake with visible carrot shreds, layered with thick cream cheese frosting, garnished with walnut pieces",
  "Chocolate Mousse": "Clear glass filled with light airy French chocolate mousse, rich dark brown color, topped with whipped cream and chocolate shavings",
  "Profiteroles": "Stack of golden choux pastry cream puffs filled with vanilla ice cream, drizzled with warm dark chocolate sauce, elegant French dessert",
  "Red Velvet Cake": "Slice of vibrant red velvet cake showing bright red interior, layered with white cream cheese frosting, on white plate",
  "Key Lime Pie": "Slice of pale green key lime pie with graham cracker crust, topped with whipped cream, bright and tangy Florida dessert",
  "Bananas Foster": "Caramelized banana slices in rich brown butter rum sauce served over vanilla ice cream in white bowl, warm dessert presentation",
  "Lemon Bars": "Square lemon bars with bright yellow tangy lemon curd layer on golden shortbread crust, dusted with powdered sugar, on white surface"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { dessertName, index } = await req.json();

    console.log(`Generating image ${index} for: ${dessertName}`);

    // Use specific prompt if available, otherwise use generic prompt
    const specificPrompt = dessertPrompts[dessertName];
    const prompt = specificPrompt || `Professional food photography of ${dessertName}, beautifully plated on a white dish, studio lighting, high-end restaurant quality, appetizing, detailed, 4k quality`;

    console.log(`Using prompt: ${prompt}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", errorText);
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (response.status === 402) {
        throw new Error("Payment required. Please add credits to your workspace.");
      }
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      throw new Error("No image generated in response");
    }
    
    const base64Image = imageUrl;

    return new Response(
      JSON.stringify({ 
        imageBase64: base64Image,
        dessertName,
        index
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in generate-dessert-images:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
