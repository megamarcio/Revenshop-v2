import React, { useEffect, useState } from 'react';
import { useColorThemeSettingsConsumer } from '@/hooks/useColorThemeSettings';
import { ThemeContext } from '@/hooks/useTheme';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  background: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
  };
}

const colorThemes: ColorTheme[] = [
  {
    id: 'blue-white',
    name: 'Azul com Fundo Branco',
    primary: 'blue',
    background: 'white',
    description: 'Tema padrão com azul vibrante e fundo branco limpo',
    preview: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      background: '#ffffff',
      card: '#f8fafc'
    }
  },
  {
    id: 'red-white',
    name: 'Vermelho com Fundo Branco',
    primary: 'red',
    background: 'white',
    description: 'Tema energético com vermelho vibrante e fundo branco',
    preview: {
      primary: '#dc2626',
      secondary: '#ef4444',
      background: '#ffffff',
      card: '#fef2f2'
    }
  },
  {
    id: 'black-white',
    name: 'Preto com Fundo Branco',
    primary: 'gray',
    background: 'white',
    description: 'Tema elegante monocromático com preto e fundo branco',
    preview: {
      primary: '#1f2937',
      secondary: '#374151',
      background: '#ffffff',
      card: '#f9fafb'
    }
  },
  {
    id: 'purple-white',
    name: 'Roxo com Fundo Branco',
    primary: 'purple',
    background: 'white',
    description: 'Tema criativo com roxo vibrante e fundo branco',
    preview: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      background: '#ffffff',
      card: '#faf5ff'
    }
  },
  {
    id: 'teal-white',
    name: 'Turquesa com Fundo Branco',
    primary: 'teal',
    background: 'white',
    description: 'Tema moderno com turquesa elegante e fundo branco',
    preview: {
      primary: '#0d9488',
      secondary: '#14b8a6',
      background: '#ffffff',
      card: '#f0fdfa'
    }
  },
  {
    id: 'blue-gray',
    name: 'Azul com Fundo Cinza Claro',
    primary: 'blue',
    background: 'gray-light',
    description: 'Tema suave com azul e fundo cinza claro relaxante',
    preview: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      background: '#f1f5f9',
      card: '#ffffff'
    }
  },
  {
    id: 'blue-dark-white',
    name: 'Azul Escuro com Fundo Branco',
    primary: 'blue-dark',
    background: 'white',
    description: 'Tema profissional com azul escuro e fundo branco',
    preview: {
      primary: '#1e40af',
      secondary: '#2563eb',
      background: '#ffffff',
      card: '#f8fafc'
    }
  },
  {
    id: 'blue-dark-light',
    name: 'Azul Escuro com Fundo Azul Claro',
    primary: 'blue-dark',
    background: 'blue-light',
    description: 'Tema harmônico com azul escuro e fundo azul claro',
    preview: {
      primary: '#1e40af',
      secondary: '#2563eb',
      background: '#dbeafe',
      card: '#f0f9ff'
    }
  },
  {
    id: 'green-white',
    name: 'Verde com Fundo Branco',
    primary: 'green',
    background: 'white',
    description: 'Tema natural com verde vibrante e fundo branco',
    preview: {
      primary: '#059669',
      secondary: '#10b981',
      background: '#ffffff',
      card: '#f0fdf4'
    }
  },
  {
    id: 'orange-white',
    name: 'Laranja com Fundo Branco',
    primary: 'orange',
    background: 'white',
    description: 'Tema energético com laranja vibrante e fundo branco',
    preview: {
      primary: '#ea580c',
      secondary: '#f97316',
      background: '#ffffff',
      card: '#fff7ed'
    }
  }
];

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { currentThemeId, isLoading } = useColorThemeSettingsConsumer();
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(colorThemes[0]);

  useEffect(() => {
    if (!isLoading && currentThemeId) {
      const theme = colorThemes.find(t => t.id === currentThemeId);
      if (theme) {
        setCurrentTheme(theme);
        applyThemeStyles(theme);
      }
    }
  }, [currentThemeId, isLoading]);

  const applyThemeStyles = (theme: ColorTheme) => {
    console.log('🎨 Aplicando estilos do tema:', theme.name);
    const root = document.documentElement;
    
    // Remove classes de tema anteriores
    colorThemes.forEach(t => {
      root.classList.remove(`theme-${t.id}`);
    });
    
    // Adiciona nova classe de tema
    root.classList.add(`theme-${theme.id}`);
    console.log('✅ Classe aplicada:', `theme-${theme.id}`);
    
    // Converter cores hex para HSL para compatibilidade com Tailwind
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    const getContrastingTextColor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '222.2 84% 4.9%' : '210 40% 98%'; // Retorna HSL escuro ou claro
    };
    
    // Aplicar variáveis CSS do Tailwind
    const primaryHsl = hexToHsl(theme.preview.primary);
    const backgroundHsl = hexToHsl(theme.preview.background);
    const cardHsl = hexToHsl(theme.preview.card);
    const secondaryHsl = hexToHsl(theme.preview.secondary);
    
    // Aplicar todas as variáveis CSS necessárias
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--primary-foreground', getContrastingTextColor(theme.preview.primary));
    root.style.setProperty('--background', backgroundHsl);
    root.style.setProperty('--card', cardHsl);
    root.style.setProperty('--card-foreground', getContrastingTextColor(theme.preview.card));
    root.style.setProperty('--revenshop-primary', primaryHsl);
    
    // Aplicar cores do sidebar
    root.style.setProperty('--sidebar-background', backgroundHsl);
    root.style.setProperty('--sidebar-primary', primaryHsl);
    root.style.setProperty('--sidebar-primary-foreground', '0 0% 98%');
    
    // Aplicar cores dos elementos interativos
    root.style.setProperty('--ring', primaryHsl);
    root.style.setProperty('--accent', secondaryHsl); // Accent usa a cor secundária
    root.style.setProperty('--accent-foreground', getContrastingTextColor(theme.preview.secondary));
    
    // Cores adicionais para botões e estados
    root.style.setProperty('--secondary', secondaryHsl);
    root.style.setProperty('--secondary-foreground', getContrastingTextColor(theme.preview.secondary));
    root.style.setProperty('--muted', cardHsl);
    root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
    
    // Aplicar ao body
    document.body.style.backgroundColor = theme.preview.background;
    document.body.style.color = getContrastingTextColor(theme.preview.background);
    
    // Disparar evento para notificar outros componentes
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: theme.id } 
    }));
    
    // Forçar re-render dos componentes
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
    console.log('🎨 Variáveis CSS aplicadas:', {
      primary: primaryHsl,
      background: backgroundHsl,
      card: cardHsl,
      secondary: secondaryHsl
    });
  };

  const setTheme = async (themeId: string) => {
    console.log('🎨 Alterando tema para:', themeId);
    const theme = colorThemes.find(t => t.id === themeId);
    if (theme) {
      console.log('✅ Tema encontrado:', theme.name);
      setCurrentTheme(theme);
      applyThemeStyles(theme);
      
      // Salvar no localStorage para compatibilidade imediata
      localStorage.setItem('color-theme', themeId);
      
      // Disparar evento para o hook de configurações salvar no banco
      window.dispatchEvent(new CustomEvent('saveTheme', { 
        detail: { themeId } 
      }));
    } else {
      console.error('❌ Tema não encontrado:', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes: colorThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}; 