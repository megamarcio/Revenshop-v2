import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Eye, Loader2, Database, HardDrive, RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { ColorTheme } from '@/contexts/ThemeContext';
import { useColorThemeSettings } from '@/hooks/useColorThemeSettings';

const ColorThemeSettings: React.FC = () => {
  const { currentTheme, setTheme, themes } = useTheme();
  const { 
    settings, 
    saveTheme, 
    loading, 
    isLoadingSettings, 
    useLocalStorage 
  } = useColorThemeSettings();

  // Escutar eventos do ThemeContext para salvar no banco
  useEffect(() => {
    const handleSaveTheme = (event: CustomEvent) => {
      const { themeId } = event.detail;
      if (themeId) {
        console.log('🎨 ColorThemeSettings - Salvando tema:', themeId);
        saveTheme(themeId);
      }
    };

    window.addEventListener('saveTheme', handleSaveTheme as EventListener);
    
    return () => {
      window.removeEventListener('saveTheme', handleSaveTheme as EventListener);
    };
  }, [saveTheme]);

  const handleThemeChange = async (themeId: string) => {
    console.log('🎨 ColorThemeSettings - Mudando tema para:', themeId);
    await setTheme(themeId);
  };

  const handleRefreshSettings = async () => {
    // Recarregar a página para garantir que as configurações sejam atualizadas
    window.location.reload();
  };

  if (isLoadingSettings) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando configurações de cores...</p>
        </CardContent>
      </Card>
    );
  }

  const ThemePreview: React.FC<{ theme: ColorTheme; isActive: boolean }> = ({ theme, isActive }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isActive ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
      }`}
      onClick={() => handleThemeChange(theme.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{theme.name}</CardTitle>
          {isActive && (
            <Badge variant="default" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Ativo
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm">{theme.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Preview Visual */}
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div 
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: theme.preview.primary }}
              title="Cor Primária"
            />
            <div 
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: theme.preview.secondary }}
              title="Cor Secundária"
            />
            <div 
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: theme.preview.background }}
              title="Cor de Fundo"
            />
            <div 
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: theme.preview.card }}
              title="Cor dos Cards"
            />
          </div>
          
          {/* Mini Preview */}
          <div 
            className="h-20 rounded-lg border p-3 text-xs"
            style={{ backgroundColor: theme.preview.background }}
          >
            <div 
              className="h-3 rounded mb-2"
              style={{ backgroundColor: theme.preview.primary, width: '60%' }}
            />
            <div 
              className="h-8 rounded p-2 flex items-center justify-between"
              style={{ backgroundColor: theme.preview.card }}
            >
              <div 
                className="h-2 rounded"
                style={{ backgroundColor: theme.preview.secondary, width: '40%' }}
              />
              <div 
                className="h-2 rounded"
                style={{ backgroundColor: theme.preview.primary, width: '20%' }}
              />
            </div>
          </div>
        </div>
        
        <Button 
          variant={isActive ? "default" : "outline"} 
          size="sm" 
          className="w-full mt-3"
          onClick={() => handleThemeChange(theme.id)}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Aplicando...
            </>
          ) : isActive ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Tema Ativo
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Aplicar Tema
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Configurações de Cores</span>
            <Badge variant={useLocalStorage ? "secondary" : "default"} className="ml-2">
              {useLocalStorage ? (
                <>
                  <HardDrive className="h-3 w-3 mr-1" />
                  Local
                </>
              ) : (
                <>
                  <Database className="h-3 w-3 mr-1" />
                  Banco
                </>
              )}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshSettings}
            className="h-8"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
        </CardTitle>
        <CardDescription>
          Personalize as cores da interface do sistema. Escolha entre diferentes combinações de cores para uma experiência visual única.
          {useLocalStorage && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
              ⚠️ Usando armazenamento local. Para persistir permanentemente, execute as migrações do banco de dados.
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Palette className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Tema Atual</p>
              <p className="text-xs text-blue-700">{currentTheme.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <ThemePreview 
                key={theme.id} 
                theme={theme} 
                isActive={currentTheme.id === theme.id}
              />
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Legenda das Cores</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Primária</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>Secundária</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border rounded"></div>
                <span>Fundo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>Cards</span>
              </div>
            </div>
          </div>
          
          {/* Informações sobre configurações avançadas */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Configurações Avançadas</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p>• As cores são aplicadas automaticamente em todo o sistema</p>
              <p>• Cada tema inclui cores primárias, secundárias, de fundo e cards</p>
              <p>• As configurações são sincronizadas entre todas as abas do navegador</p>
              <p>• {useLocalStorage ? 'Execute as migrações para salvar no banco de dados' : 'Configurações salvas no banco de dados'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorThemeSettings; 