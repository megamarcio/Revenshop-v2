
import { useState, useEffect } from 'react';

interface MobileOptimization {
  isMobile: boolean;
  isSmallMobile: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  viewport: {
    width: number;
    height: number;
  };
}

export const useMobileOptimization = (): MobileOptimization => {
  const [optimization, setOptimization] = useState<MobileOptimization>({
    isMobile: false,
    isSmallMobile: false,
    isTablet: false,
    isLandscape: false,
    viewport: {
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    },
  });

  useEffect(() => {
    const updateOptimization = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setOptimization({
        isMobile: width < 768,
        isSmallMobile: width < 375,
        isTablet: width >= 768 && width < 1024,
        isLandscape: width > height,
        viewport: { width, height },
      });
    };

    // Inicial
    updateOptimization();

    // Listener para mudanças
    window.addEventListener('resize', updateOptimization);
    window.addEventListener('orientationchange', updateOptimization);

    return () => {
      window.removeEventListener('resize', updateOptimization);
      window.removeEventListener('orientationchange', updateOptimization);
    };
  }, []);

  return optimization;
};
