import { useState, useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { Search, TrendingUp, Sparkles, HelpCircle, Mic, MicOff, Play, FastForward, Rewind, RotateCcw, Timer, CheckCircle, X, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipes } from "@/contexts/RecipesContext";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { Recipe } from "@/types/recipe";
import { BottomNav } from "@/components/BottomNav";
import { getRecipeImage } from "@/utils/recipeImages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RecipeDetail from "./RecipeDetail";

const AiGenerationPrompt = lazy(() => import("@/components/AiGenerationPrompt").then(m => ({ default: m.AiGenerationPrompt })));

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { recipes: allRecipes, isLoading: isLoadingRecipes } = useRecipes();
  const { saveRecipe, isSaved, unsaveRecipe } = useSavedRecipes();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [filters, setFilters] = useState({
    prepTime: 'all', // 'all', '15', '30', '45'
    difficulty: 'all', // 'all', 'easy', 'medium', 'hard'
    dietary: [] as string[] // ['vegan', 'gluten-free', 'dairy-free']
  });

  const [userProfile, setUserProfile] = useState<any>(null);
  const [greeting, setGreeting] = useState({ title: '', question: '' });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, full_name')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setUserProfile(data);
      }
    };
    
    fetchProfile();
    
    // Set up a listener to refetch when profile changes (e.g., when user updates their name)
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user?.id}` },
        () => {
          fetchProfile();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Use display_name first (what's shown in profile), then fallback to full_name, then user_metadata, then 'Chef'
  const firstName = userProfile?.display_name?.split(' ')[0] || 
                    userProfile?.full_name?.split(' ')[0] || 
                    user?.user_metadata?.full_name?.split(' ')[0] || 
                    'Chef';

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingTitle = "Good Evening";
    let greetingQuestion = "What sounds delicious tonight?";
    
    if (hour < 12) {
      greetingTitle = "Good Morning";
      greetingQuestion = "Ready for breakfast?";
    } else if (hour < 18) {
      greetingTitle = "Good Afternoon";
      greetingQuestion = "What's for lunch today?";
    }
    
    setGreeting({ title: greetingTitle, question: greetingQuestion });
  }, []);

  // Scroll restoration - handles both initial load (top) and returning from recipe (restore position)

  // Restore scroll position when returning from recipe
  useEffect(() => {
    console.log('🔥 INDEX USEFFECT - pathname changed to:', location.pathname);
    const savedScroll = sessionStorage.getItem('home_scroll');
    if (savedScroll) {
      console.log('🔄 Restoring scroll to:', savedScroll);
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll));
        sessionStorage.removeItem('home_scroll');
      }, 100);
    }
  }, [location.pathname]); // Only when pathname changes

  // Check if voice is supported
  useEffect(() => {
    const checkVoiceSupport = () => {
      const hasVoice = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setVoiceSupported(hasVoice);
    };
    checkVoiceSupport();
  }, []);

  // Cleanup voice recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleVoiceSearch = () => {
    if (!voiceSupported) {
      toast({
        title: "Voice not supported",
        description: "Your device doesn't support voice search",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
    } else {
      // Start listening
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice input:', transcript);
          setSearchQuery(transcript);
          
          // Auto-search after voice input (search happens automatically via filterByIngredients)
          // No need for explicit handleSearch call since filtering is reactive
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone access denied",
              description: "Please enable microphone permissions",
              variant: "destructive"
            });
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        
        toast({
          title: "🎤 Listening...",
          description: "Say your ingredients",
        });
      } catch (error) {
        console.error('Voice search error:', error);
        setIsListening(false);
        toast({
          title: "Couldn't start voice search",
          description: "Please check microphone permissions",
          variant: "destructive"
        });
      }
    }
  };

  // Get featured/trending recipes (rotated daily)
  useEffect(() => {
    if (!isLoadingRecipes && allRecipes.length > 0) {
      // Create a seed based on today's date for consistent daily rotation
      const today = new Date();
      const dateSeed = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      
      // Simple hash function to create a seed from the date
      let seed = 0;
      for (let i = 0; i < dateSeed.length; i++) {
        seed = ((seed << 5) - seed) + dateSeed.charCodeAt(i);
        seed = seed & seed; // Convert to 32-bit integer
      }
      
      // Shuffle recipes using seeded random (changes daily)
      const shuffled = [...allRecipes].sort(() => {
        // Use seed to create pseudo-random but consistent shuffle
        seed = (seed * 9301 + 49297) % 233280;
        return (seed / 233280) - 0.5;
      });
      
      // Take first 6 from shuffled array
      const featured = shuffled.slice(0, 6);
      setFeaturedRecipes(featured);
      setLoading(false);
    } else if (!isLoadingRecipes) {
      setLoading(false);
    }
  }, [allRecipes, isLoadingRecipes]);

  // Format cook time - add " min" if it's just a number
  const formatCookTime = (cookTime: string | undefined): string => {
    if (!cookTime) return '';
    const trimmed = cookTime.trim();
    // If it's just a number, add " min"
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed} min`;
    }
    // If it already has "min" or "minutes" or other text, return as is
    return trimmed;
  };

  // Filter recipes by ingredients when search query is entered (with word boundary matching)
  const filterByIngredients = (recipes: Recipe[], query: string): Recipe[] => {
    // Parse ingredients - split by comma OR space
    const rawIngredients = query.toLowerCase().includes(',') 
      ? query.toLowerCase().split(',')
      : query.toLowerCase().split(' ');
    
    // Clean up ingredients - remove empty strings and common words
    const stopWords = ['and', 'or', 'with', 'the', 'a', 'an', 'in'];
    const searchTerms = rawIngredients
      .map(i => i.trim())
      .filter(i => i.length > 2 && !stopWords.includes(i));
    
    if (searchTerms.length === 0) return recipes;

    // Filter recipes with WORD BOUNDARY matching - require ALL ingredients (AND logic)
    const filtered = recipes.filter(recipe => {
      // Get recipe name and ingredients as searchable text
      const recipeName = recipe.name?.toLowerCase() || '';
      const recipeIngredients = recipe.ingredients?.map((ing: any) => 
        ing?.item?.toLowerCase() || ''
      ).filter(Boolean).join(' ') || '';
      
      // Search in both name and ingredients
      const searchableText = `${recipeName} ${recipeIngredients}`;
      
      // Check if ALL of the user's ingredients match with word boundaries (AND logic)
      return searchTerms.every(ingredient => {
        // Use word boundary regex to avoid partial matches
        // \b ensures we match whole words only
        const regex = new RegExp(`\\b${ingredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(searchableText);
      });
    });

    // Sort results by relevance (recipes with more matching ingredients first)
    const sorted = filtered.sort((a, b) => {
      const aText = `${a.name} ${a.ingredients?.map((ing: any) => ing.item).join(' ')}`.toLowerCase();
      const bText = `${b.name} ${b.ingredients?.map((ing: any) => ing.item).join(' ')}`.toLowerCase();
      
      const aMatches = searchTerms.filter(term => {
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(aText);
      }).length;
      
      const bMatches = searchTerms.filter(term => {
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(bText);
      }).length;
      
      return bMatches - aMatches; // Higher matches first
    });

    return sorted;
  };

  // Filter recipes by ingredients when search query is entered (filters automatically as you type)
  // Apply additional filters (prep time, difficulty, dietary)
  const filteredRecipes = useMemo(() => {
    // Start with base search results (or all recipes if no search)
    const baseResults = searchQuery.trim()
      ? filterByIngredients(allRecipes, searchQuery)
      : allRecipes;

    let results = [...baseResults];

    // Filter by prep time
    if (filters.prepTime !== 'all') {
      results = results.filter(recipe => {
        const prepTime = recipe.prepTime ? parseInt(String(recipe.prepTime).replace(/\D/g, '')) : 0;
        if (filters.prepTime === '15') return prepTime <= 15;
        if (filters.prepTime === '30') return prepTime > 15 && prepTime <= 30;
        if (filters.prepTime === '45+') return prepTime > 30;
        return true;
      });
    }

    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      results = results.filter(recipe => {
        const difficulty = (recipe.difficulty || '').toLowerCase();
        return difficulty === filters.difficulty.toLowerCase();
      });
    }

    // Filter by dietary restrictions
    if (filters.dietary.length > 0) {
      results = results.filter(recipe => {
        const tags = (recipe.tags || []).map(t => t.toLowerCase().replace(/\s+/g, '-').replace('glutenfree', 'gluten-free').replace('dairyfree', 'dairy-free'));

        // Check if recipe matches ALL selected dietary restrictions
        return filters.dietary.every(diet => {
          const normalizedDiet = diet.toLowerCase().replace(/\s+/g, '-');
          return tags.some(tag =>
            tag === normalizedDiet ||
            tag === normalizedDiet.replace('-', '') ||
            tag.includes(normalizedDiet) ||
            normalizedDiet.includes(tag)
          );
        });
      });
    }

    return results;
  }, [searchQuery, allRecipes, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="QuickDish" className="w-full h-full object-contain" />
            </div>
            <div className="text-2xl font-bold text-gray-900">QuickDish</div>
          </div>
          
          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <HelpCircle size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {greeting.title}, {firstName}! 👋
        </h1>
        <p className="text-gray-600 text-base">
          {greeting.question}
        </p>
      </div>

      {/* Hero Search Section */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-[#047857] to-[#065f46] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              What's inside your fridge?
            </h2>
            
            <p className="text-white/95 mb-5 text-base">
              Have a specific dish in mind? Or just ingredients?
            </p>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchQuery)}
                placeholder="Search dishes or ingredients..."
                className="w-full px-5 py-3 pr-28 rounded-xl text-base border-0 focus:ring-4 focus:ring-white/30 focus:outline-none placeholder-gray-400"
              />
              
              {/* Voice Button */}
              {voiceSupported && (
                <button
                  onClick={toggleVoiceSearch}
                  className={`absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
              
              {/* Clear/Search Button */}
              {searchQuery.trim() ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#047857] p-2 rounded-lg hover:bg-green-50 transition-colors text-lg font-bold w-10 h-10"
                >
                  ×
                </button>
              ) : (
                <button
                  onClick={() => setSearchQuery(searchQuery)}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#047857] p-2 rounded-lg hover:bg-green-50 transition-colors text-lg font-bold disabled:opacity-50 w-10 h-10"
                >
                  →
                </button>
              )}
            </div>
            
            {/* Listening Indicator */}
            {isListening && (
              <div className="mt-3 flex items-center gap-2 text-white/90 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Listening... Speak your ingredients</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar - Only show when not searching */}
      {!searchQuery.trim() && (
        <>
          <div className="px-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-4 grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl mb-1">🎤</div>
                <div className="text-xs font-semibold text-gray-900 leading-tight">Voice Control</div>
                <div className="text-[10px] text-gray-500">Hands-free cooking</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-xs font-semibold text-gray-900 leading-tight">Recipe Meal Plans</div>
                <div className="text-[10px] text-gray-500">Custom made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-xs font-semibold text-gray-900 leading-tight">500+ Recipes</div>
                <div className="text-[10px] text-gray-500">Chef Curated</div>
              </div>
            </div>
          </div>

          {/* AI Tip Card */}
          <div className="px-6 mb-8">
            <div className="bg-gradient-to-br from-[#047857] to-[#065f46] rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="text-3xl">✨</div>
                <div>
                  <h3 className="font-bold text-base mb-1">Can't find a recipe?</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Just type your ingredients in the search bar above and we'll create a custom AI recipe for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search Results or Trending Recipes */}
      {searchQuery.trim() ? (
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="text-[#047857]" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Recipes with: {searchQuery}
              </h2>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilters({ prepTime: 'all', difficulty: 'all', dietary: [] });
                setShowFilters(false);
              }}
              className="text-[#047857] font-semibold text-sm hover:text-[#065f46]"
            >
              Clear Search & Filters
            </button>
          </div>

          {/* Filter Toggle Button */}
          {filteredRecipes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#047857]"
                >
                  <span>🔍</span>
                  <span>Refine Results</span>
                  <span className="text-xs">{showFilters ? '▲' : '▼'}</span>
                </button>

                {/* Show active filters */}
                {filters.dietary.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Active:</span>
                    <div className="flex gap-1">
                      {filters.dietary.map(diet => (
                        <span key={diet} className="px-2 py-1 bg-[#047857] text-white text-xs rounded-full">
                          {diet.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Chips - Collapsible */}
              {showFilters && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
                  {/* Prep Time Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">PREP TIME</label>
                    <div className="flex flex-wrap gap-2">
                      {['all', '15', '30', '45+'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setFilters({...filters, prepTime: time})}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.prepTime === time
                              ? 'bg-[#047857] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time === 'all' ? 'Any' : `${time} min`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">DIFFICULTY</label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'easy', 'medium', 'hard'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setFilters({...filters, difficulty: level})}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            filters.difficulty === level
                              ? 'bg-[#047857] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level === 'all' ? 'Any' : level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">DIETARY</label>
                    <div className="flex flex-wrap gap-2">
                      {['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto'].map((diet) => {
                        const isSelected = filters.dietary.includes(diet.toLowerCase());
                        return (
                          <button
                            key={diet}
                            onClick={() => {
                              if (isSelected) {
                                setFilters({
                                  ...filters,
                                  dietary: filters.dietary.filter(d => d !== diet.toLowerCase())
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  dietary: [...filters.dietary, diet.toLowerCase()]
                                });
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-[#047857] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {diet}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex gap-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setFilters({ prepTime: 'all', difficulty: 'all', dietary: [] })}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>

                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoadingRecipes ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onMouseDown={() => {
                    console.log('🔵 MOUSEDOWN - scroll:', window.scrollY);
                  }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all active:scale-95 border border-gray-100 cursor-pointer"
                >
                  <div className="relative h-40 bg-white flex items-center justify-center overflow-hidden rounded-t-2xl">
                    {recipe.imageUrl || recipe.image ? (
                      <img
                        src={getRecipeImage(recipe, import.meta.env.DEV)}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    {/* Heart Save Button */}
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (isSaved(recipe.id)) {
                          await unsaveRecipe(recipe.id);
                        } else {
                          await saveRecipe(recipe.id);
                        }
                      }}
                      aria-label={`${isSaved(recipe.id) ? 'Remove' : 'Save'} ${recipe.name} to favorites`}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <Heart className={`w-4 h-4 ${isSaved(recipe.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                    </button>
                    {recipe.cookTime && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        ⏰ {formatCookTime(recipe.cookTime)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 text-left">
                      {recipe.name}
                    </h3>
                    {recipe.cuisine && (
                      <p className="text-xs text-gray-500 mt-1">{recipe.cuisine}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No recipes found with those ingredients.</p>
              <button
                onClick={() => setShowAiPrompt(true)}
                className="bg-gradient-to-r from-[#047857] to-[#065f46] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
              >
                Generate Recipe with AI →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-[#047857]" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <button
              onClick={() => navigate('/generate')}
              className="text-[#047857] font-semibold text-sm hover:text-[#065f46]"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {featuredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all active:scale-95 border border-gray-100 cursor-pointer"
                >
                  <div className="relative h-40 bg-white flex items-center justify-center overflow-hidden rounded-t-2xl">
                    {recipe.imageUrl || recipe.image ? (
                      <img
                        src={getRecipeImage(recipe, import.meta.env.DEV)}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    {/* Heart Save Button */}
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (isSaved(recipe.id)) {
                          await unsaveRecipe(recipe.id);
                        } else {
                          await saveRecipe(recipe.id);
                        }
                      }}
                      aria-label={`${isSaved(recipe.id) ? 'Remove' : 'Save'} ${recipe.name} to favorites`}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <Heart className={`w-4 h-4 ${isSaved(recipe.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                    </button>
                    {recipe.cookTime && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        ⏰ {formatCookTime(recipe.cookTime)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 text-left">
                      {recipe.name}
                    </h3>
                    {recipe.cuisine && (
                      <p className="text-xs text-gray-500 mt-1">{recipe.cuisine}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Generation Prompt - Show when button clicked */}
      {showAiPrompt && (
        <div className="px-6 mb-8">
          <Suspense fallback={<div className="text-center py-8">Loading AI generator...</div>}>
            <AiGenerationPrompt
              searchTerm={searchQuery}
              onRecipeGenerated={(recipe) => {
                setSelectedRecipe(recipe);
                setShowAiPrompt(false);
                setSearchQuery("");
              }}
            />
          </Suspense>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 pb-24"
            style={{ marginTop: '-5%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Help & Tips</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Search */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🔍 SEARCH
                </h3>
                <p className="text-sm text-gray-600">
                  Type ingredients to find matching recipes. If nothing matches, we'll create a custom AI recipe for you. Separate multiple ingredients with commas.
                </p>
              </div>

              {/* Save Recipes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  ❤️ SAVE RECIPES
                </h3>
                <p className="text-sm text-gray-600">
                  Tap the heart icon on any recipe to save it. Find all your favorites under 'My Kitchen' → 'Saved Recipes'.
                </p>
              </div>

              {/* Meal Planning */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  📅 MEAL PLANNING
                </h3>
                <p className="text-sm text-gray-600">
                  Use Meal Plans to organize your week. Drag recipes to specific days and auto-generate shopping lists.
                </p>
              </div>

              {/* Pantry */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🥫 PANTRY
                </h3>
                <p className="text-sm text-gray-600">
                  Add items manually or scan the barcode on any ingredient. We'll track what you have so you don't buy duplicates.
                </p>
              </div>

              {/* Shopping */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🛒 SHOPPING
                </h3>
                <p className="text-sm text-gray-600">
                  Generate shopping lists from meal plans. Shop through Instacart in-app or use our list at the store - check off items as you go.
                </p>
              </div>

              {/* Voice Control */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🎤 VOICE CONTROL
                </h3>
                <p className="text-sm text-gray-600">
                  In Cooking Mode, say 'Quick Dish Next' or 'Quick Dish Repeat'. Perfect when your hands are messy!
                </p>
              </div>

              {/* AI Recipes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  ✨ AI RECIPES
                </h3>
                <p className="text-sm text-gray-600">
                  Can't find what you want? Just search your ingredients - if we don't have a match, AI creates a recipe automatically.
                </p>
              </div>

              {/* Cooking Mode */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  ⏱️ COOKING MODE
                </h3>
                <p className="text-sm text-gray-600">
                  Timers auto-detect from recipe steps. Enable voice control for hands-free cooking. If your phone keeps beeping, find your sound notifications and turn them down, so you only hear the voice speaking.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-slide-up">
          <RecipeDetail 
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Index;
