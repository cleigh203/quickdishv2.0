import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    console.log("Generating dessert recipes...");

    // Generate recipe data using Gemini
    const recipeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional recipe creator. Generate detailed, accurate dessert recipes."
          },
          {
            role: "user",
            content: `Generate 25 popular dessert recipes from around the world. For each recipe, provide:
- name: A descriptive name
- description: Brief description (under 100 chars)
- prepTime: Prep time in minutes (just the number)
- cookTime: Cook time in minutes (just the number)
- difficulty: easy, medium, or hard
- servings: Number of servings (number)
- cuisine: Type of cuisine (American, French, Italian, etc.)
- tags: Array including "dessert" and other relevant tags like "chocolate", "fruit", "baked", etc.
- ingredients: Array of objects with amount, unit, and item
- instructions: Array of step-by-step instructions

Return ONLY valid JSON array format, no markdown or extra text. Example format:
[{
  "name": "Chocolate Chip Cookies",
  "description": "Classic chewy cookies with chocolate chips",
  "prepTime": 15,
  "cookTime": 12,
  "difficulty": "easy",
  "servings": 24,
  "cuisine": "American",
  "tags": ["dessert", "cookies", "chocolate", "baked"],
  "ingredients": [
    {"amount": "2", "unit": "cups", "item": "flour"},
    {"amount": "1", "unit": "cup", "item": "butter"}
  ],
  "instructions": [
    "Preheat oven to 350°F",
    "Mix ingredients"
  ]
}]

Include popular desserts like: Tiramisu, Cheesecake, Brownies, Macarons, Crème Brûlée, Apple Pie, Chocolate Lava Cake, Pavlova, Baklava, Churros, etc.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!recipeResponse.ok) {
      const errorText = await recipeResponse.text();
      console.error("Recipe generation error:", errorText);
      throw new Error(`Recipe generation failed: ${recipeResponse.status}`);
    }

    const recipeData = await recipeResponse.json();
    const recipeText = recipeData.choices[0].message.content;
    
    // Parse the JSON response
    let recipes;
    try {
      // Remove markdown code blocks if present
      const cleanedText = recipeText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipes = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON parse error:", e);
      console.error("Received text:", recipeText);
      throw new Error("Failed to parse recipe JSON");
    }

    console.log(`Generated ${recipes.length} recipes, now generating images...`);

    // Generate images for each recipe
    const recipesWithImages = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      console.log(`Generating image ${i + 1}/25 for: ${recipe.name}`);

      try {
        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: `Generate a professional, appetizing photo of ${recipe.name}. The image should look like high-quality food photography with good lighting and composition. Make it look delicious and appealing.`
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          
          if (base64Image) {
            recipesWithImages.push({
              ...recipe,
              imageBase64: base64Image
            });
          } else {
            console.warn(`No image generated for ${recipe.name}, using placeholder`);
            recipesWithImages.push({
              ...recipe,
              imageBase64: null
            });
          }
        } else {
          console.warn(`Image generation failed for ${recipe.name}`);
          recipesWithImages.push({
            ...recipe,
            imageBase64: null
          });
        }

        // Small delay to avoid rate limits
        if (i < recipes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error generating image for ${recipe.name}:`, error);
        recipesWithImages.push({
          ...recipe,
          imageBase64: null
        });
      }
    }

    console.log("All recipes and images generated successfully");

    return new Response(JSON.stringify({ recipes: recipesWithImages }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-dessert-recipes:", error);
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
