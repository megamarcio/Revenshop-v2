import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return isMobileDevice || (isSmallScreen && isTouchDevice);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkIfMobile())
    }
    
    // Definir valor inicial
    setIsMobile(checkIfMobile())
    
    // Listener para mudanças
    mql.addEventListener("change", onChange)
    
    // Listener para redimensionamento (fallback)
    window.addEventListener("resize", onChange)
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", onChange)
    }
  }, [])

  return !!isMobile
}

// Hook para otimizar scroll mobile
export function useMobileScrollOptimization() {
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!isMobile) return;

    // Função para otimizar scroll em elementos específicos
    const optimizeScrollElements = () => {
      const scrollElements = document.querySelectorAll('.overflow-y-auto, .overflow-auto, [data-radix-dialog-content]');
      
      scrollElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.setAttribute('style', `
            -webkit-overflow-scrolling: touch !important;
            overscroll-behavior: contain !important;
            touch-action: pan-y;
          `);
        }
      });
    };

    // Otimizar elementos existentes
    optimizeScrollElements();

    // Observer para otimizar novos elementos
    const observer = new MutationObserver(() => {
      optimizeScrollElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  return { isMobile };
}
