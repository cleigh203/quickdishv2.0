import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

interface NavigationContext {
  from?: string;
  searchQuery?: string;
  appliedSearch?: string;
  activeFilters?: string[];
  activeCategory?: string;
  categoryFilter?: any;
  showFilteredView?: boolean;
  restoreScroll?: number;
  scrollY?: number;
  recipe?: any;
  navigatedAt?: number;
  [key: string]: any; // Allow any additional context
}

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navigate to a recipe while preserving ALL current context
   * @param recipeId - The recipe ID to navigate to
   * @param recipe - Optional recipe object to pass
   * @param additionalState - Optional additional state to preserve (search, filters, etc.)
   */
  const navigateToRecipe = useCallback((recipeId: string, recipe?: any, additionalState?: Partial<NavigationContext>) => {
    // Capture CURRENT page state automatically
    const currentState = (location.state as NavigationContext) || {};
    
    // Capture current scroll position
    const scrollY = window.scrollY;
    
    // Determine where we're coming from based on pathname
    const pathname = location.pathname;
    const from = pathname.includes('/discover') || pathname.includes('/generate') ? '/discover' :
                 pathname.includes('/favorites') ? '/favorites' :
                 pathname.includes('/saved') ? '/saved' :
                 pathname.includes('/') && pathname !== '/' ? pathname :
                 '/discover';

    // Navigate with ALL context preserved
    navigate(`/recipe/${recipeId}`, {
      state: {
        recipe,
        from,
        scrollY,
        restoreScroll: scrollY, // Alias for compatibility
        // Preserve ALL existing state from current page
        ...currentState,
        // Merge in additional state (search, filters, etc.)
        ...additionalState,
        // Add timestamp to force state update
        navigatedAt: Date.now()
      }
    });
  }, [navigate, location]);

  /**
   * Go back to previous page with context restored
   */
  const goBack = useCallback(() => {
    const state = location.state as NavigationContext;
    
    if (state?.from) {
      // Navigate back to the page we came from
      const targetPath = state.from;
      
      // Prepare state to restore
      const restoreState: any = {
        restoreScroll: state.scrollY || state.restoreScroll || 0,
        // Preserve search and filter state
        searchQuery: state.searchQuery || state.appliedSearch,
        activeFilters: state.activeFilters,
        activeCategory: state.activeCategory,
        categoryFilter: state.categoryFilter,
        showFilteredView: state.showFilteredView,
      };

      // Preserve any other custom state (except internal fields)
      Object.keys(state).forEach(key => {
        if (!['from', 'recipe', 'navigatedAt', 'scrollY'].includes(key)) {
          restoreState[key] = state[key];
        }
      });

      // Navigate back with all context and restore scroll position
      navigate(targetPath, {
        state: restoreState
      });
      
      // Restore scroll position after navigation
      setTimeout(() => {
        const scrollTo = state.scrollY || state.restoreScroll || 0;
        window.scrollTo({ top: scrollTo, behavior: 'instant' });
      }, 100);
    } else {
      // Fallback to browser back
      navigate(-1);
    }
  }, [navigate, location]);

  /**
   * Get the current navigation context (for restoring state)
   */
  const getContext = useCallback((): NavigationContext => {
    return (location.state as NavigationContext) || {};
  }, [location]);

  /**
   * Navigate to a specific path with context preservation
   */
  const navigateWithContext = useCallback((path: string, additionalState?: any) => {
    const currentState = (location.state as NavigationContext) || {};
    navigate(path, {
      state: {
        ...currentState,
        ...additionalState,
        navigatedAt: Date.now()
      }
    });
  }, [navigate, location]);

  return {
    navigateToRecipe,
    goBack,
    getContext,
    navigateWithContext,
    currentPath: location.pathname,
    currentState: location.state as NavigationContext
  };
};

