import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { getRecipeImage } from "@/utils/recipeImages";
import { Recipe } from "@/types/recipe";

const Generate = () => {
  const [activeCategory, setActiveCategory] = useState('20min');
  const [ingredientInput, setIngredientInput] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipesGeneratedToday, setRecipesGeneratedToday] = useState(() => {
    const count = parseInt(localStorage.getItem('recipesGenerated') || '0');
    return count;
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isPremium] = useState(() => {
    return localStorage.getItem('premiumUser') === 'true';
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Full Recipe collections with complete data
  const discoverRecipes: Recipe[] = [
    { id: 'discover-1', name: 'Garlic Shrimp Pasta', description: 'Quick and flavorful pasta with succulent shrimp', prepTime: '5 minutes', cookTime: '10 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Italian', image: 'https://images.pexels.com/photos/3843224/pexels-photo-3843224.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: 'lb', item: 'shrimp, peeled'}, {amount: '12', unit: 'oz', item: 'linguine'}, {amount: '6', unit: 'cloves', item: 'garlic, minced'}, {amount: '1/4', unit: 'cup', item: 'olive oil'}, {amount: '1/2', unit: 'tsp', item: 'red pepper flakes'}, {amount: '1/4', unit: 'cup', item: 'fresh parsley, chopped'}], instructions: ['1. Boil [12 oz linguine] according to package directions', '2. Heat [1/4 cup olive oil] in a large pan over medium heat', '3. Add [6 cloves minced garlic] and [1/2 tsp red pepper flakes], cook 30 seconds', '4. Add [1 lb shrimp], cook 2-3 minutes per side until pink', '5. Toss cooked pasta with shrimp, garnish with [1/4 cup parsley]'], nutrition: {calories: 420, protein: 32, carbs: 48, fat: 14}},
    { id: 'discover-2', name: 'Chicken Stir Fry', description: 'Colorful veggie-packed chicken stir fry', prepTime: '10 minutes', cookTime: '8 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Asian', image: 'https://images.pexels.com/photos/2994900/pexels-photo-2994900.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1.5', unit: 'lbs', item: 'chicken breast, sliced'}, {amount: '2', unit: 'cups', item: 'mixed bell peppers'}, {amount: '1', unit: 'cup', item: 'broccoli florets'}, {amount: '3', unit: 'tbsp', item: 'soy sauce'}, {amount: '2', unit: 'tbsp', item: 'sesame oil'}, {amount: '1', unit: 'tbsp', item: 'ginger, minced'}], instructions: ['1. Heat [2 tbsp sesame oil] in a wok over high heat', '2. Add [1.5 lbs sliced chicken], stir-fry 5 minutes', '3. Add [2 cups bell peppers] and [1 cup broccoli], cook 3 minutes', '4. Stir in [3 tbsp soy sauce] and [1 tbsp ginger]', '5. Toss everything together and serve over rice'], nutrition: {calories: 340, protein: 38, carbs: 18, fat: 12}},
    { id: 'discover-3', name: 'Veggie Quesadilla', description: 'Crispy cheesy vegetarian delight', prepTime: '5 minutes', cookTime: '7 minutes', difficulty: 'Easy', servings: 2, cuisine: 'Mexican', image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '4', unit: '', item: 'flour tortillas'}, {amount: '2', unit: 'cups', item: 'shredded cheese'}, {amount: '1', unit: 'cup', item: 'bell peppers, diced'}, {amount: '1/2', unit: 'cup', item: 'onion, diced'}, {amount: '1', unit: 'cup', item: 'mushrooms, sliced'}], instructions: ['1. Sauté [1 cup bell peppers], [1/2 cup onion], and [1 cup mushrooms] until soft', '2. Place tortilla in pan, sprinkle [1/2 cup cheese]', '3. Add veggie mixture on half of the tortilla', '4. Fold tortilla in half, cook 2 minutes per side until crispy', '5. Cut into wedges and serve with sour cream'], nutrition: {calories: 380, protein: 18, carbs: 42, fat: 16}},
    { id: 'discover-4', name: 'Egg Fried Rice', description: 'Classic comfort food in 20 minutes', prepTime: '5 minutes', cookTime: '15 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Asian', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '4', unit: 'cups', item: 'cooked rice, day-old'}, {amount: '3', unit: '', item: 'eggs, beaten'}, {amount: '1', unit: 'cup', item: 'mixed vegetables'}, {amount: '3', unit: 'tbsp', item: 'soy sauce'}, {amount: '2', unit: 'tbsp', item: 'vegetable oil'}, {amount: '2', unit: '', item: 'green onions, chopped'}], instructions: ['1. Heat [2 tbsp oil] in large pan or wok over high heat', '2. Scramble [3 eggs] in the pan, set aside', '3. Add [4 cups rice], break up clumps and fry 5 minutes', '4. Add [1 cup mixed vegetables] and [3 tbsp soy sauce]', '5. Stir in scrambled eggs and [2 green onions], toss well'], nutrition: {calories: 320, protein: 12, carbs: 52, fat: 8}},
    { id: 'discover-5', name: 'Viral Feta Pasta', description: 'The TikTok sensation that broke the internet', prepTime: '5 minutes', cookTime: '30 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Mediterranean', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: 'block', item: 'feta cheese (8 oz)'}, {amount: '2', unit: 'cups', item: 'cherry tomatoes'}, {amount: '1/3', unit: 'cup', item: 'olive oil'}, {amount: '3', unit: 'cloves', item: 'garlic, minced'}, {amount: '12', unit: 'oz', item: 'pasta'}, {amount: '1/4', unit: 'cup', item: 'fresh basil'}], instructions: ['1. Preheat oven to 400°F', '2. Place [1 block feta] in center of baking dish, surround with [2 cups tomatoes]', '3. Drizzle [1/3 cup olive oil] over everything, add [3 cloves garlic]', '4. Bake 30 minutes until tomatoes burst', '5. Boil [12 oz pasta], toss with feta mixture and [1/4 cup basil]'], nutrition: {calories: 480, protein: 16, carbs: 58, fat: 22}},
    { id: 'discover-6', name: 'Cloud Eggs', description: 'Instagram-worthy fluffy breakfast clouds', prepTime: '10 minutes', cookTime: '15 minutes', difficulty: 'Medium', servings: 2, cuisine: 'American', image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '4', unit: '', item: 'eggs'}, {amount: '1/4', unit: 'cup', item: 'parmesan cheese, grated'}, {amount: '2', unit: 'tbsp', item: 'chives, chopped'}, {amount: '', unit: '', item: 'salt and pepper to taste'}], instructions: ['1. Preheat oven to 450°F, separate [4 eggs] (yolks in bowls, whites in mixer)', '2. Beat egg whites until stiff peaks form', '3. Fold in [1/4 cup parmesan] and [2 tbsp chives]', '4. Spoon clouds onto baking sheet, make indent in center', '5. Bake 3 minutes, add yolks to indents, bake 3 more minutes'], nutrition: {calories: 180, protein: 14, carbs: 2, fat: 13}},
    { id: 'discover-7', name: 'Dalgona Coffee', description: 'Whipped coffee trend you need to try', prepTime: '10 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 1, cuisine: 'Korean', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '2', unit: 'tbsp', item: 'instant coffee'}, {amount: '2', unit: 'tbsp', item: 'sugar'}, {amount: '2', unit: 'tbsp', item: 'hot water'}, {amount: '1', unit: 'cup', item: 'milk'}, {amount: '', unit: '', item: 'ice cubes'}], instructions: ['1. Combine [2 tbsp instant coffee], [2 tbsp sugar], and [2 tbsp hot water]', '2. Whisk vigorously for 3-5 minutes until fluffy and thick', '3. Fill glass with [ice cubes] and [1 cup milk]', '4. Spoon whipped coffee on top', '5. Stir before drinking for the perfect blend'], nutrition: {calories: 120, protein: 8, carbs: 18, fat: 2}},
    { id: 'discover-8', name: 'Birria Tacos', description: 'Rich, tender beef tacos with consommé', prepTime: '15 minutes', cookTime: '30 minutes', difficulty: 'Medium', servings: 6, cuisine: 'Mexican', image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '2', unit: 'lbs', item: 'beef chuck, cubed'}, {amount: '3', unit: '', item: 'dried chiles'}, {amount: '1', unit: '', item: 'onion, quartered'}, {amount: '4', unit: 'cloves', item: 'garlic'}, {amount: '12', unit: '', item: 'corn tortillas'}, {amount: '2', unit: 'cups', item: 'cheese, shredded'}], instructions: ['1. Simmer [2 lbs beef] with [3 dried chiles], [1 onion], and [4 cloves garlic] for 25 minutes', '2. Shred beef, reserve broth', '3. Dip [tortillas] in broth, fill with beef and [cheese]', '4. Pan-fry tacos until crispy', '5. Serve with broth for dipping'], nutrition: {calories: 520, protein: 42, carbs: 38, fat: 22}},
    { id: 'discover-9', name: "Olive Garden Breadsticks", description: 'Copycat recipe for those addictive breadsticks', prepTime: '15 minutes', cookTime: '15 minutes', difficulty: 'Medium', servings: 12, cuisine: 'Italian', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: 'cup', item: 'warm water'}, {amount: '2', unit: 'tbsp', item: 'sugar'}, {amount: '1', unit: 'tbsp', item: 'yeast'}, {amount: '3', unit: 'cups', item: 'flour'}, {amount: '2', unit: 'tbsp', item: 'butter, melted'}, {amount: '1', unit: 'tsp', item: 'garlic salt'}], instructions: ['1. Mix [1 cup warm water], [2 tbsp sugar], and [1 tbsp yeast], let sit 5 minutes', '2. Add [3 cups flour] and [2 tbsp melted butter], knead until smooth', '3. Shape into breadsticks, let rise 10 minutes', '4. Bake at 400°F for 15 minutes until golden', '5. Brush with [1 tsp garlic salt] butter while hot'], nutrition: {calories: 140, protein: 4, carbs: 26, fat: 2}},
    { id: 'discover-10', name: 'Big Mac Sauce', description: 'The secret sauce that makes everything better', prepTime: '5 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 8, cuisine: 'American', image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: 'cup', item: 'mayonnaise'}, {amount: '2', unit: 'tbsp', item: 'sweet pickle relish'}, {amount: '2', unit: 'tsp', item: 'yellow mustard'}, {amount: '1', unit: 'tsp', item: 'white vinegar'}, {amount: '1', unit: 'tsp', item: 'paprika'}, {amount: '1', unit: 'tsp', item: 'onion powder'}], instructions: ['1. Combine [1 cup mayo], [2 tbsp relish], [2 tsp mustard]', '2. Add [1 tsp vinegar], [1 tsp paprika], [1 tsp onion powder]', '3. Whisk until smooth', '4. Refrigerate 30 minutes for flavors to blend', '5. Use on burgers, fries, or anything you want to make taste like a Big Mac'], nutrition: {calories: 180, protein: 0, carbs: 2, fat: 20}},
    { id: 'discover-11', name: 'KFC Coleslaw', description: 'The creamy, tangy slaw everyone craves', prepTime: '10 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 8, cuisine: 'American', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: '', item: 'cabbage, shredded (8 cups)'}, {amount: '1/4', unit: 'cup', item: 'carrots, shredded'}, {amount: '1/3', unit: 'cup', item: 'sugar'}, {amount: '1/2', unit: 'cup', item: 'mayonnaise'}, {amount: '1/4', unit: 'cup', item: 'buttermilk'}, {amount: '2', unit: 'tbsp', item: 'white vinegar'}], instructions: ['1. Mix [1/3 cup sugar], [1/2 cup mayo], [1/4 cup buttermilk], [2 tbsp vinegar]', '2. Toss [8 cups shredded cabbage] and [1/4 cup carrots] together', '3. Pour dressing over cabbage mixture', '4. Refrigerate at least 2 hours', '5. Toss again before serving for that authentic KFC texture'], nutrition: {calories: 160, protein: 1, carbs: 14, fat: 12}},
    { id: 'discover-12', name: 'Chipotle Cilantro Lime Rice', description: 'The perfect copycat rice', prepTime: '5 minutes', cookTime: '20 minutes', difficulty: 'Easy', servings: 6, cuisine: 'Mexican', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '2', unit: 'cups', item: 'white rice'}, {amount: '3', unit: 'cups', item: 'water'}, {amount: '2', unit: 'tbsp', item: 'lime juice'}, {amount: '1/4', unit: 'cup', item: 'cilantro, chopped'}, {amount: '1', unit: 'tbsp', item: 'butter'}, {amount: '1', unit: 'tsp', item: 'salt'}], instructions: ['1. Bring [3 cups water] to boil, add [2 cups rice] and [1 tsp salt]', '2. Reduce heat, cover, simmer 18 minutes', '3. Remove from heat, fluff with fork', '4. Stir in [1 tbsp butter], [2 tbsp lime juice], [1/4 cup cilantro]', '5. Let sit 5 minutes covered, fluff again and serve'], nutrition: {calories: 240, protein: 4, carbs: 52, fat: 2}},
    { id: 'discover-13', name: 'Hidden Veggie Mac & Cheese', description: 'Creamy comfort food with sneaky vegetables', prepTime: '10 minutes', cookTime: '10 minutes', difficulty: 'Easy', servings: 4, cuisine: 'American', image: 'https://images.pexels.com/photos/265393/pexels-photo-265393.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '12', unit: 'oz', item: 'elbow macaroni'}, {amount: '1', unit: 'cup', item: 'butternut squash puree'}, {amount: '2', unit: 'cups', item: 'sharp cheddar, shredded'}, {amount: '1', unit: 'cup', item: 'milk'}, {amount: '2', unit: 'tbsp', item: 'butter'}], instructions: ['1. Cook [12 oz macaroni] according to package', '2. In pot, melt [2 tbsp butter], add [1 cup milk] and [1 cup squash puree]', '3. Stir in [2 cups cheddar] until melted', '4. Toss cooked pasta with cheese sauce', '5. Kids will never know they ate their veggies!'], nutrition: {calories: 420, protein: 18, carbs: 54, fat: 16}},
    { id: 'discover-14', name: 'Pizza Rolls', description: 'Crispy handheld pizza perfection', prepTime: '10 minutes', cookTime: '5 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Italian', image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: 'package', item: 'egg roll wrappers'}, {amount: '1', unit: 'cup', item: 'mozzarella, shredded'}, {amount: '1/2', unit: 'cup', item: 'pepperoni, diced'}, {amount: '1', unit: 'cup', item: 'pizza sauce'}, {amount: '', unit: '', item: 'oil for frying'}], instructions: ['1. Lay out [egg roll wrappers], add [mozzarella] and [pepperoni] to center', '2. Roll up egg rolls, seal edges with water', '3. Heat oil to 350°F', '4. Fry rolls 2-3 minutes until golden', '5. Serve with [pizza sauce] for dipping'], nutrition: {calories: 320, protein: 14, carbs: 28, fat: 18}},
    { id: 'discover-15', name: 'Crispy Chicken Tenders', description: 'Better than any nugget, shaped like dinosaurs optional', prepTime: '15 minutes', cookTime: '18 minutes', difficulty: 'Easy', servings: 4, cuisine: 'American', image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: 'lb', item: 'chicken tenders'}, {amount: '1', unit: 'cup', item: 'flour'}, {amount: '2', unit: '', item: 'eggs, beaten'}, {amount: '2', unit: 'cups', item: 'panko breadcrumbs'}, {amount: '1', unit: 'tsp', item: 'paprika'}], instructions: ['1. Set up breading station: [flour], [eggs], [panko with paprika]', '2. Coat [chicken tenders] in flour, dip in egg, coat in panko', '3. Place on baking sheet', '4. Bake at 400°F for 18 minutes, flipping halfway', '5. Serve with ketchup, honey mustard, or ranch'], nutrition: {calories: 380, protein: 32, carbs: 42, fat: 8}},
    { id: 'discover-16', name: 'Rainbow Fruit Kabobs', description: 'Fun, healthy snack kids will love making', prepTime: '10 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 6, cuisine: 'American', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', ingredients: [{amount: '1', unit: 'cup', item: 'strawberries'}, {amount: '1', unit: 'cup', item: 'pineapple chunks'}, {amount: '1', unit: 'cup', item: 'green grapes'}, {amount: '1', unit: 'cup', item: 'blueberries'}, {amount: '6', unit: '', item: 'wooden skewers'}], instructions: ['1. Wash all fruit thoroughly', '2. Thread [strawberries] on [skewers] (red)', '3. Add [pineapple] (yellow), [grapes] (green), [blueberries] (blue)', '4. Arrange on platter in rainbow order', '5. Serve with yogurt dip if desired'], nutrition: {calories: 80, protein: 1, carbs: 20, fat: 0}}
  ];

  // Category organization
  const categories = {
    '20min': {
      title: '⚡ Quick 20-Min Meals',
      subtitle: 'Perfect for busy weeknights',
      recipeIds: ['discover-1', 'discover-2', 'discover-3', 'discover-4']
    },
    'trending': {
      title: '🔥 Trending Now',
      subtitle: 'What everyone is cooking',
      recipeIds: ['discover-5', 'discover-6', 'discover-7', 'discover-8']
    },
    'copycat': {
      title: '🍔 Restaurant Copycats',
      subtitle: 'Your favorites, made at home',
      recipeIds: ['discover-9', 'discover-10', 'discover-11', 'discover-12']
    },
    'kids': {
      title: '👶 Picky Eater Approved',
      subtitle: 'Kids will actually eat these',
      recipeIds: ['discover-13', 'discover-14', 'discover-15', 'discover-16']
    }
  };

  // Load discover recipes into storage on mount
  useEffect(() => {
    const existingRecipes = recipeStorage.getRecipes();
    const existingIds = new Set(existingRecipes.map(r => r.id));
    const newRecipes = discoverRecipes.filter(r => !existingIds.has(r.id));
    
    if (newRecipes.length > 0) {
      recipeStorage.setRecipes([...existingRecipes, ...newRecipes]);
    }
  }, []);

  const findExistingRecipe = (input: string): Recipe | null => {
    const normalized = input.toLowerCase().split(',').map(i => i.trim()).sort().join(',');
    const cached = JSON.parse(localStorage.getItem('generatedRecipes') || '[]');
    return cached.find((r: any) => r.ingredientKey === normalized) || null;
  };

  const estimateNutrition = (ingredients: any[]) => {
    // Basic estimates based on common ingredients
    let calories = 350; // base calories
    let protein = 20;
    let carbs = 35;
    let fat = 12;
    
    const ingredientText = ingredients.map(i => i.item || i).join(' ').toLowerCase();
    
    // Adjust based on main ingredients
    if (ingredientText.includes('chicken')) {
      protein += 25;
      calories += 150;
    }
    if (ingredientText.includes('beef')) {
      protein += 30;
      fat += 15;
      calories += 250;
    }
    if (ingredientText.includes('pasta') || ingredientText.includes('rice')) {
      carbs += 45;
      calories += 200;
    }
    if (ingredientText.includes('cheese')) {
      fat += 10;
      calories += 100;
    }
    if (ingredientText.includes('oil') || ingredientText.includes('butter')) {
      fat += 15;
      calories += 120;
    }
    
    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    };
  };

  const parseRecipeText = (text: string): Recipe => {
    const lines = text.split('\n');
    const recipe: any = {
      id: Date.now().toString(),
      name: '',
      prepTime: '0 minutes',
      cookTime: '0 minutes',
      ingredients: [],
      instructions: [],
      description: '',
      difficulty: 'Medium',
      servings: 4,
      cuisine: 'Various',
      image: '',
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };
    
    let section = '';
    lines.forEach(line => {
      if (line.startsWith('Title:')) {
        recipe.name = line.replace('Title:', '').trim();
      }
      if (line.includes('Prep Time:')) {
        const mins = parseInt(line.match(/\d+/)?.[0] || '0');
        recipe.prepTime = `${mins} minutes`;
      }
      if (line.includes('Cook Time:')) {
        const mins = parseInt(line.match(/\d+/)?.[0] || '0');
        recipe.cookTime = `${mins} minutes`;
      }
      if (line.includes('Ingredients:')) section = 'ingredients';
      else if (line.includes('Instructions:')) section = 'instructions';
      else if (line.includes('Nutrition')) section = 'nutrition';
      else if (section === 'ingredients' && line.trim().startsWith('-')) {
        const ingredient = line.replace('-', '').trim();
        recipe.ingredients.push({
          amount: '',
          unit: '',
          item: ingredient
        });
      }
      else if (section === 'instructions' && line.trim().match(/^\d+\./)) {
        recipe.instructions.push(line.trim());
      }
      else if (section === 'nutrition') {
        if (line.includes('Calories:')) recipe.nutrition.calories = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Protein:')) recipe.nutrition.protein = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Carbs:')) recipe.nutrition.carbs = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Fat:')) recipe.nutrition.fat = parseInt(line.match(/\d+/)?.[0] || '0');
      }
    });
    
    // Fallback nutrition if AI doesn't provide it
    if (recipe.nutrition.calories === 0) {
      recipe.nutrition = estimateNutrition(recipe.ingredients);
    }
    
    return recipe;
  };

  const saveToFavorites = (recipe: Recipe) => {
    // Get existing favorites from localStorage
    const existingFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Add unique ID if it doesn't have one
    const recipeToSave = {
      ...recipe,
      id: recipe.id || Date.now().toString(),
      savedAt: Date.now()
    };
    
    // Check if already saved (prevent duplicates)
    const alreadySaved = existingFavorites.some((fav: any) => fav.id === recipeToSave.id);
    
    if (alreadySaved) {
      toast({
        title: "Recipe already in your favorites!",
      });
      return;
    }
    
    // Add to favorites
    existingFavorites.push(recipeToSave);
    
    // Save back to localStorage
    localStorage.setItem('favorites', JSON.stringify(existingFavorites));
    
    // Show success message
    toast({
      title: "Saved to your recipes! ❤️",
    });
    
    // Log for debugging
    console.log('Recipe saved:', recipeToSave);
    console.log('Total favorites:', existingFavorites.length);
  };

  const handleGenerateRecipe = async () => {
    if (!ingredientInput.trim()) {
      toast({
        title: "Hey! Add some ingredients first 😊",
        variant: "destructive",
      });
      return;
    }

    // Check if API key is set
    const OPENAI_API_KEY = localStorage.getItem('openai_api_key') || '';
    if (!OPENAI_API_KEY) {
      toast({
        title: "Please set your OpenAI API key in Admin panel",
        variant: "destructive",
      });
      return;
    }
    
    // Reset daily limit at midnight
    const lastReset = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    if (lastReset !== today) {
      localStorage.setItem('recipesGenerated', '0');
      localStorage.setItem('lastResetDate', today);
      setRecipesGeneratedToday(0);
    }
    
    // Check cache FIRST
    const cached = findExistingRecipe(ingredientInput);
    if (cached) {
      console.log('CACHE HIT:', cached.name);
      setGeneratedRecipe(cached);
      setRecipes([cached]);
      recipeStorage.setRecipes([cached]);
      toast({
        title: "Found a perfect match in my cookbook!",
      });
      return;
    }
    
    // Check daily limit (skip for premium users)
    if (!isPremium) {
      const currentCount = parseInt(localStorage.getItem('recipesGenerated') || '0');
      if (currentCount >= 5) {
        toast({
          title: "Daily limit reached! Activate premium for unlimited recipes",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Call OpenAI
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
      
      if (!response.ok) throw new Error('Failed to generate');
      
      const data = await response.json();
      const recipeText = data.choices[0].message.content;
      
      // Parse recipe
      const recipe = parseRecipeText(recipeText);
      
      // Save ingredient input for smart image matching
      recipe.ingredientInput = ingredientInput;
      
      // Get appropriate image based on recipe content
      recipe.image = getRecipeImage(recipe);
      
      // Debugging
      console.log('Recipe title:', recipe.name);
      console.log('Ingredients used:', recipe.ingredientInput);
      console.log('Selected image:', recipe.image);
      
      // Cache it
      const cachedRecipes = JSON.parse(localStorage.getItem('generatedRecipes') || '[]');
      cachedRecipes.push({
        ...recipe,
        ingredientInput,
        ingredientKey: ingredientInput.toLowerCase().split(',').map(i => i.trim()).sort().join(','),
        timestamp: Date.now()
      });
      if (cachedRecipes.length > 100) cachedRecipes.shift();
      localStorage.setItem('generatedRecipes', JSON.stringify(cachedRecipes));
      
      // Update daily count (only for non-premium users)
      if (!isPremium) {
        const currentCount = parseInt(localStorage.getItem('recipesGenerated') || '0');
        const newCount = currentCount + 1;
        localStorage.setItem('recipesGenerated', String(newCount));
        setRecipesGeneratedToday(newCount);
      }
      
      // Display recipe
      setGeneratedRecipe(recipe);
      setRecipes([recipe]);
      recipeStorage.setRecipes([recipe]);
      console.log('NEW RECIPE GENERATED:', recipe.name);
      toast({
        title: "Your recipe is ready! 👨‍🍳",
      });
      
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Oops! My kitchen brain froze. Try again?",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Recipes</h1>
          <p className="text-muted-foreground">Find your next favorite meal</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-card/80 border border-border'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Active Category Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2">
            {categories[activeCategory as keyof typeof categories].title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {categories[activeCategory as keyof typeof categories].subtitle}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories[activeCategory as keyof typeof categories].recipeIds.map(recipeId => {
              const recipe = discoverRecipes.find(r => r.id === recipeId);
              if (!recipe) return null;
              return (
                <div 
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="glass-card rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform cursor-pointer group"
                >
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-full h-32 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{recipe.name}</h3>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.cookTime}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Generator Section */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">🎲 Create Custom Recipe</h2>
            <p className="text-muted-foreground">
              Tell me what's in your fridge, I'll make it delicious
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl mb-8 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="What do you have? chicken, rice, that leftover bell pepper..."
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              className="mb-4 bg-background/50 border-border text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateRecipe()}
            />
            <Button
              onClick={handleGenerateRecipe}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recipes...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Recipe
                </>
              )}
            </Button>
            <p className="text-muted-foreground text-sm text-center mt-2">
              {isPremium 
                ? '⭐ Premium - Unlimited recipes' 
                : `${5 - recipesGeneratedToday} free recipes left today`
              }
            </p>
          </div>

          {isLoading && (
            <div className="mt-6 text-center max-w-2xl mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-4">Cooking up something special...</p>
            </div>
          )}

          {generatedRecipe && !isLoading && (
            <div className="mt-6 p-6 glass-card rounded-2xl max-w-2xl mx-auto">
            {generatedRecipe.image && (
              <img 
                src={generatedRecipe.image} 
                alt={generatedRecipe.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
                onError={(e) => {
                  console.error('Image failed to load:', e.currentTarget.src);
                  // Fallback to a default image if loading fails
                  e.currentTarget.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600';
                }}
              />
            )}
            <h3 className="text-2xl font-bold mb-2">{generatedRecipe.name}</h3>
            <div className="flex gap-4 text-sm text-muted-foreground mb-4">
              <span>⏱ Prep: {generatedRecipe.prepTime}</span>
              <span>🔥 Cook: {generatedRecipe.cookTime}</span>
            </div>
            {generatedRecipe.nutrition && (
              <div className="bg-card/50 rounded-lg p-3 mb-4 border border-border">
                <h4 className="text-primary font-semibold mb-2 text-sm">Nutrition (per serving)</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-foreground font-bold">{generatedRecipe.nutrition.calories}</div>
                    <div className="text-muted-foreground text-xs">Calories</div>
                  </div>
                  <div>
                    <div className="text-foreground font-bold">{generatedRecipe.nutrition.protein}g</div>
                    <div className="text-muted-foreground text-xs">Protein</div>
                  </div>
                  <div>
                    <div className="text-foreground font-bold">{generatedRecipe.nutrition.carbs}g</div>
                    <div className="text-muted-foreground text-xs">Carbs</div>
                  </div>
                  <div>
                    <div className="text-foreground font-bold">{generatedRecipe.nutrition.fat}g</div>
                    <div className="text-muted-foreground text-xs">Fat</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs mt-2 text-center">*Estimated values</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <h4 className="text-primary font-semibold mb-2">You'll need:</h4>
                <ul className="text-foreground space-y-1">
                  {generatedRecipe.ingredients.map((ing, i) => (
                    <li key={i}>• {ing.item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-primary font-semibold mb-2">Let's cook:</h4>
                <ol className="text-foreground space-y-2">
                  {generatedRecipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
              <Button 
                onClick={() => saveToFavorites(generatedRecipe)} 
                className="mt-6 w-full bg-primary hover:bg-primary/90"
              >
                ❤️ Save to My Recipes
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Generate;
