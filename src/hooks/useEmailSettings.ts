
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  company_logo?: string;
}

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings>({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: 'RevenShop'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoadingSettings(true);
      
      const { data, error } = await supabase
        .rpc('get_email_settings');

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações de email:', error);
      }

      if (data && data.length > 0) {
        setSettings(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de email:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .rpc('save_email_settings', {
          p_smtp_host: settings.smtp_host,
          p_smtp_port: settings.smtp_port,
          p_smtp_user: settings.smtp_user,
          p_smtp_password: settings.smtp_password,
          p_from_email: settings.from_email,
          p_from_name: settings.from_name,
          p_company_logo: settings.company_logo
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações de email foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações de email:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações de email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof EmailSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    settings,
    updateSetting,
    isLoading,
    isLoadingSettings,
    saveSettings
  };
};
