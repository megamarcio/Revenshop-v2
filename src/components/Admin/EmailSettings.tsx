
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';
import { useEmailSettings } from '@/hooks/useEmailSettings';
import ImageUpload from '@/components/ui/image-upload';

const EmailSettings = () => {
  const { settings, updateSetting, isLoading, isLoadingSettings, saveSettings } = useEmailSettings();

  if (isLoadingSettings) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Configurações de Email</span>
        </CardTitle>
        <CardDescription>
          Configure as configurações de SMTP para envio de emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp_host">Servidor SMTP</Label>
            <Input
              id="smtp_host"
              value={settings.smtp_host}
              onChange={(e) => updateSetting('smtp_host', e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_port">Porta</Label>
            <Input
              id="smtp_port"
              type="number"
              value={settings.smtp_port}
              onChange={(e) => updateSetting('smtp_port', parseInt(e.target.value) || 587)}
              placeholder="587"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_user">Usuário</Label>
            <Input
              id="smtp_user"
              value={settings.smtp_user}
              onChange={(e) => updateSetting('smtp_user', e.target.value)}
              placeholder="seu-email@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_password">Senha</Label>
            <Input
              id="smtp_password"
              type="password"
              value={settings.smtp_password}
              onChange={(e) => updateSetting('smtp_password', e.target.value)}
              placeholder="sua-senha-de-app"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from_email">Email do Remetente</Label>
            <Input
              id="from_email"
              value={settings.from_email}
              onChange={(e) => updateSetting('from_email', e.target.value)}
              placeholder="vendas@revenshop.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from_name">Nome do Remetente</Label>
            <Input
              id="from_name"
              value={settings.from_name}
              onChange={(e) => updateSetting('from_name', e.target.value)}
              placeholder="RevenShop"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Logotipo da Empresa</Label>
          <ImageUpload
            value={settings.company_logo}
            onChange={(value) => updateSetting('company_logo', value)}
            size="lg"
          />
        </div>

        <Button onClick={saveSettings} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
