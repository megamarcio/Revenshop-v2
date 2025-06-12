
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Webhook, Save } from 'lucide-react';
import { useWhatsAppWebhook } from '@/hooks/useWhatsAppWebhook';

const WhatsAppWebhookSettings = () => {
  const {
    webhookUrl,
    webhookSecret,
    isLoading,
    setWebhookUrl,
    setWebhookSecret,
    saveSettings
  } = useWhatsAppWebhook();

  const handleSave = async () => {
    await saveSettings({ webhookUrl, webhookSecret });
  };

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
