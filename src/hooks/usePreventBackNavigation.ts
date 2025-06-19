
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const usePreventBackNavigation = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    const handleBackButton = (event: PopStateEvent) => {
      // Add a new entry to history to prevent going back
      window.history.pushState(null, '', window.location.href);
      
      // Optionally show a confirmation dialog
      const confirmExit = window.confirm('Tem certeza que deseja sair do sistema?');
      if (confirmExit) {
        // If user confirms, allow them to leave by going back twice
        window.history.go(-2);
      }
    };

    // Push an initial state
    window.history.pushState(null, '', window.location.href);
    
    // Listen for back button
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isMobile]);
};
