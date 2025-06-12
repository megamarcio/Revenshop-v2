
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WebhookSettings {
  webhookUrl: string;
  webhookSecret: string;
}

export const useWhatsAppWebhook = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar configurações salvas do localStorage
    const savedUrl = localStorage.getItem('whatsapp_webhook_url');
    const savedSecret = localStorage.getItem('whatsapp_webhook_secret');
    
    if (savedUrl) setWebhookUrl(savedUrl);
    if (savedSecret) setWebhookSecret(savedSecret);
  }, []);

  const saveSettings = async (settings: WebhookSettings) => {
    if (!settings.webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "URL do webhook é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Salvar no localStorage por enquanto
      localStorage.setItem('whatsapp_webhook_url', settings.webhookUrl);
      if (settings.webhookSecret) {
        localStorage.setItem('whatsapp_webhook_secret', settings.webhookSecret);
      }

      setWebhookUrl(settings.webhookUrl);
      setWebhookSecret(settings.webhookSecret);

      toast({
        title: "Sucesso",
        description: "Configurações de webhook salvas com sucesso!",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de webhook.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    webhookUrl,
    webhookSecret,
    isLoading,
    setWebhookUrl,
    setWebhookSecret,
    saveSettings
  };
};
