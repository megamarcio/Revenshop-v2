
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Webhook, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WhatsAppWebhookSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "URL do webhook é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Salvar no localStorage por enquanto
      localStorage.setItem('whatsapp_webhook_url', webhookUrl);
      if (webhookSecret) {
        localStorage.setItem('whatsapp_webhook_secret', webhookSecret);
      }

      toast({
        title: "Sucesso",
        description: "Configurações de webhook salvas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // Carregar configurações salvas
    const savedUrl = localStorage.getItem('whatsapp_webhook_url');
    const savedSecret = localStorage.getItem('whatsapp_webhook_secret');
    
    if (savedUrl) setWebhookUrl(savedUrl);
    if (savedSecret) setWebhookSecret(savedSecret);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Webhook className="h-5 w-5" />
          <span>Configuração de Webhook</span>
        </CardTitle>
        <CardDescription>
          Configure o webhook para integração com N8N ou outros sistemas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook *</Label>
          <Input
            id="webhook-url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://seu-n8n.com/webhook/whatsapp"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-secret">Chave Secreta (Opcional)</Label>
          <Input
            id="webhook-secret"
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            placeholder="Chave secreta para autenticação"
          />
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>Salvando...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppWebhookSettings;
