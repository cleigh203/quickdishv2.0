import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Loader2, Clock, X, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { recipeStorage } from "@/utils/recipeStorage";
import { getRecipeImage } from "@/utils/recipeImages";
import { Recipe } from "@/types/recipe";
import { allRecipes, getRecipesByCollection, getQuickRecipes } from "@/data/recipes";
import heroImage from "@/assets/recipes/quick-caprese-chicken.jpg";

const Generate = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('quick');
  const [searchMode, setSearchMode] = useState<'search' | 'ingredients'>('search');
  const [mode, setMode] = useState<'search' | 'ingredients'>('search');
  const [ingredientInput, setIngredientInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
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

  const categories = {
    'quick': {
      title: '⚡ Quick Meals Under 30 Min',
      subtitle: 'Perfect for busy weeknights',
      recipes: getQuickRecipes() || []
    },
    'halloween': {
      title: '🎃 Halloween Recipes',
      subtitle: 'Spooky seasonal treats',
      recipes: getRecipesByCollection('halloween') || []
    },
    'copycat': {
      title: '🍔 Restaurant Copycats',
      subtitle: 'Your favorite restaurant dishes at home',
      recipes: getRecipesByCollection('copycat') || []
    },
    'leftover': {
      title: '🔄 Leftover Makeovers',
      subtitle: 'Transform leftovers into delicious meals',
      recipes: getRecipesByCollection('leftover') || []
    }
  };

  // Load all recipes into storage on mount
  useEffect(() => {
    const existingRecipes = recipeStorage.getRecipes();
    const existingIds = new Set(existingRecipes.map(r => r.id));
    const newRecipes = allRecipes.filter(r => !existingIds.has(r.id));
    
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

  const currentRecipes = categories[activeCategory as keyof typeof categories]?.recipes || [];

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
    <div className="min-h-screen pb-20 bg-background">
      {/* Hero Section with Inline Search */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="relative h-full flex flex-col items-center justify-center px-6 space-y-8">
          <h1 className="text-6xl font-bold text-white">
            Discover
          </h1>
          
          {/* Toggle Buttons */}
          <div className="inline-flex gap-2 bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
            <button
              onClick={() => setSearchMode('search')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                searchMode === 'search'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Search Recipes
            </button>
            <button
              onClick={() => setSearchMode('ingredients')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                searchMode === 'ingredients'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Use My Ingredients
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full max-w-2xl">
            <Input
              placeholder={
                searchMode === 'search'
                  ? 'Search for any recipe...'
                  : 'Enter ingredients you have (e.g., chicken, rice, tomatoes)...'
              }
              value={searchMode === 'search' ? searchQuery : ingredientInput}
              onChange={(e) =>
                searchMode === 'search'
                  ? setSearchQuery(e.target.value)
                  : setIngredientInput(e.target.value)
              }
              onKeyPress={(e) =>
                e.key === 'Enter' && searchMode === 'ingredients' && handleGenerateRecipe()
              }
              className="h-14 px-6 py-4 text-base bg-white rounded-2xl shadow-2xl border-0"
            />
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 text-white/90 text-sm">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="font-medium underline hover:text-white transition-colors"
            >
              Advanced Filters
            </button>
            <span className="text-white/50">•</span>
            <button
              onClick={handleGenerateRecipe}
              disabled={isLoading || (searchMode === 'ingredients' && !ingredientInput.trim())}
              className="font-medium underline hover:text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel (Collapsible) */}
      {showFilters && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-background rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Customize Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cook Time - 2 column grid */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Cook Time</p>
              <div className="grid grid-cols-2 gap-3">
                {FILTERS.time.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-3 border-2 rounded-xl justify-center text-sm"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-4 h-4 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulty - 3 column grid */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Difficulty</p>
              <div className="grid grid-cols-3 gap-3">
                {FILTERS.difficulty.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-3 border-2 rounded-xl justify-center text-sm"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-4 h-4 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dietary - 2x2 grid */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Dietary</p>
              <div className="grid grid-cols-2 gap-3">
                {FILTERS.diet.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-3 border-2 rounded-xl justify-center text-sm"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-4 h-4 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meal Type - 2x2 grid */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Meal Type</p>
              <div className="grid grid-cols-2 gap-3">
                {FILTERS.meal.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-3 border-2 rounded-xl justify-center text-sm"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filters.includes(filter) && <Check className="w-4 h-4 mr-1" />}
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6">

        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
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

        {/* Category Title */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold mb-3">
            {categories[activeCategory as keyof typeof categories].title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {categories[activeCategory as keyof typeof categories].subtitle}
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="premium-card cursor-pointer border-0 overflow-hidden hover:shadow-xl transition-shadow"
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
