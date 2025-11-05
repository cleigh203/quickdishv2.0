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
  collectionParam?: string; // Preserve collection query parameter
  [key: string]: any; // Allow any additional context
}

/**
 * Get scroll key for sessionStorage
 */
const getScrollKey = (pathname: string, search: string) => {
  return `scroll_${pathname}_${search}`;
};

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
    
    // Save scroll position to sessionStorage for this route
    const scrollKey = getScrollKey(location.pathname, location.search);
    sessionStorage.setItem(scrollKey, scrollY.toString());
    
    // Capture current URL search params (for collection query parameter)
    const searchParams = new URLSearchParams(location.search);
    const collectionParam = searchParams.get('collection');
    
    // Determine where we're coming from based on pathname
    const pathname = location.pathname;
    const from = pathname.includes('/discover') || pathname.includes('/generate') ? '/discover' :
                 pathname.includes('/favorites') ? '/favorites' :
                 pathname.includes('/saved') ? '/saved' :
                 pathname.includes('/meal-plan') ? '/meal-plan' :
                 pathname.includes('/') && pathname !== '/' ? pathname :
                 '/discover';

    // Navigate with ALL context preserved
    navigate(`/recipe/${recipeId}`, {
      state: {
        recipe,
        from,
        scrollY,
        restoreScroll: scrollY, // Alias for compatibility
        collectionParam: collectionParam || currentState.collectionParam, // Preserve collection parameter
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
      let targetPath = state.from;
      
      // Restore collection query parameter if it exists
      if (state.collectionParam) {
        const url = new URL(targetPath, window.location.origin);
        url.searchParams.set('collection', state.collectionParam);
        targetPath = url.pathname + url.search;
      }
      
      // Prepare state to restore
      const restoreState: any = {
        restoreScroll: state.scrollY || state.restoreScroll || 0,
        // Preserve search and filter state
        searchQuery: state.searchQuery || state.appliedSearch,
        activeFilters: state.activeFilters,
        activeCategory: state.activeCategory,
        categoryFilter: state.categoryFilter,
        showFilteredView: state.showFilteredView,
        collectionParam: state.collectionParam, // Preserve collection parameter
      };

      // Preserve any other custom state (except internal fields)
      Object.keys(state).forEach(key => {
        if (!['from', 'recipe', 'navigatedAt', 'scrollY'].includes(key)) {
          restoreState[key] = state[key];
        }
      });

      // Navigate back with all context
      navigate(targetPath, {
        state: restoreState
      });
      
      // Restore scroll position after navigation
      // Use sessionStorage which will be picked up by useScrollRestoration
      const scrollTo = state.scrollY || state.restoreScroll || 0;
      if (scrollTo > 0) {
        const scrollKey = getScrollKey(targetPath, new URL(targetPath, window.location.origin).search);
        sessionStorage.setItem(scrollKey, scrollTo.toString());
        
        // Also try immediate restore after a delay
        setTimeout(() => {
          window.scrollTo({ top: scrollTo, behavior: 'instant' });
        }, 100);
      }
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

