import { useState, useEffect } from 'react';

export type ViewMode = 'normal' | 'compact';

interface UseViewModeOptions {
  key: string;
  defaultValue?: ViewMode;
}

export const useViewMode = ({ key, defaultValue = 'normal' }: UseViewModeOptions) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar preferência do localStorage na inicialização
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(key);
      if (savedMode && (savedMode === 'normal' || savedMode === 'compact')) {
        setViewMode(savedMode as ViewMode);
      }
    } catch (error) {
      console.warn('Erro ao carregar modo de visualização do localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  // Função para alternar o modo
  const toggleViewMode = () => {
    const newMode: ViewMode = viewMode === 'normal' ? 'compact' : 'normal';
    setViewMode(newMode);
    
    try {
      localStorage.setItem(key, newMode);
    } catch (error) {
      console.warn('Erro ao salvar modo de visualização no localStorage:', error);
    }
  };

  // Função para definir o modo diretamente
  const setViewModeDirect = (mode: ViewMode) => {
    setViewMode(mode);
    
    try {
      localStorage.setItem(key, mode);
    } catch (error) {
      console.warn('Erro ao salvar modo de visualização no localStorage:', error);
    }
  };

  return {
    viewMode,
    isCompactMode: viewMode === 'compact',
    isLoaded,
    toggleViewMode,
    setViewMode: setViewModeDirect,
  };
}; 