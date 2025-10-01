// OpenAI API service - promises created outside component scope
// This prevents v7_startTransition compatibility issues

export interface RecipeGenerationParams {
  ingredientInput: string;
  apiKey: string;
}

export interface ImageGenerationParams {
  recipeName: string;
  apiKey: string;
}

export const generateRecipeText = async ({ ingredientInput, apiKey }: RecipeGenerationParams): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly home cook sharing recipes like texting a friend. Use casual language like "toss in", "a splash of", "until it smells amazing". Add personality like "my kids devour this" or "perfect for lazy Sundays". Never sound robotic or use AI terminology.'
        },
        {
          role: 'user',
          content: `Create a delicious recipe using: ${ingredientInput}.
          
          Format exactly like this:
          Title: [Fun, appetizing name - not generic but not silly]
          Prep Time: [X] minutes
          Cook Time: [Y] minutes
          
          Ingredients:
          - [amount] [ingredient]
          
          Instructions:
          1. [Casual step like "Grab your biggest pan and heat it up"]
          2. [Include measurements inline like "Toss in [2 cups rice]"]
          
          Nutrition (per serving, estimated):
          Calories: [number]
          Protein: [number]g
          Carbs: [number]g
          Fat: [number]g`
        }
      ],
      max_tokens: 500,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate recipe');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateRecipeImage = async ({ recipeName, apiKey }: ImageGenerationParams): Promise<string | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-2',
        prompt: `${recipeName}, professional food photography, delicious, appetizing, well-plated, natural lighting, high quality`,
        size: '512x512',
        n: 1
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.data[0].url;
    }
    
    console.error('DALL-E generation failed');
    return null;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
};
