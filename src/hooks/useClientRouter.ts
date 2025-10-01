export const useClientRouter = () => {
  const handleNavigate = (path: string, e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Force client-side routing by manipulating history
    window.history.pushState({}, '', path);
    
    // Trigger a popstate event to notify React Router
    const popStateEvent = new PopStateEvent('popstate', { state: {} });
    window.dispatchEvent(popStateEvent);
  };
  
  return handleNavigate;
};
