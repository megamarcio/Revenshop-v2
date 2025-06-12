
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  company_logo?: string;
}

const defaultSettings: EmailSettings = {
  smtp_host: '',
  smtp_port: 587,
  smtp_user: '',
  smtp_password: '',
  from_email: '',
  from_name: 'Equipe de Vendas',
};

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // For now, we'll use a simple table approach
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading email settings:', error);
        return;
      }

      if (data) {
        setSettings({
          smtp_host: data.smtp_host || '',
          smtp_port: data.smtp_port || 587,
          smtp_user: data.smtp_user || '',
          smtp_password: data.smtp_password || '',
          from_email: data.from_email || '',
          from_name: data.from_name || 'Equipe de Vendas',
          company_logo: data.company_logo || '',
        });
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: EmailSettings) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_settings')
        .upsert({
          id: 1, // Single row configuration
          ...newSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving email settings:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar configurações de email.',
          variant: 'destructive',
        });
        return false;
      }

      setSettings(newSettings);
      toast({
        title: 'Sucesso',
        description: 'Configurações de email salvas com sucesso!',
      });
      return true;
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar configurações de email.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    loadSettings,
    saveSettings,
  };
};
