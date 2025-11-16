import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { Search, Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useToast } from "@/hooks/use-toast";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { recipeStorage } from "@/utils/recipeStorage";
import { Recipe } from "@/types/recipe";
import { useAllRecipes } from "@/hooks/useAllRecipes";
import { useGeneratedRecipes } from "@/hooks/useGeneratedRecipes";
import { useVerifiedRecipes } from "@/hooks/useVerifiedRecipes";
import { LoadingScreen } from "@/components/LoadingScreen";
import { getRecipeImage } from "@/utils/recipeImages";

const AiGenerationPrompt = lazy(() => import("@/components/AiGenerationPrompt").then(m => ({ default: m.AiGenerationPrompt })));

// Map collection name to category ID (moved outside component to prevent recreation on every render)
const collectionToCategoryId: { [key: string]: string } = {
  'Fall Favorites': 'fall',
  'Quick and Easy': 'quick',
  'Clean Eats': 'cleaneats',
  'Restaurant Copycats': 'copycat',
  'Breakfast': 'breakfast',
  'Desserts': 'dessert',
  'One Pot Meals': 'onepot',
  'Leftover Magic': 'leftover',
  'Family Approved': 'family'
};

const Generate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateToRecipe } = useSmartNavigation();
  const { toast } = useToast();
  const { saveRecipe, isSaved } = useSavedRecipes();
  const { allRecipes, isLoading: isLoadingRecipes } = useAllRecipes();
  const { generatedRecipes, refetch: refetchGeneratedRecipes } = useGeneratedRecipes();
  const { verifiedRecipes } = useVerifiedRecipes();
  
  // Enable scroll restoration for this page
  useScrollRestoration();
  
  // Search overlay state
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string | undefined>(undefined);
  
  // Input states - what user is typing/selecting (doesn't filter)
  const [searchInput, setSearchInput] = useState("");
  const [searchMode, setSearchMode] = useState<'search' | 'ingredients'>('search');
  const [ingredientInput, setIngredientInput] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  
  // Applied filters - what's actually filtering recipes (only updates on button click)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    category: 'all',
    difficulty: 'all',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilteredView, setShowFilteredView] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchDebounceRef = useRef<number | null>(null);
  const [, setRecentSearches] = useState<string[]>([]);
 
  // Keep searchQuery for backward compatibility with sessionStorage
  const searchQuery = searchInput;
  const setSearchQuery = setSearchInput;

  // Combine recipes, deduplicating by recipe_id and prioritizing DB recipes over static ones
  type RecipeWithCategory = Recipe & { category?: string };

  const combinedRecipes: RecipeWithCategory[] = (() => {
    const recipeMap = new Map<string, RecipeWithCategory>();
    
    // Add static recipes first
    allRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe as RecipeWithCategory);
    });
    
    // Override with verified DB recipes (these have priority)
    verifiedRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe as RecipeWithCategory);
    });
    
    // Add user's generated recipes
    generatedRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe as RecipeWithCategory);
    });
    
    // Exclude AI-generated recipes from discovery dataset
    const recipes = Array.from(recipeMap.values()).filter(r => !(r as any).isAiGenerated);
    
    return recipes;
  })();

  // Check for collection filter from URL (moved before useEffect that uses it)
  const collectionParam = searchParams.get('collection');
  const ingredientsParam = searchParams.get('ingredients');

  // Restore search/filter state from sessionStorage on mount
  useEffect(() => {
    const savedSearch = sessionStorage.getItem('discover_search');
    const savedCategory = sessionStorage.getItem('discover_category');
    const savedDifficulty = sessionStorage.getItem('discover_difficulty');
    const savedIngredientInput = sessionStorage.getItem('discover_ingredient');
    const savedFilters = sessionStorage.getItem('discover_filters');
    const savedActiveFilters = sessionStorage.getItem('discover_activeFilters');
    const savedSearchMode = sessionStorage.getItem('discover_searchMode');
    
    if (savedSearch) {
      setSearchInput(savedSearch);
      setAppliedFilters(prev => ({ ...prev, search: savedSearch }));
      setShowFilteredView(true); // Keep search results view when returning to page
    }
    // Don't restore category from sessionStorage if there's a collectionParam in URL
    // The URL param should take precedence
    if (savedCategory && !collectionParam) {
      setAppliedFilters(prev => ({ ...prev, category: savedCategory }));
    }
    if (savedDifficulty) {
      setAppliedFilters(prev => ({ ...prev, difficulty: savedDifficulty }));
    }
    if (savedIngredientInput) setIngredientInput(savedIngredientInput);
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters));
      } catch (e) {
        // Ignore parse errors
      }
    }
    if (savedActiveFilters) {
      try {
        const parsed = JSON.parse(savedActiveFilters);
        setActiveFilters(parsed);
        // If we have active filters, show filtered view
        if (parsed.length > 0 || savedSearch || savedIngredientInput) {
          setShowFilteredView(true);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    if (savedSearchMode === 'search' || savedSearchMode === 'ingredients') {
      setSearchMode(savedSearchMode);
    }
    
    // Restore search modal state if it was open
    const wasModalOpen = sessionStorage.getItem('searchModalOpen');
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    if (wasModalOpen === 'true') {
      setShowSearchOverlay(true);
      // Restore search term (can be empty string if only filters were applied)
      if (savedSearchTerm) {
        setSearchInput(savedSearchTerm);
        setAppliedSearchTerm(savedSearchTerm);
        setAppliedFilters(prev => ({ ...prev, search: savedSearchTerm }));
      } else {
        // No search term but modal was open - might have filters applied
        setAppliedSearchTerm('');
      }
      // Restore filters if they exist
      const savedFilters = sessionStorage.getItem('discover_filters');
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(parsedFilters);
        } catch (e) {
          // Ignore parse errors
        }
      }
      // Scroll position restoration is now handled in SearchOverlay component
      // via useEffect that watches isOpen and appliedSearchTerm
    } else {
      // If not coming from search modal, clear any search state
      // This ensures Discover page shows default carousels, not filtered results
      setSearchInput('');
      setAppliedSearchTerm(undefined);
      setAppliedFilters(prev => ({ ...prev, search: '' }));
      setShowFilteredView(false);
      // Clear search-related sessionStorage
      sessionStorage.removeItem('discover_search');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - collectionParam check is safe here

  // Save search/filter state to sessionStorage whenever they change
  useEffect(() => {
    if (searchQuery || showFilteredView) {
      sessionStorage.setItem('discover_search', searchQuery);
    } else {
      sessionStorage.removeItem('discover_search');
    }
  }, [searchQuery, showFilteredView]);

  useEffect(() => {
    if (ingredientInput || showFilteredView) {
      sessionStorage.setItem('discover_ingredient', ingredientInput);
    } else {
      sessionStorage.removeItem('discover_ingredient');
    }
  }, [ingredientInput, showFilteredView]);

  useEffect(() => {
    if (filters.length > 0) {
      sessionStorage.setItem('discover_filters', JSON.stringify(filters));
    } else {
      sessionStorage.removeItem('discover_filters');
    }
  }, [filters]);

  useEffect(() => {
    if (activeFilters.length > 0) {
      sessionStorage.setItem('discover_activeFilters', JSON.stringify(activeFilters));
    } else {
      sessionStorage.removeItem('discover_activeFilters');
    }
  }, [activeFilters]);

  useEffect(() => {
    sessionStorage.setItem('discover_searchMode', searchMode);
  }, [searchMode]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    const trimmed = searchInput.trim();

    if (!trimmed) {
      setSearchLoading(false);
      setAppliedFilters(prev => ({ ...prev, search: '' }));
      return;
    }

    setSearchLoading(true);

    searchDebounceRef.current = window.setTimeout(() => {
      setAppliedFilters(prev => ({ ...prev, search: trimmed }));
      setSearchLoading(false);
      setRecentSearches(prev => {
        if (!trimmed) return prev;
        const next = [trimmed, ...prev.filter(item => item !== trimmed)];
        return next.slice(0, 5);
      });
    }, 500);

    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchInput]);

  // Clear search state when modal closes (but not on initial mount)
  const prevModalOpenRef = useRef(showSearchOverlay);
  useEffect(() => {
    // Only clear if modal was open and is now closed (not on initial mount)
    if (prevModalOpenRef.current && !showSearchOverlay) {
      // Modal was just closed - clear search state
      // This ensures Discover page shows default carousels, not filtered results
      setAppliedSearchTerm(undefined);
      setSearchInput('');
      setAppliedFilters(prev => ({ ...prev, search: '' }));
      setShowFilteredView(false);
      // Clear modal-related sessionStorage
      sessionStorage.removeItem('searchModalOpen');
      sessionStorage.removeItem('searchTerm');
      sessionStorage.removeItem('searchModalScroll');
      sessionStorage.removeItem('discover_search');
    }
    prevModalOpenRef.current = showSearchOverlay;
  }, [showSearchOverlay]);

  // Clear sessionStorage when user intentionally navigates away (not to recipe detail)
  useEffect(() => {
    const path = location.pathname;
    if (!path.includes('/recipe/') && !path.includes('/discover')) {
      // User navigated away from discover/recipe pages
      sessionStorage.removeItem('discover_search');
      sessionStorage.removeItem('discover_ingredient');
      sessionStorage.removeItem('discover_filters');
      sessionStorage.removeItem('discover_activeFilters');
      sessionStorage.removeItem('discover_scroll');
    }
  }, [location.pathname]);
  
  // Initialize category filter from URL collection param ONCE on mount/URL change
  // This syncs the category state with the URL param
  // NOTE: collectionParam does NOT set showFilteredView - collections are handled separately
  useEffect(() => {
    if (collectionParam) {
      const categoryId = collectionToCategoryId[collectionParam];
      if (categoryId) {
        // Only update if different to avoid unnecessary re-renders
        setAppliedFilters(prev => {
          if (prev.category !== categoryId) {
            return { ...prev, category: categoryId };
          }
          return prev; // Return same object if no change to prevent re-render
        });
        // DON'T set showFilteredView here - collection view is handled separately
      }
    }
    // Don't clear category here - let handleClearFilters handle that explicitly
    // This prevents race conditions with state updates
  }, [collectionParam]); // Only depend on collectionParam - collectionToCategoryId is constant
  
  // Load all recipes into storage on mount
  useEffect(() => {
    const existingRecipes = recipeStorage.getRecipes();
    const existingIds = new Set(existingRecipes.map(r => r.id));
    const newRecipes = allRecipes.filter(r => !existingIds.has(r.id));
    
    if (newRecipes.length > 0) {
      recipeStorage.setRecipes([...existingRecipes, ...newRecipes]);
    }
  }, [allRecipes]);

  // Only show loading screen if actually loading AND no recipes at all
  // Don't block carousel view if we have some recipes
  // IMPORTANT: This check must come AFTER all hooks to avoid "Rendered more hooks" error
  if (isLoadingRecipes && combinedRecipes.length === 0) {
    return <LoadingScreen message="Loading recipes..." delay={300} />;
  }

  // Recipe categories for horizontal sections
  const categories = [
    { id: 'fall', name: 'Fall Favorites' },
    { id: 'quick', name: 'Quick and Easy' },
    { id: 'cleaneats', name: 'Clean Eats' },
    { id: 'copycat', name: 'Restaurant Copycats' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'onepot', name: 'One Pot Meals' },
    { id: 'family', name: 'Family Approved' }
  ];

  // Function to get recipes for each category
  const getRecipesByCategory = (categoryId: string): Recipe[] => {
    switch (categoryId) {
      // --- TAG-BASED FILTERS ---
      case 'quick': // For "Quick and Easy"
        return combinedRecipes.filter(r => r.tags?.includes('quick'));
      case 'onepot': // For "One Pot Meals"
        return combinedRecipes.filter(r => r.tags?.includes('one-pot'));
      case 'family': // For "Family Approved"
        return combinedRecipes.filter(r =>
          r.tags?.includes('family-friendly') || r.tags?.includes('kid-friendly')
        );

      // --- CATEGORY-BASED FILTERS ---
      case 'fall': // For "Fall Favorites"
        return combinedRecipes.filter(r => r.category === 'Fall Favorites');
      case 'cleaneats': // For "Clean Eats"
        return combinedRecipes.filter(r => r.category === 'Clean Eats');
      case 'breakfast': // For "Breakfast"
        return combinedRecipes.filter(r => r.category === 'Breakfast');
      case 'dessert': // For "Desserts"
        return combinedRecipes.filter(r => r.category === 'Desserts');
      case 'copycat': // For "Restaurant Copycats"
        return combinedRecipes.filter(r => r.category === 'Restaurant Copycats');
       
      default:
        return [];
    }
  };

  // Helper function to handle category button clicks
  const handleCategoryClick = (category: { id: string; name: string }) => {
    console.log('Category clicked:', category.id, category.name);
    console.log('Current appliedFilters.category:', appliedFilters.category);
    console.log('Current collectionParam:', collectionParam);
    console.log('Current appliedFilters.search:', appliedFilters.search);
    
    // Only treat as "search active" if there's actually a search term
    const hasActiveSearch = appliedFilters.search && appliedFilters.search.trim();
    
    if (hasActiveSearch) {
      // If search is active, set category in state and clear URL param
      console.log('Search is active, setting category in state:', category.id);
      setAppliedFilters(prev => {
        console.log('Setting category in state:', category.id);
        return { ...prev, category: category.id };
      });
      setShowFilteredView(true);
      sessionStorage.setItem('discover_category', category.id);
      // Clear collection param from URL to prevent useEffect from resetting
      if (collectionParam) {
        navigate('/discover', { replace: true });
      }
      // Scroll to top to show filtered results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If no search, navigate to collection URL AND immediately update category state
      // This ensures the category updates even if URL navigation is delayed
      console.log('No search, navigating to collection URL:', category.name);
      const categoryId = collectionToCategoryId[category.name] || category.id;
      setAppliedFilters(prev => ({ ...prev, category: categoryId }));
      navigate(`/discover?collection=${encodeURIComponent(category.name)}`, { replace: true });
      window.scrollTo(0, 0);
    }
  };

  // Helper function to get category display name from category ID
  const getCategoryDisplayName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleClearFilters = () => {
    console.log('Clear filters clicked');
    setSearchInput('');
    setIngredientInput('');
    setFilters([]);
    setAppliedFilters({ search: '', category: 'all', difficulty: 'all' });
    setActiveFilters([]);
    setShowFilteredView(false);
    setAppliedSearchTerm(undefined); // Clear applied search term in modal
    
    // Clear sessionStorage
    sessionStorage.removeItem('discover_search');
    sessionStorage.removeItem('searchModalOpen');
    sessionStorage.removeItem('searchTerm');
    sessionStorage.removeItem('searchModalScroll');
    sessionStorage.removeItem('discover_category');
    sessionStorage.removeItem('discover_ingredient');
    sessionStorage.removeItem('discover_filters');
    sessionStorage.removeItem('discover_activeFilters');
    sessionStorage.removeItem('discover_scroll');
    
    // Clear URL params - this will trigger useEffect to clear category
    navigate('/discover', { replace: true });
  };

  const clearFilters = handleClearFilters; // Keep for backward compatibility

  const removeFilter = (filter: string) => {
    setFilters(prev => prev.filter(f => f !== filter));
    setActiveFilters(prev => prev.filter(f => f !== filter));
    
    // If no filters left, exit filtered view
    if (filters.length <= 1 && !searchQuery && !ingredientInput) {
      setShowFilteredView(false);
    }
  };

  const handleApplyFilters = () => {
    // Copy current input state to applied filters
    const trimmedSearch = searchInput.trim();
    setAppliedFilters({
      search: trimmedSearch,
      category: 'all', // TODO: Add category selection if needed
      difficulty: 'all', // TODO: Add difficulty selection if needed
    });
    setActiveFilters([...filters]);
    
    // Set appliedSearchTerm for modal (keeps modal open with results)
    // Always set it to the trimmed search term (even if empty, so filters can work)
    // Only use undefined if both search and filters are empty
    if (trimmedSearch) {
      // Has search term - set it
      setAppliedSearchTerm(trimmedSearch);
    } else if (filters.length > 0) {
      // No search term but has filters - use empty string so filters work
      setAppliedSearchTerm('');
    } else {
      // Neither search nor filters - reset to undefined
      setAppliedSearchTerm(undefined);
    }
    
    // Only show filtered view on main page if modal is NOT open
    // If modal is open, results should stay inside the modal
    if (!showSearchOverlay) {
      setShowFilteredView(true);
    }
    
    // Save to sessionStorage
    sessionStorage.setItem('discover_search', trimmedSearch);
    sessionStorage.setItem('discover_category', 'all');
    sessionStorage.setItem('discover_difficulty', 'all');
    
    // Save modal state if search is active or filters are applied
    if (trimmedSearch || filters.length > 0) {
      sessionStorage.setItem('searchModalOpen', 'true');
      sessionStorage.setItem('searchTerm', trimmedSearch || '');
    }
    
    // Save scroll position before showing filtered results (only if not in modal)
    if (!showSearchOverlay) {
      sessionStorage.setItem('discover_scroll', window.scrollY.toString());
    }
  };

  const handleSearch = handleApplyFilters; // Keep for backward compatibility

  const handleSeeAll = (categoryName: string) => {
    navigate(`/discover?collection=${encodeURIComponent(categoryName)}`);
  };

  const addToFavorites = async (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSaved(recipe.id)) {
      toast({
        title: "Recipe already in your favorites!",
      });
      return;
    }
    
    await saveRecipe(recipe.id);
  };

  // Filter recipes by ingredients from URL param (AND logic - must have ALL ingredients with word boundaries)
  const filterByIngredients = (recipes: Recipe[], query: string) => {
    if (!query) return recipes;

    const searchTerms = query
      .toLowerCase()
      .split(/[\s,]+/)
      .map(term => term.trim())
      .filter(term => term.length > 0);

    if (searchTerms.length === 0) return recipes;

    return recipes.filter(recipe =>
      searchTerms.every(term => {
        const nameMatch = (recipe.name || '').toLowerCase().includes(term);
        const ingredientMatch = recipe.ingredients?.some(ing => ing.item?.toLowerCase().includes(term));
        const tagMatch = recipe.tags?.some(tag => tag.toLowerCase().includes(term));
        const cuisineMatch = (recipe.cuisine || '').toLowerCase().includes(term);
        return Boolean(nameMatch || ingredientMatch || tagMatch || cuisineMatch);
      })
    );
  };

  const filteredRecipes = useMemo(() => {
    const searchTerm = appliedFilters.search?.trim().toLowerCase() || '';
    const searchTerms = searchTerm ? searchTerm.split(/[\s,]+/).map(term => term.trim()).filter(Boolean) : [];

    const isHalloweenRecipe = (recipe: Recipe) =>
      recipe.cuisine?.toLowerCase() === 'halloween' ||
      recipe.tags?.some(tag => tag.toLowerCase() === 'halloween');

    // Start with all recipes - we'll apply filters sequentially
    let results: RecipeWithCategory[] = [...combinedRecipes];

    // Apply search filter first (if present)
    if (searchTerms.length > 0) {
      results = results.filter(recipe => {
        if (isHalloweenRecipe(recipe)) return false;
        
        const matchesSearch = searchTerms.every(term => {
          const nameMatch = (recipe.name || '').toLowerCase().includes(term);
          const ingredientMatch = recipe.ingredients?.some(ing => ing.item?.toLowerCase().includes(term));
          const tagMatch = recipe.tags?.some(tag => tag.toLowerCase().includes(term));
          const cuisineMatch = (recipe.cuisine || '').toLowerCase().includes(term);
          return Boolean(nameMatch || ingredientMatch || tagMatch || cuisineMatch);
        });
        
        return matchesSearch;
      });
    }

    // Then apply category filter (if present and not 'all')
    if (appliedFilters.category && appliedFilters.category !== 'all') {
      results = results.filter(recipe => {
        // Handle tag-based categories
        if (appliedFilters.category === 'quick') {
          return recipe.tags?.includes('quick');
        }
        if (appliedFilters.category === 'onepot') {
          return recipe.tags?.includes('one-pot');
        }
        if (appliedFilters.category === 'family') {
          return recipe.tags?.includes('family-friendly') || recipe.tags?.includes('kid-friendly');
        }
        // Handle category-based filters - map category ID to category name
        const categoryMapping: Record<string, string> = {
          'fall': 'Fall Favorites',
          'cleaneats': 'Clean Eats',
          'breakfast': 'Breakfast',
          'dessert': 'Desserts',
          'copycat': 'Restaurant Copycats',
        };
        const categoryName = categoryMapping[appliedFilters.category] || appliedFilters.category;
        return recipe.category === categoryName;
      });
    }

    // Apply difficulty filter
    if (appliedFilters.difficulty && appliedFilters.difficulty !== 'all') {
      results = results.filter(recipe => 
        recipe.difficulty?.toLowerCase() === appliedFilters.difficulty.toLowerCase()
      );
    }

    // Apply active filters (time, dietary, etc.)
    if (activeFilters.length > 0) {
      results = results.filter(recipe => {
        const meetsFilters = activeFilters.every(filter => {
          if (filter === 'Under 30min') {
            const totalTime = (parseInt(recipe.prepTime) || 0) + (parseInt(recipe.cookTime) || 0);
            return totalTime <= 30;
          }
          if (filter === '30-60min') {
            const totalTime = (parseInt(recipe.prepTime) || 0) + (parseInt(recipe.cookTime) || 0);
            return totalTime > 30 && totalTime <= 60;
          }

          if (['Easy', 'Medium', 'Hard'].includes(filter)) {
            return recipe.difficulty?.toLowerCase() === filter.toLowerCase();
          }

          const normalizedFilter = filter.toLowerCase().replace(/\s+/g, '-').replace('gluten-free', 'glutenfree');
          return recipe.tags?.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === normalizedFilter) || false;
        });

        return meetsFilters;
      });
    }

    // Filter out Halloween recipes if not already filtered
    if (searchTerms.length === 0) {
      results = results.filter(recipe => !isHalloweenRecipe(recipe));
    }

    // Apply ingredient param filter if present
    if (ingredientsParam) {
      return filterByIngredients(results, ingredientsParam);
    }

    return results;
  }, [
    combinedRecipes,
    appliedFilters.search,
    appliedFilters.category,
    appliedFilters.difficulty,
    activeFilters,
    ingredientsParam,
    ingredientInput
  ]);

  // Determine if we should show filtered view (search/filters active, NOT just collections)
  // showFilteredView should only be true when there's actual search/filter activity
  // AND modal is NOT open (if modal is open, results stay in modal)
  const shouldShowFilteredView = Boolean(
    !showSearchOverlay && ( // Don't show filtered view on main page if modal is open
      (appliedFilters.search && appliedFilters.search.trim()) ||
      (activeFilters.length > 0) ||
      (ingredientInput && ingredientInput.trim()) ||
      ingredientsParam
    )
  );

  // Image preloading to prevent flashing on first load
  useEffect(() => {
    if (!combinedRecipes || combinedRecipes.length === 0) return;

    // Preload first 12 images (visible on screen)
    const imagesToPreload = combinedRecipes.slice(0, 12).map(r => getRecipeImage(r, import.meta.env.DEV));

    Promise.all(
      imagesToPreload.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error
        });
      })
    ).then(() => {
      setImagesLoaded(true);
    });
  }, [combinedRecipes]);

  // Restore scroll position after filtered view is shown and results have rendered
  const scrollRestoredRef = useRef(false);
  useEffect(() => {
    if (shouldShowFilteredView && !scrollRestoredRef.current) {
      const savedScroll = sessionStorage.getItem('discover_scroll');
      if (savedScroll) {
        const scrollValue = parseInt(savedScroll, 10);
        if (!isNaN(scrollValue) && scrollValue > 0) {
          // Wait for filtered results to calculate and render before scrolling
          // Use requestAnimationFrame for smooth, non-blocking scroll
          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollValue, behavior: 'instant' });
          });
          
          // Additional attempts with longer delays to ensure content is fully rendered
          setTimeout(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollValue, behavior: 'instant' });
            });
          }, 300);
          
          // Final attempt after all content should be loaded
          setTimeout(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollValue, behavior: 'instant' });
            });
          }, 500);
          
          scrollRestoredRef.current = true;
        }
      }
    }
    
    // Reset scroll restored flag when filtered view changes
    if (!shouldShowFilteredView) {
      scrollRestoredRef.current = false;
    }
  }, [shouldShowFilteredView, imagesLoaded]);
  
  // If viewing filtered search results or ingredient search from home
  // Only show filtered view if there's actual search/filter activity AND no collection param
  if (shouldShowFilteredView && !collectionParam) {
    return (
      <div className="min-h-screen pb-20 bg-background">
        <SearchOverlay
          isOpen={showSearchOverlay}
          onClose={() => {
            setShowSearchOverlay(false);
            setAppliedSearchTerm(undefined);
            // Clear all search state when modal closes
            setSearchInput('');
            setAppliedFilters(prev => ({ ...prev, search: '' }));
            setShowFilteredView(false);
            // Clear all modal-related sessionStorage when manually closed
            sessionStorage.removeItem('searchModalOpen');
            sessionStorage.removeItem('searchTerm');
            sessionStorage.removeItem('searchModalScroll');
            sessionStorage.removeItem('discover_search');
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          appliedSearchTerm={appliedSearchTerm}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          ingredientInput={ingredientInput}
          setIngredientInput={setIngredientInput}
          filters={filters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          onSearch={handleSearch}
          recipes={combinedRecipes}
          onAddToFavorites={(recipe) => addToFavorites(recipe, { stopPropagation: () => {} } as any)}
          hideAiImages
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)', paddingBottom: '16px' }}>
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-0.5">Discover</h1>
              <p className="text-xs text-white/90">Explore recipes</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
              // Only open modal - don't trigger any searches or load recipes
              setShowSearchOverlay(true);
              // Clear appliedSearchTerm if opening fresh (not from sessionStorage restore)
              if (!sessionStorage.getItem('searchModalOpen')) {
                setAppliedSearchTerm(undefined);
              }
            }}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter Chips - Show when search is active */}
        {appliedFilters.search && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => {
                const isActive = appliedFilters.category === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`
                      shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors
                      ${isActive
                        ? 'bg-primary text-white border border-primary hover:bg-primary/90'
                        : 'bg-white border border-border text-[#2C3E50] hover:bg-primary hover:text-white'}
                    `}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {searchLoading && (
          <div className="px-4 pt-3">
            <p className="text-sm text-gray-500">Searching recipes...</p>
            {filteredRecipes.length > 0 && (
              <p className="text-xs text-gray-500">Found {filteredRecipes.length} recipes while searching...</p>
            )}
          </div>
        )}

        {!searchLoading && filteredRecipes.length === 0 && (
          <div className="px-4 pt-3">
            <p className="text-sm text-gray-500">No recipes matched your search. Try different keywords.</p>
          </div>
        )}

        {/* Active Filters */}
        {(activeFilters.length > 0 || appliedFilters.search || appliedFilters.category !== 'all' || ingredientInput || ingredientsParam) && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">
                {ingredientsParam ? 'Showing recipes with:' : 'Active Filters'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredientsParam && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  {ingredientsParam}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => navigate('/discover')}
                  />
                </Badge>
              )}
              {appliedFilters.search && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Search: {appliedFilters.search}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => {
                      setSearchInput('');
                      setAppliedFilters(prev => ({ ...prev, search: '' }));
                      sessionStorage.removeItem('discover_search');
                    }}
                  />
                </Badge>
              )}
              {appliedFilters.category && appliedFilters.category !== 'all' && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Category: {getCategoryDisplayName(appliedFilters.category)}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => {
                      setAppliedFilters(prev => ({ ...prev, category: 'all' }));
                      sessionStorage.removeItem('discover_category');
                    }}
                  />
                </Badge>
              )}
              {ingredientInput && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Ingredient: {ingredientInput}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => setIngredientInput('')}
                  />
                </Badge>
              )}
              {activeFilters.map(filter => (
                <Badge key={filter} variant="secondary" className="pl-3 pr-2 py-1.5">
                  {filter}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="px-4 py-6">
          {!imagesLoaded ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden">
                      <div className="w-full h-[220px] md:h-[160px] bg-gray-200 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="mt-2 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="mt-1 h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">
                No recipes found{searchInput ? ` for '${searchInput}'` : ''}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchInput
                  ? "Try checking your spelling or browse our categories"
                  : "Try different search terms or browse our categories"}
              </p>
              <Button
                size="lg"
                onClick={() => {
                  clearFilters();
                  navigate('/discover');
                }}
              >
                Browse Recipes
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredRecipes.length} recipes found
              </p>
              <div className="grid grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={(e) => {
                      e.preventDefault();
                      // Save scroll position before navigating to recipe
                      sessionStorage.setItem('discover_scroll', window.scrollY.toString());
                      navigateToRecipe(recipe.id, recipe);
                    }}
                    className="relative cursor-pointer"
                  >
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={getRecipeImage(recipe, import.meta.env.DEV)}
                        alt={recipe.name}
                          className="w-full h-[220px] md:h-[160px] object-cover"
                        loading="eager"
                        decoding="sync"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {recipe.isAiGenerated && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 left-2 text-xs bg-purple-500/90 text-white backdrop-blur-sm"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                      <button
                        type="button"
                        onClick={(e) => addToFavorites(recipe, e)}
                        aria-label={`Add ${recipe.name} to shopping list`}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Plus className="w-4 h-4 text-black" />
                      </button>
                    </div>
                    <p className="mt-2 font-medium text-sm line-clamp-2">
                      {recipe.name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // If viewing a specific collection, show grid view
  if (collectionParam) {
    const categoryId = collectionToCategoryId[collectionParam] || appliedFilters.category;
    
    // Apply category filter FIRST (always, even if search is active)
    // Use the same logic as the main filteredRecipes but for collection view
    let collectionRecipes: Recipe[] = [];
    if (categoryId === 'leftover') {
      collectionRecipes = combinedRecipes.filter(recipe =>
        recipe.cuisine?.toLowerCase().includes('leftover') || 
        recipe.tags?.includes('leftover') || 
        recipe.name?.toLowerCase().includes('leftover')
      );
    } else if (categoryId && categoryId !== 'all') {
      // Handle tag-based categories
      if (categoryId === 'quick') {
        collectionRecipes = combinedRecipes.filter(r => r.tags?.includes('quick'));
      } else if (categoryId === 'onepot') {
        collectionRecipes = combinedRecipes.filter(r => r.tags?.includes('one-pot'));
      } else if (categoryId === 'family') {
        collectionRecipes = combinedRecipes.filter(r =>
          r.tags?.includes('family-friendly') || r.tags?.includes('kid-friendly')
        );
      } else {
        // Handle category-based filters - map category ID to category name
        const categoryMapping: Record<string, string> = {
          'fall': 'Fall Favorites',
          'cleaneats': 'Clean Eats',
          'breakfast': 'Breakfast',
          'dessert': 'Desserts',
          'copycat': 'Restaurant Copycats',
        };
        const categoryName = categoryMapping[categoryId] || categoryId;
        collectionRecipes = combinedRecipes.filter(recipe => recipe.category === categoryName);
      }
    } else {
      collectionRecipes = combinedRecipes;
    }

    // Then apply search filter on top of category (if search is active)
    // This combines both filters: category + search
    const filteredRecipes = collectionRecipes.filter(recipe => {
      // Search filter: Match ALL words (AND logic)
      if (appliedFilters.search && appliedFilters.search.trim()) {
        const searchTerms = appliedFilters.search
          .toLowerCase()
          .split(/[\s,]+/)
          .map(term => term.trim())
          .filter(term => term.length > 0);
        
        // Require ALL search terms to match
        const allTermsMatch = searchTerms.every(term => {
          const matchesName = (recipe.name || '').toLowerCase().includes(term);
          const matchesIngredients = recipe.ingredients?.some(ing => 
            ing.item?.toLowerCase().includes(term)
          );
          const matchesTags = recipe.tags?.some(tag => tag.toLowerCase().includes(term));
          const matchesCuisine = (recipe.cuisine || '').toLowerCase().includes(term);
          return matchesName || matchesIngredients || matchesTags || matchesCuisine;
        });
        
        if (!allTermsMatch) return false;
      }
      
      // Apply active filters (time, dietary, etc.)
      if (activeFilters.length > 0) {
        const meetsFilters = activeFilters.every(filter => {
          if (filter === 'Under 30min') {
            const totalTime = (parseInt(recipe.prepTime) || 0) + (parseInt(recipe.cookTime) || 0);
            return totalTime <= 30;
          }
          if (filter === '30-60min') {
            const totalTime = (parseInt(recipe.prepTime) || 0) + (parseInt(recipe.cookTime) || 0);
            return totalTime > 30 && totalTime <= 60;
          }
          
          if (['Easy', 'Medium', 'Hard'].includes(filter)) {
            return recipe.difficulty?.toLowerCase() === filter.toLowerCase();
          }
          
          const normalizedFilter = filter.toLowerCase().replace(/\s+/g, '-').replace('gluten-free', 'glutenfree');
          return recipe.tags?.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === normalizedFilter) || false;
        });
        
        if (!meetsFilters) return false;
      }
      
      return true;
    });

    return (
      <div className="min-h-screen pb-20 bg-background">
        <SearchOverlay
          isOpen={showSearchOverlay}
          onClose={() => setShowSearchOverlay(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          ingredientInput={ingredientInput}
          setIngredientInput={setIngredientInput}
          filters={filters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          onSearch={handleSearch}
          recipes={allRecipes}
          onAddToFavorites={(recipe) => addToFavorites(recipe, { stopPropagation: () => {} } as any)}
          hideAiImages
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)', paddingBottom: '16px' }}>
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-0.5">Discover</h1>
              <p className="text-xs text-white/90">Explore recipes</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
              // Only open modal - don't trigger any searches or load recipes
              setShowSearchOverlay(true);
              // Clear appliedSearchTerm if opening fresh (not from sessionStorage restore)
              if (!sessionStorage.getItem('searchModalOpen')) {
                setAppliedSearchTerm(undefined);
              }
            }}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => {
              const isActive = collectionParam === category.name || appliedFilters.category === category.id;
              return (
                <button
                   key={category.id}
                   onClick={() => handleCategoryClick(category)}
                  className={`
                    shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors
                    ${isActive
                      ? 'bg-primary text-white border border-primary hover:bg-primary/90'
                      : 'bg-white border border-border text-[#2C3E50] hover:bg-primary hover:text-white'}
                  `}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {searchLoading && (
          <div className="px-4 pt-3">
            <p className="text-sm text-gray-500">Searching recipes...</p>
            {filteredRecipes.length > 0 && (
              <p className="text-xs text-gray-500">Found {filteredRecipes.length} recipes while searching...</p>
            )}
          </div>
        )}

        {!searchLoading && filteredRecipes.length === 0 && (
          <div className="px-4 pt-3">
            <p className="text-sm text-gray-500">No recipes matched your search. Try different keywords.</p>
          </div>
        )}

        {/* Active Filters */}
        {(activeFilters.length > 0 || appliedFilters.search || appliedFilters.category !== 'all' || ingredientInput || ingredientsParam) && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">
                {ingredientsParam ? 'Showing recipes with:' : 'Active Filters'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredientsParam && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  {ingredientsParam}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => navigate('/discover')}
                  />
                </Badge>
              )}
              {appliedFilters.search && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Search: {appliedFilters.search}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => {
                      setSearchInput('');
                      setAppliedFilters(prev => ({ ...prev, search: '' }));
                      sessionStorage.removeItem('discover_search');
                    }}
                  />
                </Badge>
              )}
              {appliedFilters.category && appliedFilters.category !== 'all' && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Category: {getCategoryDisplayName(appliedFilters.category)}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => {
                      setAppliedFilters(prev => ({ ...prev, category: 'all' }));
                      sessionStorage.removeItem('discover_category');
                    }}
                  />
                </Badge>
              )}
              {ingredientInput && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                  Ingredient: {ingredientInput}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => setIngredientInput('')}
                  />
                </Badge>
              )}
              {activeFilters.map(filter => (
                <Badge key={filter} variant="secondary" className="pl-3 pr-2 py-1.5">
                  {filter}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="px-4 py-6">
          {!imagesLoaded ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden">
                      <div className="w-full h-[220px] md:h-[160px] bg-gray-200 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="mt-2 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="mt-1 h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">
                No recipes found{searchInput ? ` for '${searchInput}'` : ''}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchInput
                  ? "Try checking your spelling or browse our categories"
                  : "Try different search terms or browse our categories"}
              </p>
              <Button
                size="lg"
                onClick={() => {
                  clearFilters();
                  navigate('/discover');
                }}
              >
                Browse Recipes
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredRecipes.length} recipes found
              </p>
              <div className="grid grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={(e) => {
                      e.preventDefault();
                      // Save scroll position before navigating to recipe
                      sessionStorage.setItem('discover_scroll', window.scrollY.toString());
                      navigateToRecipe(recipe.id, recipe);
                    }}
                    className="relative cursor-pointer"
                  >
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={getRecipeImage(recipe, import.meta.env.DEV)}
                        alt={recipe.name}
                          className="w-full h-[220px] md:h-[160px] object-cover"
                        loading="eager"
                        decoding="sync"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {recipe.isAiGenerated && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 left-2 text-xs bg-purple-500/90 text-white backdrop-blur-sm"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                      <button
                        type="button"
                        onClick={(e) => addToFavorites(recipe, e)}
                        aria-label={`Add ${recipe.name} to shopping list`}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Plus className="w-4 h-4 text-black" />
                      </button>
                    </div>
                    <p className="mt-2 font-medium text-sm line-clamp-2">
                      {recipe.name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <SearchOverlay
        isOpen={showSearchOverlay}
        onClose={() => {
          setShowSearchOverlay(false);
          setAppliedSearchTerm(undefined);
          sessionStorage.removeItem('searchModalOpen');
          sessionStorage.removeItem('searchTerm');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        appliedSearchTerm={appliedSearchTerm}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        ingredientInput={ingredientInput}
        setIngredientInput={setIngredientInput}
        filters={filters}
        toggleFilter={toggleFilter}
        clearFilters={handleClearFilters}
        onSearch={handleSearch}
        recipes={allRecipes}
        onAddToFavorites={(recipe) => addToFavorites(recipe, { stopPropagation: () => {} } as any)}
        hideAiImages
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)', paddingBottom: '16px' }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-0.5">Discover</h1>
            <p className="text-xs text-white/90">Explore recipes</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Only open modal - don't trigger any searches or load recipes
              setShowSearchOverlay(true);
              // Clear appliedSearchTerm if opening fresh (not from sessionStorage restore)
              // This ensures modal opens empty until Apply Filters is clicked
              if (!sessionStorage.getItem('searchModalOpen')) {
                setAppliedSearchTerm(undefined);
              }
            }}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => {
            const isActive = collectionParam === category.name;
            return (
              <button
                 key={category.id}
                 onClick={() => handleCategoryClick(category)}
                className={`
                  shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors
                  ${isActive
                    ? 'bg-primary text-white border border-primary hover:bg-primary/90'
                    : 'bg-white border border-border text-[#2C3E50] hover:bg-primary hover:text-white'}
                `}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Default View: Horizontal Category Carousels */}
      <div className="space-y-8 pb-6">
        {categories
          .filter((category) => {
            const categoryRecipes = getRecipesByCategory(category.id);
            return categoryRecipes.length > 0;
          })
          .map((category, categoryIndex) => {
            const categoryRecipes = getRecipesByCategory(category.id).slice(0, 5);
            
            return (
              <div key={`category-${category.id}-${categoryIndex}`} className="space-y-3">
                <div className="px-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="text-sm text-primary hover:underline"
                  >
                    See all
                  </button>
                </div>
                <div className="px-4 overflow-x-auto scrollbar-hide -mx-4">
                  <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
                    {categoryRecipes.map((recipe, index) => (
                      <div
                        key={`${category.id}-recipe-${recipe.id}-${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        sessionStorage.setItem('discover_scroll', window.scrollY.toString());
                        navigateToRecipe(recipe.id, recipe);
                      }}
                      className="relative cursor-pointer flex-shrink-0"
                      style={{ width: '160px' }}
                    >
                      <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                        <img
                          src={getRecipeImage(recipe, import.meta.env.DEV)}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                          loading={index < 6 ? "eager" : "lazy"}
                          decoding="async"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToFavorites(recipe, e);
                          }}
                          aria-label={`Add ${recipe.name} to shopping list`}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <Plus className="w-4 h-4 text-black" />
                        </button>
                      </div>
                      <p className="mt-2 font-medium text-sm line-clamp-2">
                        {recipe.name}
                      </p>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default Generate;

