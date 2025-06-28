import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Plus, 
  Settings, 
  TestTube, 
  History, 
  Server, 
  Database,
  Edit,
  Trash2,
  Play,
  Eye
} from 'lucide-react';
import { useExternalAPIs } from '@/hooks/useExternalAPIs';
import { ExternalAPI } from '@/types/externalApi';
import APIForm from './ExternalAPI/APIForm';
import EndpointForm from './ExternalAPI/EndpointForm';
import { APITester } from './ExternalAPI/APITester';
import { TestHistory } from './ExternalAPI/TestHistory';
import MCPServerForm from './ExternalAPI/MCPServerForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const ExternalAPIManager: React.FC = () => {
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
    getMCPServers
  } = useExternalAPIs();

  const [selectedAPI, setSelectedAPI] = useState<ExternalAPI | null>(null);
  const [activeTab, setActiveTab] = useState('apis');
  const [showAPIForm, setShowAPIForm] = useState(false);
  const [showEndpointForm, setShowEndpointForm] = useState(false);
  const [showMCPServerForm, setShowMCPServerForm] = useState(false);
  const [editingAPI, setEditingAPI] = useState<ExternalAPI | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<any>(null);

  const handleCreateAPI = async (apiData: any) => {
    const result = await createAPI(apiData);
    if (result) {
      setShowAPIForm(false);
      setSelectedAPI(result);
    } else {
      setShowAPIForm(false);
      setSelectedAPI(null);
    }
  };

  const handleUpdateAPI = async (apiData: any) => {
    if (editingAPI) {
      const result = await updateAPI(editingAPI.id, apiData);
      if (result) {
        setShowAPIForm(false);
        setEditingAPI(null);
        setSelectedAPI(result);
      }
    }
  };

  const handleDeleteAPI = async (api: ExternalAPI) => {
    if (confirm(`Tem certeza que deseja remover a API "${api.name}"?`)) {
      const success = await deleteAPI(api.id);
      if (success && selectedAPI?.id === api.id) {
        setSelectedAPI(null);
      }
    }
  };

  const handleCreateEndpoint = async (endpointData: any) => {
    if (selectedAPI) {
      const result = await createEndpoint({
        ...endpointData,
        api_id: selectedAPI.id
      });
      if (result) {
        setShowEndpointForm(false);
        await fetchEndpoints(selectedAPI.id);
      }
    }
  };

  const handleUpdateEndpoint = async (endpointData: any) => {
    if (editingEndpoint) {
      const result = await updateEndpoint(editingEndpoint.id, endpointData);
      if (result) {
        setShowEndpointForm(false);
        setEditingEndpoint(null);
        await fetchEndpoints(selectedAPI!.id);
      }
    }
  };

  const handleDeleteEndpoint = async (endpointId: string) => {
    if (confirm('Tem certeza que deseja remover este endpoint?')) {
      const success = await deleteEndpoint(endpointId);
      if (success && selectedAPI) {
        await fetchEndpoints(selectedAPI.id);
      }
    }
  };

  const handleCreateMCPServer = async (mcpData: any) => {
    const result = await createAPI({
      ...mcpData,
      is_mcp_server: true
    });
    if (result) {
      setShowMCPServerForm(false);
      setSelectedAPI(result);
    }
  };

  const handleSelectAPI = (api: ExternalAPI) => {
    setSelectedAPI(api);
    fetchEndpoints(api.id);
    fetchTestHistory(api.id);
  };

  const handleEditAPI = (api: ExternalAPI) => {
    setEditingAPI(api);
    setShowAPIForm(true);
  };

  const handleEditEndpoint = (endpoint: any) => {
    setEditingEndpoint(endpoint);
    setShowEndpointForm(true);
  };

  const activeAPIs = getActiveAPIs();
  const mcpServers = getMCPServers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">APIs Externas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas integrações com APIs externas e servidores MCP</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showMCPServerForm} onOpenChange={setShowMCPServerForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Criar Servidor MCP
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Servidor MCP</DialogTitle>
              </DialogHeader>
              <MCPServerForm onSubmit={handleCreateMCPServer} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAPIForm} onOpenChange={setShowAPIForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova API
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAPI ? 'Editar API' : 'Nova API Externa'}
                </DialogTitle>
              </DialogHeader>
              <APIForm 
                onSubmit={editingAPI ? handleUpdateAPI : handleCreateAPI}
                initialData={editingAPI}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            APIs ({apis.length})
          </TabsTrigger>
          <TabsTrigger value="mcp" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Servidores MCP ({mcpServers.length})
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Testar APIs
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Tab: Lista de APIs */}
        <TabsContent value="apis" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apis.map((api) => (
              <Card 
                key={api.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAPI?.id === api.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectAPI(api)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {api.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {api.description || 'Sem descrição'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      {api.is_mcp_server && (
                        <Badge variant="secondary" className="text-xs">
                          MCP
                        </Badge>
                      )}
                      <Badge variant={api.is_active ? "default" : "secondary"} className="text-xs">
                        {api.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="font-medium">URL Base:</div>
                    <div className="truncate">{api.base_url}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {api.auth_type !== 'none' ? `Auth: ${api.auth_type}` : 'Sem autenticação'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAPI(api);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAPI(api);
                        }}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {apis.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <ExternalLink className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma API configurada</h3>
                <p className="text-gray-500 mb-4">
                  Comece adicionando sua primeira API externa para integrar com outros sistemas.
                </p>
                <Button onClick={() => setShowAPIForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira API
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Servidores MCP */}
        <TabsContent value="mcp" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mcpServers.map((api) => (
              <Card 
                key={api.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAPI?.id === api.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectAPI(api)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        {api.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {api.mcp_config?.server_description || 'Servidor MCP'}
                      </CardDescription>
                    </div>
                    <Badge variant="default" className="text-xs">
                      MCP v{api.mcp_config?.server_version || '1.0'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="font-medium">Capacidades:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {api.mcp_config?.capabilities?.slice(0, 3).map((cap: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {api.mcp_config?.capabilities?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{api.mcp_config.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {api.mcp_config?.tools?.length || 0} ferramentas
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAPI(api);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAPI(api);
                        }}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mcpServers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Server className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum servidor MCP configurado</h3>
                <p className="text-gray-500 mb-4">
                  Configure servidores MCP para expandir as capacidades do sistema com ferramentas externas.
                </p>
                <Button onClick={() => setShowMCPServerForm(true)}>
                  <Server className="h-4 w-4 mr-2" />
                  Criar Servidor MCP
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Testar APIs */}
        <TabsContent value="test" className="mt-6">
          {selectedAPI ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Testando: {selectedAPI.name}</h3>
                  <p className="text-gray-600">{selectedAPI.base_url}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowEndpointForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Novo Endpoint
                </Button>
              </div>

              <APITester 
                api={selectedAPI}
                endpoints={endpoints}
                onTest={testAPI}
                onEditEndpoint={handleEditEndpoint}
                onDeleteEndpoint={handleDeleteEndpoint}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma API para testar</h3>
                <p className="text-gray-500">
                  Escolha uma API da lista acima para começar a testar endpoints e funcionalidades.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Histórico */}
        <TabsContent value="history" className="mt-6">
          <TestHistory 
            testHistory={testHistory}
            apis={apis}
            selectedAPI={selectedAPI}
            onSelectAPI={handleSelectAPI}
          />
        </TabsContent>
      </Tabs>

      {/* Formulário de Endpoint */}
      <Dialog open={showEndpointForm} onOpenChange={setShowEndpointForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEndpoint ? 'Editar Endpoint' : 'Novo Endpoint'}
            </DialogTitle>
          </DialogHeader>
          <EndpointForm 
            onSubmit={editingEndpoint ? handleUpdateEndpoint : handleCreateEndpoint}
            initialData={editingEndpoint}
            apiId={selectedAPI?.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExternalAPIManager; 