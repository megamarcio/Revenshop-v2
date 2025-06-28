import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type ViewMode = 'card' | 'list' | 'table';

interface ViewPreferences {
  id?: string;
  user_id: string;
  component_name: string;
  view_mode: ViewMode;
  preferences: Record<string, any>;
}

interface UseViewPreferencesReturn {
  viewMode: ViewMode;
  preferences: Record<string, any>;
  loading: boolean;
  setViewMode: (mode: ViewMode) => Promise<void>;
  updatePreferences: (prefs: Record<string, any>) => Promise<void>;
}

export const useViewPreferences = (
  componentName: string,
  defaultViewMode: ViewMode = 'card',
  defaultPreferences: Record<string, any> = {}
): UseViewPreferencesReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [viewMode, setViewModeState] = useState<ViewMode>(defaultViewMode);
  const [preferences, setPreferencesState] = useState<Record<string, any>>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(true);

  // Carregar preferências (banco de dados com fallback para localStorage)
  useEffect(() => {
    if (!user?.id) {
      loadPreferencesFromStorage();
      return;
    }

    loadPreferences();
  }, [user?.id, componentName]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar do banco de dados
      const { data, error } = await supabase
        .from('view_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .eq('component_name', componentName)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        // Se houve erro (ex: tabela não existe), usar localStorage
        console.warn('Erro ao acessar banco de dados, usando localStorage:', error.message);
        setUseDatabase(false);
        loadPreferencesFromStorage();
        return;
      }

      if (data) {
        setViewModeState(data.view_mode as ViewMode);
        setPreferencesState(data.preferences || defaultPreferences);
      } else {
        // Se não existe, criar com valores padrão
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Erro ao carregar preferências do banco:', error);
      // Fallback para localStorage
      setUseDatabase(false);
      loadPreferencesFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadPreferencesFromStorage = () => {
    try {
      setLoading(true);
      
      const storageKey = `view_preferences_${user?.id || 'anonymous'}_${componentName}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        setViewModeState(data.view_mode || defaultViewMode);
        setPreferencesState(data.preferences || defaultPreferences);
      } else {
        setViewModeState(defaultViewMode);
        setPreferencesState(defaultPreferences);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências do localStorage:', error);
      setViewModeState(defaultViewMode);
      setPreferencesState(defaultPreferences);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    try {
      const { error } = await supabase
        .from('view_preferences')
        .insert({
          user_id: user!.id,
          component_name: componentName,
          view_mode: defaultViewMode,
          preferences: defaultPreferences
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao criar preferências padrão:', error);
      // Fallback para localStorage
      setUseDatabase(false);
      savePreferencesToStorage(defaultViewMode, defaultPreferences);
    }
  };

  const savePreferencesToStorage = (mode: ViewMode, prefs: Record<string, any>) => {
    try {
      const storageKey = `view_preferences_${user?.id || 'anonymous'}_${componentName}`;
      const data = {
        view_mode: mode,
        preferences: prefs,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  const setViewMode = async (mode: ViewMode) => {
    try {
      setViewModeState(mode);
      
      if (useDatabase && user?.id) {
        // Tentar salvar no banco de dados
        const { error } = await supabase
          .from('view_preferences')
          .upsert({
            user_id: user.id,
            component_name: componentName,
            view_mode: mode,
            preferences: preferences,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn('Erro ao salvar no banco, usando localStorage:', error.message);
          setUseDatabase(false);
          savePreferencesToStorage(mode, preferences);
        }
      } else {
        // Usar localStorage
        savePreferencesToStorage(mode, preferences);
      }
      
      toast({
        title: "Preferência salva",
        description: `Modo de visualização alterado para ${mode === 'card' ? 'cards' : mode === 'list' ? 'lista' : 'tabela'}`,
      });
    } catch (error) {
      console.error('Erro ao salvar modo de visualização:', error);
      // Fallback para localStorage
      savePreferencesToStorage(mode, preferences);
      toast({
        title: "Preferência salva localmente",
        description: `Modo de visualização alterado para ${mode === 'card' ? 'cards' : mode === 'list' ? 'lista' : 'tabela'}`,
      });
    }
  };

  const updatePreferences = async (newPreferences: Record<string, any>) => {
    try {
      const mergedPreferences = { ...preferences, ...newPreferences };
      setPreferencesState(mergedPreferences);
      
      if (useDatabase && user?.id) {
        // Tentar salvar no banco de dados
        const { error } = await supabase
          .from('view_preferences')
          .upsert({
            user_id: user.id,
            component_name: componentName,
            view_mode: viewMode,
            preferences: mergedPreferences,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn('Erro ao salvar no banco, usando localStorage:', error.message);
          setUseDatabase(false);
          savePreferencesToStorage(viewMode, mergedPreferences);
        }
      } else {
        // Usar localStorage
        savePreferencesToStorage(viewMode, mergedPreferences);
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      // Fallback para localStorage
      savePreferencesToStorage(viewMode, mergedPreferences);
    }
  };

  return {
    viewMode,
    preferences,
    loading,
    setViewMode,
    updatePreferences
  };
}; 