import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CompanySettings {
  company_name: string;
  company_logo?: string;
  trade_name?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
}

const defaultSettings: CompanySettings = {
  company_name: '',
  company_logo: '',
  trade_name: '',
  cnpj: '',
  address: '',
  city: '',
  phone: '',
  email: '',
};

// Event dispatching para notificar mudanças
const dispatchSettingsUpdate = () => {
  window.dispatchEvent(new CustomEvent('companySettingsUpdated'));
};

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('company-settings');
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        const newSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(newSettings);
        return newSettings;
      }
      return defaultSettings;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultSettings;
    }
  };

  const saveToLocalStorage = (settingsToSave: CompanySettings) => {
    try {
      localStorage.setItem('company-settings', JSON.stringify(settingsToSave));
      dispatchSettingsUpdate(); // Notify other components
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        // Se a tabela não existe (erro 42P01) ou não há registros (PGRST116), usa localStorage
        if (error.code === '42P01' || error.code === 'PGRST116') {
          console.log('🔄 Usando localStorage como fallback para configurações da empresa');
          setUseLocalStorage(true);
          loadFromLocalStorage();
        } else {
          console.error('Error loading company settings:', error);
          setUseLocalStorage(true);
          loadFromLocalStorage();
        }
        return;
      }

      if (data) {
        const loadedSettings = {
          company_name: data.company_name || '',
          company_logo: data.company_logo || '',
          trade_name: data.trade_name || '',
          cnpj: data.cnpj || '',
          address: data.address || '',
          city: data.city || '',
          phone: data.phone || '',
          email: data.email || '',
        };
        setSettings(loadedSettings);
        // Sincronizar com localStorage
        saveToLocalStorage(loadedSettings);
      }
    } catch (error) {
      console.error('Error loading company settings:', error);
      setUseLocalStorage(true);
      loadFromLocalStorage();
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const updateSetting = (key: keyof CompanySettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      if (useLocalStorage) {
        // Salvar no localStorage
        saveToLocalStorage(settings);
        toast({
          title: 'Sucesso!',
          description: 'Configurações da empresa salvas localmente com sucesso.',
        });
      } else {
        // Tentar salvar no banco
        const { error } = await supabase
          .from('company_settings')
          .upsert(
            {
              id: 1,
              ...settings,
            },
            {
              onConflict: 'id'
            }
          );

        if (error) {
          // Se falhou, usar localStorage como fallback
          console.error('Error saving to database, using localStorage:', error);
          setUseLocalStorage(true);
          saveToLocalStorage(settings);
          toast({
            title: 'Aviso!',
            description: 'Configurações salvas localmente. Para persistir permanentemente, execute as migrações do banco.',
            variant: 'default',
          });
        } else {
          // Sincronizar com localStorage
          saveToLocalStorage(settings);
          toast({
            title: 'Sucesso!',
            description: 'Configurações da empresa salvas com sucesso.',
          });
        }
      }
    } catch (error) {
      console.error('Error saving company settings:', error);
      // Fallback para localStorage
      saveToLocalStorage(settings);
      toast({
        title: 'Aviso!',
        description: 'Configurações salvas localmente devido a erro no banco de dados.',
        variant: 'default',
      });
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

    window.addEventListener('companySettingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('companySettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return {
    settings,
    updateSetting,
    handleSaveSettings,
    loading,
    isLoadingSettings,
    useLocalStorage,
  };
}; 