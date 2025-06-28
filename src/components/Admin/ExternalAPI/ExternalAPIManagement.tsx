import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Settings, 
  TestTube, 
  History, 
  Trash2, 
  Edit, 
  Eye, 
  Download,
  Upload,
  FileText,
  Brain,
  MessageSquare,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useExternalAPIs } from '@/hooks/useExternalAPIs';
import { ExternalAPI, CurlImportData, JsonImportData, ExternalAPITestHistory, TestAPIRequest, TestAPIResponse, CreateExternalAPIRequest } from '@/types/externalApi';
import APIForm from './APIForm';
import { APIForm as APIFormNew } from './APIFormNew';
import { N8NStyleAPIForm } from './N8NStyleAPIForm';
import { APITester } from './APITester';
import { TestHistory } from './TestHistory';
import { CurlImportModal } from './CurlImportModal';
import { JsonImportModal } from './JsonImportModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useViewPreferences } from '@/hooks/useViewPreferences';
import ViewModeSelector from './ViewModeSelector';
import APIListView from './APIListView';

export const ExternalAPIManagement: React.FC = () => {
  const {
    apis,
    endpoints,
    testHistory,
    loading,
    error,
    fetchAPIs,
    fetchEndpoints,
    fetchTestHistory,
    createAPI,
    updateAPI,
    deleteAPI,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    testAPI,
    getActiveAPIs,
    getMCPServers,
    clearError
  } = useExternalAPIs();

  // Hook para preferências de visualização
  const { viewMode, setViewMode } = useViewPreferences('external_apis', 'card', {
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [activeTab, setActiveTab] = useState('apis');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formStyle, setFormStyle] = useState<'classic' | 'n8n'>('classic');
  
  const [selectedAPI, setSelectedAPI] = useState<ExternalAPI | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<ExternalAPITestHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterAuth, setFilterAuth] = useState<'all' | 'none' | 'api_key' | 'bearer' | 'basic'>('all');

  // Filtrar APIs baseado no termo de busca
  const filteredAPIs = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.base_url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && api.is_active) ||
                         (filterStatus === 'inactive' && !api.is_active);
    const matchesAuth = filterAuth === 'all' || api.auth_type === filterAuth;
    
    return matchesSearch && matchesStatus && matchesAuth;
  });

  const handleCreateAPI = async (data: Partial<ExternalAPI>) => {
    try {
      // Converter para CreateExternalAPIRequest
      const createData: CreateExternalAPIRequest = {
        name: data.name || '',
        description: data.description,
        base_url: data.base_url || '',
        auth_type: data.auth_type || 'none',
        api_key: data.api_key,
        headers: data.headers,
        is_active: data.is_active ?? true,
        is_mcp_server: data.is_mcp_server ?? false,
        mcp_tools: data.mcp_tools,
        observations: data.observations,
        documentation: data.documentation,
        ai_analysis_enabled: data.ai_analysis_enabled,
        ai_key_id: data.ai_key_id
      };
      
      await createAPI(createData);
      setShowCreateForm(false);
      toast({
        title: 'Sucesso',
        description: 'API criada com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar API',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateAPI = async (data: Partial<ExternalAPI>) => {
    if (!selectedAPI) return;
    
    try {
      await updateAPI(selectedAPI.id, data);
      setShowEditForm(false);
      setSelectedAPI(null);
      toast({
        title: 'Sucesso',
        description: 'API atualizada com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar API',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAPI = async () => {
    if (!selectedAPI) return;
    
    try {
      await deleteAPI(selectedAPI.id);
      setShowDeleteConfirm(false);
      setSelectedAPI(null);
      toast({
        title: 'Sucesso',
        description: 'API excluída com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir API',
        variant: 'destructive'
      });
    }
  };

  const handleTestAPI = async (api: ExternalAPI) => {
    try {
      setSelectedAPI(api);
      await fetchEndpoints(api.id);
      setShowTester(true);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar endpoints da API',
        variant: 'destructive'
      });
    }
  };

  const handleViewHistory = async (api: ExternalAPI) => {
    try {
      await fetchTestHistory(api.id);
      setSelectedHistory(testHistory);
      setSelectedAPI(api);
      setShowHistory(true);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar histórico',
        variant: 'destructive'
      });
    }
  };

  const handleCurlImport = async (data: any) => {
    console.log('handleCurlImport chamado com:', data);
    try {
      // Extrair base_url de forma segura
      let baseUrl = '';
      try {
        baseUrl = new URL(data.url).origin;
      } catch {
        // Se falhar, usar a URL completa
        baseUrl = data.url;
      }

      const apiData = {
        name: `API importada de cURL`,
        description: `Importada via cURL: ${data.method} ${data.url}`,
        base_url: baseUrl,
        auth_type: 'none' as const,
        headers: Object.entries(data.headers || {}).map(([name, value]) => ({ name, value: String(value) })),
        is_active: true
      };

      console.log('Dados convertidos para API:', apiData);
      await handleCreateAPI(apiData);
      
      toast({
        title: 'Sucesso',
        description: 'API importada do cURL com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao importar cURL:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao importar cURL',
        variant: 'destructive'
      });
    }
  };

  const handleJsonImport = async (data: any) => {
    console.log('handleJsonImport chamado com:', data);
    try {
      const apiData = {
        name: data.name || 'API importada de JSON',
        description: data.description || 'Importada via JSON',
        base_url: data.base_url || '',
        auth_type: 'none' as const,
        headers: data.headers ? Object.entries(data.headers).map(([name, value]) => ({ name, value: String(value) })) : [],
        is_active: true
      };

      console.log('Dados convertidos para API:', apiData);
      await handleCreateAPI(apiData);
      
      toast({
        title: 'Sucesso',
        description: 'API importada do JSON com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao importar JSON:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao importar JSON',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (api: ExternalAPI) => {
    if (api.is_active) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (api: ExternalAPI) => {
    if (api.is_active) {
      return <Badge variant="default" className="bg-green-500">Ativa</Badge>;
    } else {
      return <Badge variant="secondary">Inativa</Badge>;
    }
  };

  const getAuthBadge = (api: ExternalAPI) => {
    const authTypes = {
      none: { label: 'Nenhuma', variant: 'secondary' as const },
      api_key: { label: 'API Key', variant: 'default' as const },
      bearer: { label: 'Bearer', variant: 'default' as const },
      basic: { label: 'Basic', variant: 'default' as const }
    };
    
    const auth = authTypes[api.auth_type] || authTypes.none;
    return <Badge variant={auth.variant}>{auth.label}</Badge>;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'Conteúdo copiado para a área de transferência!'
    });
  };

  const downloadAPIList = () => {
    const data = {
      export_date: new Date().toISOString(),
      apis: apis.map(api => ({
        name: api.name,
        base_url: api.base_url,
        auth_type: api.auth_type,
        is_active: api.is_active,
        created_at: api.created_at,
        observations: api.observations,
        documentation: api.documentation
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apis-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditAPI = (api: ExternalAPI) => {
    setSelectedAPI(api);
    setShowEditForm(true);
  };

  useEffect(() => {
    fetchAPIs();
  }, [fetchAPIs]);

  if (loading && apis.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p>Carregando APIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de APIs Externas</h1>
          <p className="text-muted-foreground">
            Gerencie e teste suas APIs externas
          </p>
        </div>
        <div className="flex gap-2">
          {/* Seletor de modo de visualização */}
          <ViewModeSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* Seletor de estilo de formulário */}
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-muted-foreground">Estilo:</span>
            <div className="flex border rounded-md">
              <Button
                variant={formStyle === 'classic' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFormStyle('classic')}
                className="rounded-r-none"
              >
                Clássico
              </Button>
              <Button
                variant={formStyle === 'n8n' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFormStyle('n8n')}
                className="rounded-l-none"
              >
                N8N
              </Button>
            </div>
          </div>
          
          <CurlImportModal
            onImport={handleCurlImport}
          >
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Importar cURL
            </Button>
          </CurlImportModal>
          
          <JsonImportModal
            onImport={handleJsonImport}
          >
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Importar JSON
            </Button>
          </JsonImportModal>
          <Button variant="outline" onClick={downloadAPIList}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova API
          </Button>
        </div>
      </div>

      {/* Erro */}
      {error && !error.includes('relation "external_apis" does not exist') && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="link" onClick={clearError} className="p-0 h-auto">
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Aviso sobre migração pendente */}
      {error && error.includes('relation "external_apis" does not exist') && (
        <Alert>
          <AlertDescription>
            As tabelas do sistema de APIs externas ainda não foram criadas. 
            Execute as migrações do banco de dados para usar esta funcionalidade.
            <Button variant="link" onClick={clearError} className="p-0 h-auto ml-2">
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar APIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
            
            <select
              value={filterAuth}
              onChange={(e) => setFilterAuth(e.target.value as any)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Autenticações</option>
              <option value="none">Sem Autenticação</option>
              <option value="api_key">API Key</option>
              <option value="bearer">Bearer Token</option>
              <option value="basic">Basic Auth</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de APIs</p>
                <p className="text-2xl font-bold">{apis.length}</p>
              </div>
              <Settings className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">APIs Ativas</p>
                <p className="text-2xl font-bold">{apis.filter(api => api.is_active).length}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servidores MCP</p>
                <p className="text-2xl font-bold">{getMCPServers().length}</p>
              </div>
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Endpoints</p>
                <p className="text-2xl font-bold">{endpoints.length}</p>
              </div>
              <TestTube className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="apis">APIs ({filteredAPIs.length})</TabsTrigger>
          <TabsTrigger value="history">Histórico Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-4">
          {filteredAPIs.length > 0 ? (
            <>
              {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAPIs.map((api) => (
                    <Card key={api.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(api)}
                            <div>
                              <CardTitle className="text-lg">{api.name}</CardTitle>
                              <CardDescription className="font-mono text-sm">
                                {api.base_url}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusBadge(api)}
                            {getAuthBadge(api)}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Informações da API */}
                        <div className="space-y-2">
                          {api.observations && (
                            <p className="text-sm text-muted-foreground">
                              {api.observations}
                            </p>
                          )}
                          
                          {/* Informação de IA desabilitada */}
                          <div className="flex items-center gap-2 text-sm text-blue-600 opacity-50 pointer-events-none">
                            <Brain className="h-4 w-4" />
                            Análise de IA (em breve)
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleTestAPI(api)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewHistory(api)}
                          >
                            <History className="h-4 w-4 mr-1" />
                            Histórico
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAPI(api)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAPI(api);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

                             {viewMode === 'list' && (
                 <APIListView
                   apis={filteredAPIs}
                   onTest={handleTestAPI}
                   onViewHistory={handleViewHistory}
                   onEdit={handleEditAPI}
                   onDelete={(api) => {
                     setSelectedAPI(api);
                     setShowDeleteConfirm(true);
                   }}
                 />
               )}

                             {viewMode === 'table' && (
                 <APIListView
                   apis={filteredAPIs}
                   onTest={handleTestAPI}
                   onViewHistory={handleViewHistory}
                   onEdit={handleEditAPI}
                   onDelete={(api) => {
                     setSelectedAPI(api);
                     setShowDeleteConfirm(true);
                   }}
                 />
               )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ExternalLink className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm || filterStatus !== 'all' || filterAuth !== 'all' 
                    ? 'Nenhuma API encontrada' 
                    : 'Nenhuma API configurada'
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' || filterAuth !== 'all'
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando sua primeira API externa.'
                  }
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira API
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico Geral de Testes</CardTitle>
              <CardDescription>
                Visualize todos os testes realizados em todas as APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testHistory.length > 0 ? (
                  testHistory.map((test) => {
                    const api = apis.find(a => a.id === test.api_id);
                    return (
                      <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {test.is_success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium">{api?.name || 'API Desconhecida'}</div>
                            <div className="text-sm text-muted-foreground">
                              {test.request_method} - {test.request_url}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(test.created_at).toLocaleString('pt-BR')} - {test.response_time_ms}ms
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={test.is_success ? "default" : "destructive"}>
                            {test.response_status}
                          </Badge>
                          {test.ai_analysis && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Brain className="h-3 w-3" />
                              IA
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhum teste realizado ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formStyle === 'n8n' ? (
                <div className="flex items-center gap-2">
                  Criar Nova API 
                  <Badge variant="secondary">Estilo N8N</Badge>
                </div>
              ) : (
                'Criar Nova API'
              )}
            </DialogTitle>
          </DialogHeader>
          {formStyle === 'n8n' ? (
            <N8NStyleAPIForm
              onSubmit={handleCreateAPI}
              onCancel={() => setShowCreateForm(false)}
              isLoading={loading}
            />
          ) : (
            <APIForm
              onSubmit={handleCreateAPI}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formStyle === 'n8n' ? (
                <div className="flex items-center gap-2">
                  Editar API: {selectedAPI?.name}
                  <Badge variant="secondary">Estilo N8N</Badge>
                </div>
              ) : (
                `Editar API: ${selectedAPI?.name}`
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedAPI && (
            formStyle === 'n8n' ? (
              <N8NStyleAPIForm
                api={selectedAPI}
                onSubmit={handleUpdateAPI}
                onCancel={() => {
                  setShowEditForm(false);
                  setSelectedAPI(null);
                }}
                isLoading={loading}
              />
            ) : (
              <APIForm
                initialData={selectedAPI}
                onSubmit={handleUpdateAPI}
              />
            )
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showTester} onOpenChange={setShowTester}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Testar API: {selectedAPI?.name}</DialogTitle>
          </DialogHeader>
          {selectedAPI && (
            <APITester
              api={selectedAPI}
              endpoints={endpoints}
              onTest={async (data) => {
                try {
                  const result = await testAPI(data);
                  return result;
                } catch (error) {
                  toast({
                    title: 'Erro',
                    description: 'Erro ao testar API',
                    variant: 'destructive'
                  });
                  return null;
                }
              }}
              onEditEndpoint={() => {}}
              onDeleteEndpoint={() => {}}
            />
          )}
        </DialogContent>
      </Dialog>

      {showHistory && selectedAPI && (
        <TestHistory
          api={selectedAPI}
          history={selectedHistory}
          onClose={() => {
            setShowHistory(false);
            setSelectedAPI(null);
            setSelectedHistory([]);
          }}
        />
      )}

      {showDeleteConfirm && selectedAPI && (
        <DeleteConfirmationModal
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={handleDeleteAPI}
          title="Excluir API Externa"
          description="Tem certeza que deseja excluir esta API? Esta ação não pode ser desfeita."
          itemName={selectedAPI.name}
          itemType="API"
          isDeleting={loading}
        />
      )}
    </div>
  );
}; 