import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Loader2, Clock, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { getRecipeImage } from "@/utils/recipeImages";
import { Recipe } from "@/types/recipe";

const Generate = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('20min');
  const [mode, setMode] = useState<'search' | 'ingredients'>('search');
  const [ingredientInput, setIngredientInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  
  // All localStorage reads via lazy initialization
  const [recipesGeneratedToday, setRecipesGeneratedToday] = useState(() => {
    return parseInt(localStorage.getItem('recipesGenerated') || '0');
  });
  const [isPremium] = useState(() => {
    return localStorage.getItem('premiumUser') === 'true';
  });
  const [apiKey] = useState(() => {
    return localStorage.getItem('openai_api_key') || '';
  });
  const [lastResetDate, setLastResetDate] = useState(() => {
    return localStorage.getItem('lastResetDate') || '';
  });
  const [cachedRecipes, setCachedRecipes] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('generatedRecipes') || '[]');
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Save recipesGeneratedToday to localStorage
  useEffect(() => {
    localStorage.setItem('recipesGenerated', String(recipesGeneratedToday));
  }, [recipesGeneratedToday]);

  // Save lastResetDate to localStorage
  useEffect(() => {
    if (lastResetDate) {
      localStorage.setItem('lastResetDate', lastResetDate);
    }
  }, [lastResetDate]);

  // Save cachedRecipes to localStorage
  useEffect(() => {
    localStorage.setItem('generatedRecipes', JSON.stringify(cachedRecipes));
  }, [cachedRecipes]);

  // Read search query from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Full Recipe collections with complete data
  const discoverRecipes: Recipe[] = [
    { id: 'discover-1', name: 'Garlic Shrimp Pasta', description: 'Quick and flavorful pasta with succulent shrimp', prepTime: '5 minutes', cookTime: '10 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Italian', image: 'https://images.pexels.com/photos/3843224/pexels-photo-3843224.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 15, tags: ['dinner', 'seafood'], ingredients: [{amount: '1', unit: 'lb', item: 'shrimp, peeled'}, {amount: '12', unit: 'oz', item: 'linguine'}, {amount: '6', unit: 'cloves', item: 'garlic, minced'}, {amount: '1/4', unit: 'cup', item: 'olive oil'}, {amount: '1/2', unit: 'tsp', item: 'red pepper flakes'}, {amount: '1/4', unit: 'cup', item: 'fresh parsley, chopped'}], instructions: ['1. Boil [12 oz linguine] according to package directions', '2. Heat [1/4 cup olive oil] in a large pan over medium heat', '3. Add [6 cloves minced garlic] and [1/2 tsp red pepper flakes], cook 30 seconds', '4. Add [1 lb shrimp], cook 2-3 minutes per side until pink', '5. Toss cooked pasta with shrimp, garnish with [1/4 cup parsley]'], nutrition: {calories: 420, protein: 32, carbs: 48, fat: 14}},
    { id: 'discover-2', name: 'Chicken Stir Fry', description: 'Colorful veggie-packed chicken stir fry', prepTime: '10 minutes', cookTime: '8 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Asian', image: 'https://images.pexels.com/photos/2994900/pexels-photo-2994900.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 18, tags: ['dinner', 'lunch'], ingredients: [{amount: '1.5', unit: 'lbs', item: 'chicken breast, sliced'}, {amount: '2', unit: 'cups', item: 'mixed bell peppers'}, {amount: '1', unit: 'cup', item: 'broccoli florets'}, {amount: '3', unit: 'tbsp', item: 'soy sauce'}, {amount: '2', unit: 'tbsp', item: 'sesame oil'}, {amount: '1', unit: 'tbsp', item: 'ginger, minced'}], instructions: ['1. Heat [2 tbsp sesame oil] in a wok over high heat', '2. Add [1.5 lbs sliced chicken], stir-fry 5 minutes', '3. Add [2 cups bell peppers] and [1 cup broccoli], cook 3 minutes', '4. Stir in [3 tbsp soy sauce] and [1 tbsp ginger]', '5. Toss everything together and serve over rice'], nutrition: {calories: 340, protein: 38, carbs: 18, fat: 12}},
    { id: 'discover-3', name: 'Veggie Quesadilla', description: 'Crispy cheesy vegetarian delight', prepTime: '5 minutes', cookTime: '7 minutes', difficulty: 'Easy', servings: 2, cuisine: 'Mexican', image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 12, tags: ['vegetarian', 'lunch', 'dinner'], ingredients: [{amount: '4', unit: '', item: 'flour tortillas'}, {amount: '2', unit: 'cups', item: 'shredded cheese'}, {amount: '1', unit: 'cup', item: 'bell peppers, diced'}, {amount: '1/2', unit: 'cup', item: 'onion, diced'}, {amount: '1', unit: 'cup', item: 'mushrooms, sliced'}], instructions: ['1. Sauté [1 cup bell peppers], [1/2 cup onion], and [1 cup mushrooms] until soft', '2. Place tortilla in pan, sprinkle [1/2 cup cheese]', '3. Add veggie mixture on half of the tortilla', '4. Fold tortilla in half, cook 2 minutes per side until crispy', '5. Cut into wedges and serve with sour cream'], nutrition: {calories: 380, protein: 18, carbs: 42, fat: 16}},
    { id: 'discover-4', name: 'Egg Fried Rice', description: 'Classic comfort food in 20 minutes', prepTime: '5 minutes', cookTime: '15 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Asian', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 20, tags: ['vegetarian', 'lunch', 'dinner'], ingredients: [{amount: '4', unit: 'cups', item: 'cooked rice, day-old'}, {amount: '3', unit: '', item: 'eggs, beaten'}, {amount: '1', unit: 'cup', item: 'mixed vegetables'}, {amount: '3', unit: 'tbsp', item: 'soy sauce'}, {amount: '2', unit: 'tbsp', item: 'vegetable oil'}, {amount: '2', unit: '', item: 'green onions, chopped'}], instructions: ['1. Heat [2 tbsp oil] in large pan or wok over high heat', '2. Scramble [3 eggs] in the pan, set aside', '3. Add [4 cups rice], break up clumps and fry 5 minutes', '4. Add [1 cup mixed vegetables] and [3 tbsp soy sauce]', '5. Stir in scrambled eggs and [2 green onions], toss well'], nutrition: {calories: 320, protein: 12, carbs: 52, fat: 8}},
    { id: 'discover-5', name: 'Viral Feta Pasta', description: 'The TikTok sensation that broke the internet', prepTime: '5 minutes', cookTime: '30 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Mediterranean', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 35, tags: ['vegetarian', 'dinner'], ingredients: [{amount: '1', unit: 'block', item: 'feta cheese (8 oz)'}, {amount: '2', unit: 'cups', item: 'cherry tomatoes'}, {amount: '1/3', unit: 'cup', item: 'olive oil'}, {amount: '3', unit: 'cloves', item: 'garlic, minced'}, {amount: '12', unit: 'oz', item: 'pasta'}, {amount: '1/4', unit: 'cup', item: 'fresh basil'}], instructions: ['1. Preheat oven to 400°F', '2. Place [1 block feta] in center of baking dish, surround with [2 cups tomatoes]', '3. Drizzle [1/3 cup olive oil] over everything, add [3 cloves garlic]', '4. Bake 30 minutes until tomatoes burst', '5. Boil [12 oz pasta], toss with feta mixture and [1/4 cup basil]'], nutrition: {calories: 480, protein: 16, carbs: 58, fat: 22}},
    { id: 'discover-6', name: 'Cloud Eggs', description: 'Instagram-worthy fluffy breakfast clouds', prepTime: '10 minutes', cookTime: '15 minutes', difficulty: 'Medium', servings: 2, cuisine: 'American', image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 25, tags: ['vegetarian', 'breakfast'], ingredients: [{amount: '4', unit: '', item: 'eggs'}, {amount: '1/4', unit: 'cup', item: 'parmesan cheese, grated'}, {amount: '2', unit: 'tbsp', item: 'chives, chopped'}, {amount: '', unit: '', item: 'salt and pepper to taste'}], instructions: ['1. Preheat oven to 450°F, separate [4 eggs] (yolks in bowls, whites in mixer)', '2. Beat egg whites until stiff peaks form', '3. Fold in [1/4 cup parmesan] and [2 tbsp chives]', '4. Spoon clouds onto baking sheet, make indent in center', '5. Bake 3 minutes, add yolks to indents, bake 3 more minutes'], nutrition: {calories: 180, protein: 14, carbs: 2, fat: 13}},
    { id: 'discover-7', name: 'Dalgona Coffee', description: 'Whipped coffee trend you need to try', prepTime: '10 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 1, cuisine: 'Korean', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 10, tags: ['vegetarian', 'breakfast', 'dessert'], ingredients: [{amount: '2', unit: 'tbsp', item: 'instant coffee'}, {amount: '2', unit: 'tbsp', item: 'sugar'}, {amount: '2', unit: 'tbsp', item: 'hot water'}, {amount: '1', unit: 'cup', item: 'milk'}, {amount: '', unit: '', item: 'ice cubes'}], instructions: ['1. Combine [2 tbsp instant coffee], [2 tbsp sugar], and [2 tbsp hot water]', '2. Whisk vigorously for 3-5 minutes until fluffy and thick', '3. Fill glass with [ice cubes] and [1 cup milk]', '4. Spoon whipped coffee on top', '5. Stir before drinking for the perfect blend'], nutrition: {calories: 120, protein: 8, carbs: 18, fat: 2}},
    { id: 'discover-8', name: 'Birria Tacos', description: 'Rich, tender beef tacos with consommé', prepTime: '15 minutes', cookTime: '30 minutes', difficulty: 'Medium', servings: 6, cuisine: 'Mexican', image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 45, tags: ['dinner', 'lunch'], ingredients: [{amount: '2', unit: 'lbs', item: 'beef chuck, cubed'}, {amount: '3', unit: '', item: 'dried chiles'}, {amount: '1', unit: '', item: 'onion, quartered'}, {amount: '4', unit: 'cloves', item: 'garlic'}, {amount: '12', unit: '', item: 'corn tortillas'}, {amount: '2', unit: 'cups', item: 'cheese, shredded'}], instructions: ['1. Simmer [2 lbs beef] with [3 dried chiles], [1 onion], and [4 cloves garlic] for 25 minutes', '2. Shred beef, reserve broth', '3. Dip [tortillas] in broth, fill with beef and [cheese]', '4. Pan-fry tacos until crispy', '5. Serve with broth for dipping'], nutrition: {calories: 520, protein: 42, carbs: 38, fat: 22}},
    { id: 'discover-9', name: "Olive Garden Breadsticks", description: 'Copycat recipe for those addictive breadsticks', prepTime: '15 minutes', cookTime: '15 minutes', difficulty: 'Medium', servings: 12, cuisine: 'Italian', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 30, tags: ['vegetarian', 'lunch', 'dinner'], ingredients: [{amount: '1', unit: 'cup', item: 'warm water'}, {amount: '2', unit: 'tbsp', item: 'sugar'}, {amount: '1', unit: 'tbsp', item: 'yeast'}, {amount: '3', unit: 'cups', item: 'flour'}, {amount: '2', unit: 'tbsp', item: 'butter, melted'}, {amount: '1', unit: 'tsp', item: 'garlic salt'}], instructions: ['1. Mix [1 cup warm water], [2 tbsp sugar], and [1 tbsp yeast], let sit 5 minutes', '2. Add [3 cups flour] and [2 tbsp melted butter], knead until smooth', '3. Shape into breadsticks, let rise 10 minutes', '4. Bake at 400°F for 15 minutes until golden', '5. Brush with [1 tsp garlic salt] butter while hot'], nutrition: {calories: 140, protein: 4, carbs: 26, fat: 2}},
    { id: 'discover-10', name: 'Big Mac Sauce', description: 'The secret sauce that makes everything better', prepTime: '5 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 8, cuisine: 'American', image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 5, tags: ['vegetarian', 'lunch', 'dinner'], ingredients: [{amount: '1', unit: 'cup', item: 'mayonnaise'}, {amount: '2', unit: 'tbsp', item: 'sweet pickle relish'}, {amount: '2', unit: 'tsp', item: 'yellow mustard'}, {amount: '1', unit: 'tsp', item: 'white vinegar'}, {amount: '1', unit: 'tsp', item: 'paprika'}, {amount: '1', unit: 'tsp', item: 'onion powder'}], instructions: ['1. Combine [1 cup mayo], [2 tbsp relish], [2 tsp mustard]', '2. Add [1 tsp vinegar], [1 tsp paprika], [1 tsp onion powder]', '3. Whisk until smooth', '4. Refrigerate 30 minutes for flavors to blend', '5. Use on burgers, fries, or anything you want to make taste like a Big Mac'], nutrition: {calories: 180, protein: 0, carbs: 2, fat: 20}},
    { id: 'discover-11', name: 'KFC Coleslaw', description: 'The creamy, tangy slaw everyone craves', prepTime: '10 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 8, cuisine: 'American', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 10, tags: ['vegetarian', 'lunch', 'dinner'], ingredients: [{amount: '1', unit: '', item: 'cabbage, shredded (8 cups)'}, {amount: '1/4', unit: 'cup', item: 'carrots, shredded'}, {amount: '1/3', unit: 'cup', item: 'sugar'}, {amount: '1/2', unit: 'cup', item: 'mayonnaise'}, {amount: '1/4', unit: 'cup', item: 'buttermilk'}, {amount: '2', unit: 'tbsp', item: 'white vinegar'}], instructions: ['1. Mix [1/3 cup sugar], [1/2 cup mayo], [1/4 cup buttermilk], [2 tbsp vinegar]', '2. Toss [8 cups shredded cabbage] and [1/4 cup carrots] together', '3. Pour dressing over cabbage mixture', '4. Refrigerate at least 2 hours', '5. Toss again before serving for that authentic KFC texture'], nutrition: {calories: 160, protein: 1, carbs: 14, fat: 12}},
    { id: 'discover-12', name: 'Chipotle Cilantro Lime Rice', description: 'The perfect copycat rice', prepTime: '5 minutes', cookTime: '20 minutes', difficulty: 'Easy', servings: 6, cuisine: 'Mexican', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 25, tags: ['vegan', 'vegetarian', 'lunch', 'dinner'], ingredients: [{amount: '2', unit: 'cups', item: 'white rice'}, {amount: '3', unit: 'cups', item: 'water'}, {amount: '2', unit: 'tbsp', item: 'lime juice'}, {amount: '1/4', unit: 'cup', item: 'cilantro, chopped'}, {amount: '1', unit: 'tbsp', item: 'butter'}, {amount: '1', unit: 'tsp', item: 'salt'}], instructions: ['1. Bring [3 cups water] to boil, add [2 cups rice] and [1 tsp salt]', '2. Reduce heat, cover, simmer 18 minutes', '3. Remove from heat, fluff with fork', '4. Stir in [1 tbsp butter], [2 tbsp lime juice], [1/4 cup cilantro]', '5. Let sit 5 minutes covered, fluff again and serve'], nutrition: {calories: 240, protein: 4, carbs: 52, fat: 2}},
    { id: 'discover-13', name: 'Hidden Veggie Mac & Cheese', description: 'Creamy comfort food with sneaky vegetables', prepTime: '10 minutes', cookTime: '10 minutes', difficulty: 'Easy', servings: 4, cuisine: 'American', image: 'https://images.pexels.com/photos/265393/pexels-photo-265393.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 20, tags: ['vegetarian', 'lunch', 'dinner'], ingredients: [{amount: '12', unit: 'oz', item: 'elbow macaroni'}, {amount: '1', unit: 'cup', item: 'butternut squash puree'}, {amount: '2', unit: 'cups', item: 'sharp cheddar, shredded'}, {amount: '1', unit: 'cup', item: 'milk'}, {amount: '2', unit: 'tbsp', item: 'butter'}], instructions: ['1. Cook [12 oz macaroni] according to package', '2. In pot, melt [2 tbsp butter], add [1 cup milk] and [1 cup squash puree]', '3. Stir in [2 cups cheddar] until melted', '4. Toss cooked pasta with cheese sauce', '5. Kids will never know they ate their veggies!'], nutrition: {calories: 420, protein: 18, carbs: 54, fat: 16}},
    { id: 'discover-14', name: 'Pizza Rolls', description: 'Crispy handheld pizza perfection', prepTime: '10 minutes', cookTime: '5 minutes', difficulty: 'Easy', servings: 4, cuisine: 'Italian', image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 15, tags: ['lunch', 'dinner'], ingredients: [{amount: '1', unit: 'package', item: 'egg roll wrappers'}, {amount: '1', unit: 'cup', item: 'mozzarella, shredded'}, {amount: '1/2', unit: 'cup', item: 'pepperoni, diced'}, {amount: '1', unit: 'cup', item: 'pizza sauce'}, {amount: '', unit: '', item: 'oil for frying'}], instructions: ['1. Lay out [egg roll wrappers], add [mozzarella] and [pepperoni] to center', '2. Roll up egg rolls, seal edges with water', '3. Heat oil to 350°F', '4. Fry rolls 2-3 minutes until golden', '5. Serve with [pizza sauce] for dipping'], nutrition: {calories: 320, protein: 14, carbs: 28, fat: 18}},
    { id: 'discover-15', name: 'Crispy Chicken Tenders', description: 'Better than any nugget, shaped like dinosaurs optional', prepTime: '15 minutes', cookTime: '18 minutes', difficulty: 'Easy', servings: 4, cuisine: 'American', image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 33, tags: ['lunch', 'dinner'], ingredients: [{amount: '1', unit: 'lb', item: 'chicken tenders'}, {amount: '1', unit: 'cup', item: 'flour'}, {amount: '2', unit: '', item: 'eggs, beaten'}, {amount: '2', unit: 'cups', item: 'panko breadcrumbs'}, {amount: '1', unit: 'tsp', item: 'paprika'}], instructions: ['1. Set up breading station: [flour], [eggs], [panko with paprika]', '2. Coat [chicken tenders] in flour, dip in egg, coat in panko', '3. Place on baking sheet', '4. Bake at 400°F for 18 minutes, flipping halfway', '5. Serve with ketchup, honey mustard, or ranch'], nutrition: {calories: 380, protein: 32, carbs: 42, fat: 8}},
    { id: 'discover-16', name: 'Rainbow Fruit Kabobs', description: 'Fun, healthy snack kids will love making', prepTime: '10 minutes', cookTime: '0 minutes', difficulty: 'Easy', servings: 6, cuisine: 'American', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', totalTime: 10, tags: ['vegan', 'vegetarian', 'gluten-free', 'breakfast', 'dessert'], ingredients: [{amount: '1', unit: 'cup', item: 'strawberries'}, {amount: '1', unit: 'cup', item: 'pineapple chunks'}, {amount: '1', unit: 'cup', item: 'green grapes'}, {amount: '1', unit: 'cup', item: 'blueberries'}, {amount: '6', unit: '', item: 'wooden skewers'}], instructions: ['1. Wash all fruit thoroughly', '2. Thread [strawberries] on [skewers] (red)', '3. Add [pineapple] (yellow), [grapes] (green), [blueberries] (blue)', '4. Arrange on platter in rainbow order', '5. Serve with yogurt dip if desired'], nutrition: {calories: 80, protein: 1, carbs: 20, fat: 0}}
  ];

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
    return cachedRecipes.find((r: any) => r.ingredientKey === normalized) || null;
  };

  const estimateNutrition = (ingredients: any[]) => {
    let calories = 350;
    let protein = 20;
    let carbs = 35;
    let fat = 12;
    
    const ingredientText = ingredients.map(i => i.item || i).join(' ').toLowerCase();
    
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

  const parseRecipe = (text: string, ingredientInput: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    const recipe: any = {
      id: Date.now().toString(),
      name: '',
      description: '',
      prepTime: '',
      cookTime: '',
      difficulty: 'Easy',
      servings: 4,
      cuisine: 'Comfort Food',
      ingredients: [],
      instructions: [],
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ingredientInput
    };
    
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.toLowerCase().startsWith('title:')) {
        recipe.name = trimmed.substring(6).trim();
      }
      else if (trimmed.toLowerCase().startsWith('prep time:')) {
        recipe.prepTime = trimmed.substring(10).trim();
      }
      else if (trimmed.toLowerCase().startsWith('cook time:')) {
        recipe.cookTime = trimmed.substring(10).trim();
      }
      else if (trimmed.toLowerCase() === 'ingredients:') {
        currentSection = 'ingredients';
      }
      else if (trimmed.toLowerCase() === 'instructions:') {
        currentSection = 'instructions';
      }
      else if (trimmed.toLowerCase() === 'nutrition:') {
        currentSection = 'nutrition';
      }
      else if (currentSection === 'ingredients' && trimmed.startsWith('-')) {
        const ing = trimmed.substring(1).trim();
        const match = ing.match(/^([\d./]+)\s*(\w+)?\s*(.+)$/);
        if (match) {
          recipe.ingredients.push({
            amount: match[1],
            unit: match[2] || '',
            item: match[3]
          });
        } else {
          recipe.ingredients.push({
            amount: '',
            unit: '',
            item: ing
          });
        }
      }
      else if (currentSection === 'instructions' && /^\d+\./.test(trimmed)) {
        recipe.instructions.push(trimmed);
      }
      else if (currentSection === 'nutrition') {
        if (line.includes('Calories:')) recipe.nutrition.calories = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Protein:')) recipe.nutrition.protein = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Carbs:')) recipe.nutrition.carbs = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Fat:')) recipe.nutrition.fat = parseInt(line.match(/\d+/)?.[0] || '0');
      }
    });
    
    if (recipe.nutrition.calories === 0) {
      recipe.nutrition = estimateNutrition(recipe.ingredients);
    }
    
    return recipe;
  };

  const saveToFavorites = (recipe: Recipe) => {
    const recipeToSave = {
      ...recipe,
      id: recipe.id || Date.now().toString(),
      savedAt: Date.now()
    };
    
    if (recipeStorage.isFavorite(recipeToSave.id)) {
      toast({
        title: "Recipe already in your favorites!",
      });
      return;
    }
    
    recipeStorage.addFavorite(recipeToSave.id);
    
    toast({
      title: "Saved to your recipes! ❤️",
    });
    
    console.log('Recipe saved:', recipeToSave);
  };

  const handleGenerateRecipe = async () => {
    if (!ingredientInput.trim()) {
      toast({
        title: "Hey! Add some ingredients first 😊",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Please set your OpenAI API key in Admin panel",
        variant: "destructive",
      });
      return;
    }
    
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setLastResetDate(today);
      setRecipesGeneratedToday(0);
    }
    
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
    
    if (!isPremium && recipesGeneratedToday >= 5) {
      toast({
        title: "Daily limit reached (5 recipes)",
        description: "Come back tomorrow or upgrade to premium",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simple recipe generation without external service
      const recipe: any = {
        id: Date.now().toString(),
        name: `Recipe with ${ingredientInput}`,
        description: 'A delicious homemade recipe',
        prepTime: '15 minutes',
        cookTime: '30 minutes',
        difficulty: 'Easy',
        servings: 4,
        cuisine: 'Comfort Food',
        ingredients: ingredientInput.split(',').map(ing => ({
          amount: '1',
          unit: 'cup',
        item: ing.trim()
      })),
      instructions: ['1. Prepare ingredients', '2. Cook thoroughly', '3. Serve hot'],
      nutrition: estimateNutrition([]),
      ingredientInput
    };
    
    // Set image after recipe is fully constructed
    recipe.image = getRecipeImage(recipe);
      
      console.log('Recipe title:', recipe.name);
      console.log('Ingredients used:', recipe.ingredientInput);
      console.log('Selected image:', recipe.image);
      
      // Cache it using state updater
      setCachedRecipes(prev => {
        const updated = [...prev, {
          ...recipe,
          ingredientInput,
          ingredientKey: ingredientInput.toLowerCase().split(',').map(i => i.trim()).sort().join(','),
          timestamp: Date.now()
        }];
        return updated.length > 100 ? updated.slice(1) : updated;
      });
      
      if (!isPremium) {
        setRecipesGeneratedToday(prev => prev + 1);
      }
      
      setGeneratedRecipe(recipe);
      setRecipes([recipe]);
      recipeStorage.setRecipes([recipe]);
      console.log('NEW RECIPE GENERATED:', recipe.name);

      saveToFavorites(recipe);

      toast({
        title: "Recipe created! 🎉",
        description: `${recipe.name} is ready to cook!`,
      });

    } catch (error) {
      console.error('Recipe generation error:', error);
      toast({
        title: "Oops, something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentRecipes = discoverRecipes.filter(r => 
    categories[activeCategory as keyof typeof categories].recipeIds.includes(r.id)
  );

  // Filter constants
  const FILTERS = {
    time: ['Under 30min', '30-60min'],
    diet: ['Vegetarian', 'Vegan', 'Gluten-Free', 'None'],
    difficulty: ['Easy', 'Medium', 'Hard'],
    meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  };

  // Apply filters
  const filteredRecipes = currentRecipes.filter(recipe => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = recipe.name.toLowerCase().includes(query);
      const matchesIngredients = recipe.ingredients.some(ing => 
        ing.item.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesIngredients) return false;
    }
    
    if (!filters.length) return true;
    
    return filters.every(filter => {
      // Time filters
      if (filter === 'Under 30min') return (recipe.totalTime || 0) <= 30;
      if (filter === '30-60min') return (recipe.totalTime || 0) > 30 && (recipe.totalTime || 0) <= 60;
      
      // Difficulty filters
      if (filter === 'Easy') return recipe.difficulty.toLowerCase() === 'easy';
      if (filter === 'Medium') return recipe.difficulty.toLowerCase() === 'medium';
      if (filter === 'Hard') return recipe.difficulty.toLowerCase() === 'hard';
      
      // Diet and meal filters (tags)
      const normalizedFilter = filter.toLowerCase().replace('-', '');
      return recipe.tags?.some(tag => tag.toLowerCase().includes(normalizedFilter));
    });
  });

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => setFilters([]);

  return (
    <div className="min-h-screen pb-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto pt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3">
            {searchQuery ? `Recipes with: ${searchQuery}` : 'Discover'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {searchQuery 
              ? `Found ${filteredRecipes.length} recipes you can make`
              : `Real food, real recipes • ${filteredRecipes.length} recipes`
            }
          </p>
        </div>

        <div className="premium-card border-0 p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Recipe Creator</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Find or create the perfect recipe</p>
          
          <div className="space-y-4">
            {/* Tab Switcher */}
            <div className="flex gap-2">
              <button 
                onClick={() => setMode('search')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'search' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Search Recipes
              </button>
              <button 
                onClick={() => setMode('ingredients')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'ingredients' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Use My Ingredients
              </button>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {mode === 'search' ? 'What do you want to cook?' : 'What ingredients do you have?'}
              </label>
              <Input
                placeholder={
                  mode === 'search' 
                    ? "Search for any recipe... (e.g., 'chicken parmesan', 'chocolate cake')" 
                    : "What's in your kitchen? (e.g., 'chicken, rice, peppers')"
                }
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateRecipe()}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {!isPremium && `${5 - recipesGeneratedToday} of 5 free recipes remaining today`}
                {isPremium && '✨ Premium - Unlimited recipes'}
              </p>
            </div>
            <Button
              onClick={handleGenerateRecipe}
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating your recipe...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Recipe
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap transition-all font-semibold ${
                activeCategory === key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card hover:bg-card/80'
              }`}
            >
              {cat.title.split(' ')[0]} {cat.title.split(' ').slice(1).join(' ')}
            </button>
          ))}
        </div>

        {/* Sticky Filters */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Quick Filters</h3>
            {filters.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
              >
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {/* Cook Time - 2 column grid */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Cook Time</p>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.time.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 border-2 rounded-lg justify-center"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulty - 3 column grid */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Difficulty</p>
              <div className="grid grid-cols-3 gap-2">
                {FILTERS.difficulty.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 border-2 rounded-lg justify-center"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dietary - 2x2 grid */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Dietary</p>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.diet.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 border-2 rounded-lg justify-center"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meal Type - 2x2 grid */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Meal Type</p>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.meal.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 border-2 rounded-lg justify-center"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-3 h-3 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {categories[activeCategory as keyof typeof categories].title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {categories[activeCategory as keyof typeof categories].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="premium-card cursor-pointer border-0 overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.prepTime}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 leading-snug">
                  {recipe.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Generate;
