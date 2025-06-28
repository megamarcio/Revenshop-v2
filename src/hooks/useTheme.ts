import { createContext, useContext } from 'react';
import type { ColorTheme } from '@/contexts/ThemeContext'; // Importar o tipo

// Definir a interface aqui também para referência
export interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (themeId: string) => void;
  themes: ColorTheme[];
}

// Criar e exportar o context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Criar e exportar o hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}; 