import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, ExternalLink, Trash2, Edit, Save, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWebsiteSettings, WebsiteSettingsInsert } from '@/hooks/useWebsiteSettings';

interface WebsiteLink {
  id: string;
  name: string;
  url: string;
  category: 'government' | 'commercial' | 'tools' | 'other';
  description?: string;
}

const defaultWebsites: WebsiteLink[] = [
  {
    id: '1',
    name: 'DETRAN SP',
    url: 'https://www.detran.sp.gov.br',
    category: 'government',
    description: 'Departamento de Trânsito de São Paulo'
  },
  {
    id: '2',
    name: 'DENATRAN',
    url: 'https://www.denatran.gov.br',
    category: 'government',
    description: 'Departamento Nacional de Trânsito'
  },
  {
    id: '3',
    name: 'Tabela FIPE',
    url: 'https://www.fipe.org.br',
    category: 'tools',
    description: 'Consulta de preços de veículos'
  },
  {
    id: '4',
    name: 'SINTEGRA',
    url: 'https://www.sintegra.gov.br',
    category: 'government',
    description: 'Sistema de consulta de empresas'
  },
  {
    id: '5',
    name: 'Receita Federal',
    url: 'https://www.receita.fazenda.gov.br',
    category: 'government',
    description: 'Portal da Receita Federal'
  },
  {
    id: '6',
    name: 'WebMotors',
    url: 'https://www.webmotors.com.br',
    category: 'commercial',
    description: 'Portal de veículos'
  },
  {
    id: '7',
    name: 'MercadoLivre Carros',
    url: 'https://www.mercadolivre.com.br/carros',
    category: 'commercial',
    description: 'Marketplace de veículos'
  }
];

const WebsiteSettings: React.FC = () => {
  const { 
    allWebsites: websites, 
    createWebsite, 
    updateWebsite, 
    deleteWebsite, 
    isLoading,
    isOnline,
    loadWebsites
  } = useWebsiteSettings();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newWebsite, setNewWebsite] = useState<Partial<WebsiteSettingsInsert>>({
    name: '',
    url: '',
    category: 'other',
    description: ''
  });

  const handleAddWebsite = async () => {
    if (!newWebsite.name || !newWebsite.url) {
      toast({
        title: 'Erro',
        description: 'Nome e URL são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    await createWebsite({
      name: newWebsite.name,
      url: newWebsite.url,
      category: newWebsite.category || 'other',
      description: newWebsite.description
    });
    
    setNewWebsite({ name: '', url: '', category: 'other', description: '' });
    setIsAdding(false);
  };

  const handleEditWebsite = async (id: string, updatedData: Partial<WebsiteLink>) => {
    await updateWebsite(id, updatedData);
    setEditingId(null);
  };

  const handleDeleteWebsite = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este site?')) {
      await deleteWebsite(id);
    }
  };

  const handleOpenWebsite = (url: string, name: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    console.log(`🌐 Abrindo ${name}: ${url}`);
  };

  const handleRefresh = async () => {
    await loadWebsites();
    toast({
      title: 'Atualizado!',
      description: 'Lista de sites recarregada.',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'tools': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'government': return 'Governo';
      case 'commercial': return 'Comercial';
      case 'tools': return 'Ferramentas';
      default: return 'Outros';
    }
  };

  const EditableWebsiteRow = ({ website }: { website: WebsiteLink }) => {
    const [editData, setEditData] = useState(website);

    return (
      <div className="p-4 border rounded-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Nome</Label>
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">URL</Label>
            <Input
              value={editData.url}
              onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              className="h-8"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Categoria</Label>
            <select
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value as WebsiteLink['category'] })}
              className="w-full h-8 px-3 border rounded-md text-sm"
            >
              <option value="government">Governo</option>
              <option value="commercial">Comercial</option>
              <option value="tools">Ferramentas</option>
              <option value="other">Outros</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Descrição</Label>
            <Input
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="h-8"
              placeholder="Opcional"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleEditWebsite(website.id, editData)}
            className="h-7"
          >
            <Save className="h-3 w-3 mr-1" />
            Salvar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingId(null)}
            className="h-7"
          >
            <X className="h-3 w-3 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Sites Úteis</span>
            <Badge variant={isOnline ? "default" : "secondary"} className="ml-2">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Disparar evento de teste
                const event = new CustomEvent('websiteSettingsUpdated', {
                  detail: { timestamp: Date.now(), test: true }
                });
                window.dispatchEvent(event);
                console.log('🧪 Evento de teste disparado para Header');
                toast({
                  title: 'Teste',
                  description: 'Evento de atualização disparado!',
                });
              }}
              className="h-8"
            >
              🧪 Testar
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Configure os sites que aparecerão no menu do cabeçalho. Organize por categorias para facilitar o acesso.
          {!isOnline && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
              ⚠️ Modo offline: Alterações serão salvas localmente e sincronizadas quando o banco estiver disponível.
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando sites...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Botão Adicionar */}
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Sites Configurados ({websites.length})</h3>
              <Button
                size="sm"
                onClick={() => setIsAdding(true)}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Site
              </Button>
            </div>

            {/* Formulário de Adição */}
            {isAdding && (
              <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
                <h4 className="font-medium text-blue-900">Novo Site</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Nome *</Label>
                    <Input
                      value={newWebsite.name || ''}
                      onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                      placeholder="Ex: DETRAN SP"
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">URL *</Label>
                    <Input
                      value={newWebsite.url || ''}
                      onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                      placeholder="https://exemplo.com"
                      className="h-8"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Categoria</Label>
                    <select
                      value={newWebsite.category}
                      onChange={(e) => setNewWebsite({ ...newWebsite, category: e.target.value as WebsiteLink['category'] })}
                      className="w-full h-8 px-3 border rounded-md text-sm"
                    >
                      <option value="government">Governo</option>
                      <option value="commercial">Comercial</option>
                      <option value="tools">Ferramentas</option>
                      <option value="other">Outros</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      value={newWebsite.description || ''}
                      onChange={(e) => setNewWebsite({ ...newWebsite, description: e.target.value })}
                      placeholder="Opcional"
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddWebsite} className="h-7">
                    <Save className="h-3 w-3 mr-1" />
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setNewWebsite({ name: '', url: '', category: 'other', description: '' });
                    }}
                    className="h-7"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Lista de Sites */}
            <div className="space-y-3">
              {websites.map((website) => (
                <div key={website.id}>
                  {editingId === website.id ? (
                    <EditableWebsiteRow website={website} />
                  ) : (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{website.name}</span>
                            <Badge className={`text-xs ${getCategoryColor(website.category)}`}>
                              {getCategoryLabel(website.category)}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {website.url}
                            {website.description && (
                              <span> • {website.description}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenWebsite(website.url, website.name)}
                          className="h-7 w-7 p-0"
                          title="Abrir site"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(website.id)}
                          className="h-7 w-7 p-0"
                          title="Editar"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteWebsite(website.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          title="Remover"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {websites.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum site configurado</p>
                <p className="text-sm">Clique em "Adicionar Site" para começar</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteSettings; 