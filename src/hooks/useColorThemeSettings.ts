import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CustomTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  card: string;
}

export interface ColorThemeSettings {
  current_theme_id: string;
  custom_themes?: CustomTheme[];
}

const defaultSettings: ColorThemeSettings = {
  current_theme_id: 'blue-white',
  custom_themes: [],
};

// Event dispatching para notificar mudanças
const dispatchThemeSettingsUpdate = () => {
  window.dispatchEvent(new CustomEvent('colorThemeSettingsUpdated'));
};

export const useColorThemeSettings = () => {
  const [settings, setSettings] = useState<ColorThemeSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(true); // Iniciar sempre com localStorage

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('color-theme-settings');
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        const newSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(newSettings);
        return newSettings;
      }
      
      // Migrar configuração antiga se existir
      const oldTheme = localStorage.getItem('color-theme');
      if (oldTheme) {
        const migratedSettings = {
          current_theme_id: oldTheme,
          custom_themes: []
        };
        setSettings(migratedSettings);
        saveToLocalStorage(migratedSettings);
        return migratedSettings;
      }
      
      return defaultSettings;
    } catch (error) {
      console.error('Error loading color theme settings from localStorage:', error);
      return defaultSettings;
    }
  };

  const saveToLocalStorage = (settingsToSave: ColorThemeSettings) => {
    try {
      localStorage.setItem('color-theme-settings', JSON.stringify(settingsToSave));
      // Manter compatibilidade com o sistema antigo
      localStorage.setItem('color-theme', settingsToSave.current_theme_id);
      dispatchThemeSettingsUpdate();
    } catch (error) {
      console.error('Error saving color theme settings to localStorage:', error);
    }
  };

  const tryLoadFromDatabase = async () => {
    try {
      // Tentar query direta na tabela de cores (se existir)
      const { data, error } = await supabase
        .from('color_theme_settings' as any)
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        console.log('✅ Configurações de cores carregadas do banco de dados');
        const loadedSettings = {
          current_theme_id: data.current_theme_id || 'blue-white',
          custom_themes: data.custom_themes || [],
        };
        setSettings(loadedSettings);
        saveToLocalStorage(loadedSettings);
        setUseLocalStorage(false);
        return true;
      }
    } catch (error) {
      console.log('📦 Tabela color_theme_settings não disponível, usando localStorage');
    }
    
    return false;
  };

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    
    try {
      // Primeiro tentar carregar do banco
      const dbLoaded = await tryLoadFromDatabase();
      
      if (!dbLoaded) {
        // Se não conseguiu do banco, usar localStorage
        console.log('🔄 Usando localStorage para configurações de cores');
        setUseLocalStorage(true);
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading color theme settings:', error);
      setUseLocalStorage(true);
      loadFromLocalStorage();
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const updateCurrentTheme = (themeId: string) => {
    setSettings(prev => ({
      ...prev,
      current_theme_id: themeId
    }));
  };

  const tryUpdateDatabase = async (settingsToSave: ColorThemeSettings) => {
    try {
      const { error } = await supabase
        .from('color_theme_settings' as any)
        .upsert(
          {
            id: 1,
            current_theme_id: settingsToSave.current_theme_id,
            custom_themes: settingsToSave.custom_themes || [],
          },
          {
            onConflict: 'id'
          }
        );

      if (!error) {
        console.log('✅ Configurações de cores salvas no banco de dados');
        setUseLocalStorage(false);
        return true;
      } else {
        console.log('⚠️ Erro ao salvar no banco, usando localStorage:', error.message);
        return false;
      }
    } catch (error) {
      console.log('📦 Não foi possível salvar no banco, usando localStorage');
      return false;
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Sempre salvar no localStorage primeiro
      saveToLocalStorage(settings);
      
      if (!useLocalStorage) {
        // Tentar salvar no banco se disponível
        const dbSaved = await tryUpdateDatabase(settings);
        
        if (dbSaved) {
          toast({
            title: 'Sucesso!',
            description: 'Configurações de tema salvas no banco de dados.',
          });
        } else {
          setUseLocalStorage(true);
          toast({
            title: 'Aviso!',
            description: 'Configurações salvas localmente. Execute as migrações para salvar no banco.',
            variant: 'default',
          });
        }
      } else {
        toast({
          title: 'Sucesso!',
          description: 'Configurações de tema salvas localmente.',
        });
      }
    } catch (error) {
      console.error('Error saving color theme settings:', error);
      toast({
        title: 'Aviso!',
        description: 'Configurações salvas localmente devido a erro.',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTheme = async (themeId: string) => {
    const newSettings = { ...settings, current_theme_id: themeId };
    setSettings(newSettings);
    
    setLoading(true);
    try {
      // Sempre salvar no localStorage primeiro
      saveToLocalStorage(newSettings);
      
      if (!useLocalStorage) {
        // Tentar salvar no banco se disponível
        await tryUpdateDatabase(newSettings);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Listen para mudanças de configurações
    const handleSettingsUpdate = () => {
      loadFromLocalStorage();
    };

    window.addEventListener('colorThemeSettingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('colorThemeSettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return {
    settings,
    updateCurrentTheme,
    handleSaveSettings,
    saveTheme,
    loading,
    isLoadingSettings,
    useLocalStorage,
  };
};

// Hook otimizado para componentes que só precisam ler os dados
export const useColorThemeSettingsConsumer = () => {
  const [currentThemeId, setCurrentThemeId] = useState<string>('blue-white');
  const [isLoading, setIsLoading] = useState(true);

  const loadThemeFromStorage = () => {
    try {
      // Primeiro tentar o novo formato
      const stored = localStorage.getItem('color-theme-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentThemeId(parsed.current_theme_id || 'blue-white');
        console.log('🎨 Consumer - Tema carregado do novo formato:', parsed.current_theme_id);
        return;
      }
      
      // Fallback para o formato antigo
      const oldTheme = localStorage.getItem('color-theme');
      if (oldTheme) {
        setCurrentThemeId(oldTheme);
        console.log('🎨 Consumer - Tema carregado do formato antigo:', oldTheme);
        return;
      }
      
      // Se não há nada, usar padrão
      setCurrentThemeId('blue-white');
      console.log('🎨 Consumer - Usando tema padrão: blue-white');
    } catch (error) {
      console.error('❌ Consumer - Erro ao carregar tema:', error);
      setCurrentThemeId('blue-white');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar inicialmente
    loadThemeFromStorage();

    // Escutar mudanças
    const handleThemeSettingsUpdate = () => {
      console.log('🔄 Consumer - Recarregando tema após atualização');
      loadThemeFromStorage();
    };

    window.addEventListener('colorThemeSettingsUpdated', handleThemeSettingsUpdate);
    // Manter compatibilidade com eventos antigos
    window.addEventListener('themeChanged', handleThemeSettingsUpdate);

    return () => {
      window.removeEventListener('colorThemeSettingsUpdated', handleThemeSettingsUpdate);
      window.removeEventListener('themeChanged', handleThemeSettingsUpdate);
    };
  }, []);

  return {
    currentThemeId,
    isLoading,
  };
}; 