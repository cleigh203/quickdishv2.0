import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = () => {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const scrollKey = `scroll_${pathname.replace(/\//g, '_')}`;
    
    // Check if there's an active search - if so, skip scroll restoration
    // The Generate component will handle scroll restoration after search results render
    const hasActiveSearch = sessionStorage.getItem('discover_search') || 
                           sessionStorage.getItem('discover_ingredient') ||
                           sessionStorage.getItem('discover_activeFilters');
    
    // Restore scroll position only if there's no active search
    // For search results, let the page component handle scroll restoration
    if (!hasActiveSearch) {
      const savedScroll = sessionStorage.getItem(scrollKey);
      if (savedScroll) {
        const scrollValue = parseInt(savedScroll, 10);
        if (!isNaN(scrollValue) && scrollValue > 0) {
          // Use requestAnimationFrame for smooth, non-blocking scroll
          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollValue, behavior: 'instant' });
          });
          
          // Backup scroll attempts with longer delays for content to render
          setTimeout(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollValue, behavior: 'instant' });
            });
          }, 100);
          
          setTimeout(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollValue, behavior: 'instant' });
            });
          }, 300);
        }
      }
    }

    // Save scroll position (throttled)
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.setItem(scrollKey, window.scrollY.toString());
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);
};
