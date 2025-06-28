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

  // Carregar preferências do usuário
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadPreferences();
  }, [user?.id, componentName]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('view_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .eq('component_name', componentName)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      if (data) {
        setViewModeState(data.view_mode as ViewMode);
        setPreferencesState(data.preferences || defaultPreferences);
      } else {
        // Se não existe, criar com valores padrão
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      // Usar valores padrão em caso de erro
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
    }
  };

  const setViewMode = async (mode: ViewMode) => {
    if (!user?.id) {
      setViewModeState(mode);
      return;
    }

    try {
      const { error } = await supabase
        .from('view_preferences')
        .upsert({
          user_id: user.id,
          component_name: componentName,
          view_mode: mode,
          preferences: preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setViewModeState(mode);
      
      toast({
        title: "Preferência salva",
        description: `Modo de visualização alterado para ${mode === 'card' ? 'cards' : mode === 'list' ? 'lista' : 'tabela'}`,
      });
    } catch (error) {
      console.error('Erro ao salvar modo de visualização:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a preferência",
        variant: "destructive",
      });
      // Reverter para o estado anterior em caso de erro
      setViewModeState(viewMode);
    }
  };

  const updatePreferences = async (newPreferences: Record<string, any>) => {
    if (!user?.id) {
      setPreferencesState(newPreferences);
      return;
    }

    try {
      const mergedPreferences = { ...preferences, ...newPreferences };
      
      const { error } = await supabase
        .from('view_preferences')
        .upsert({
          user_id: user.id,
          component_name: componentName,
          view_mode: viewMode,
          preferences: mergedPreferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setPreferencesState(mergedPreferences);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as preferências",
        variant: "destructive",
      });
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