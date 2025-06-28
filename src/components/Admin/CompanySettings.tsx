import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Upload, Loader2, Save } from 'lucide-react';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import ImageUpload from '@/components/ui/image-upload';
import { toast } from '@/components/ui/use-toast';

const CompanySettings: React.FC = () => {
  const { 
    settings, 
    updateSetting, 
    handleSaveSettings, 
    loading, 
    isLoadingSettings,
    useLocalStorage
  } = useCompanySettings();

  if (isLoadingSettings) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Configurações da Empresa</span>
        </CardTitle>
        <CardDescription>
          Configure o logotipo e informações da empresa que aparecerão no sistema.
          {useLocalStorage && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
              ⚠️ Usando armazenamento local. Para persistir permanentemente, execute as migrações do banco de dados.
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Nome da Empresa */}
        <div className="space-y-2">
          <Label htmlFor="company_name">Nome da Empresa</Label>
          <Input
            id="company_name"
            value={settings.company_name}
            onChange={(e) => updateSetting('company_name', e.target.value)}
            placeholder="Ex: Minha Revenda de Veículos Ltda"
          />
          <p className="text-xs text-gray-500">
            Nome que aparecerá embaixo do logotipo no cabeçalho do sistema.
          </p>
        </div>

        {/* Logotipo */}
        <div className="space-y-2">
          <Label>Logotipo da Empresa</Label>
          <ImageUpload
            value={settings.company_logo}
            onChange={(value) => updateSetting('company_logo', value)}
            size="lg"
          />
          <p className="text-xs text-gray-500">
            Imagem que substituirá o logotipo padrão do REVENSHOP. Formato recomendado: PNG ou SVG com fundo transparente.
          </p>
        </div>

        {/* Nome Fantasia */}
        <div className="space-y-2">
          <Label htmlFor="trade_name">Nome Fantasia</Label>
          <Input
            id="trade_name"
            value={settings.trade_name}
            onChange={(e) => updateSetting('trade_name', e.target.value)}
            placeholder="Ex: AutoMax Veículos"
          />
          <p className="text-xs text-gray-500">
            Nome comercial da empresa (opcional).
          </p>
        </div>

        {/* CNPJ */}
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={settings.cnpj}
            onChange={(e) => updateSetting('cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
          />
          <p className="text-xs text-gray-500">
            CNPJ da empresa (opcional, usado em relatórios).
          </p>
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => updateSetting('address', e.target.value)}
              placeholder="Rua das Flores, 123"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={settings.city}
              onChange={(e) => updateSetting('city', e.target.value)}
              placeholder="São Paulo"
            />
          </div>
        </div>

        {/* Telefone e Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
              placeholder="(11) 9999-9999"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
              placeholder="contato@empresa.com"
            />
          </div>
        </div>

        {/* Preview da Configuração */}
        {(settings.company_logo || settings.company_name) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Prévia do Cabeçalho</h4>
            <div className="flex items-center space-x-3 p-3 bg-white rounded border">
              {settings.company_logo ? (
                <img 
                  src={settings.company_logo} 
                  alt="Logo da empresa" 
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  REVENSHOP
                </h1>
                {settings.company_name && (
                  <p className="text-xs text-gray-600">
                    {settings.company_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botão Salvar */}
        <div className="space-y-3">
          <Button onClick={handleSaveSettings} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
          
          {/* Botão de teste para forçar atualização */}
          <Button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('companySettingsUpdated'));
              toast({
                title: 'Teste!',
                description: 'Evento de atualização disparado para Header/Sidebar.',
              });
            }} 
            variant="outline" 
            className="w-full"
          >
            🔄 Testar Atualização Header/Sidebar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySettings; 