import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Stop, 
  Copy, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Brain,
  FileText,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ExternalAPI, ExternalAPIEndpoint, TestAPIRequest, TestAPIResponse } from '@/types/externalApi';

interface APITesterProps {
  api: ExternalAPI;
  endpoints: ExternalAPIEndpoint[];
  onTest: (data: TestAPIRequest) => Promise<TestAPIResponse | null>;
  onEditEndpoint?: (endpoint: ExternalAPIEndpoint) => void;
  onDeleteEndpoint?: (endpointId: string) => void;
}

export const APITester: React.FC<APITesterProps> = ({ 
  api, 
  endpoints: endpointsProp, 
  onTest, 
  onEditEndpoint, 
  onDeleteEndpoint 
}) => {
  const [endpoints, setEndpoints] = useState<ExternalAPIEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ExternalAPIEndpoint | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [customMethod, setCustomMethod] = useState('GET');
  const [customHeaders, setCustomHeaders] = useState<Array<{ name: string; value: string }>>([]);
  const [customBody, setCustomBody] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestAPIResponse | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newHeader, setNewHeader] = useState({ name: '', value: '' });

  // Carregar endpoints da API
  useEffect(() => {
    setEndpoints(endpointsProp || []);
    // Se há endpoints disponíveis e nenhum está selecionado, selecionar o primeiro
    if (endpointsProp && endpointsProp.length > 0 && !selectedEndpoint) {
      const firstEndpoint = endpointsProp[0];
      setSelectedEndpoint(firstEndpoint);
      setCustomMethod(firstEndpoint.method);
      setCustomUrl(''); // Limpar URL customizada quando selecionar endpoint
    }
  }, [endpointsProp]);

  // Resetar estado quando a API mudar
  useEffect(() => {
    setSelectedEndpoint(null);
    setCustomUrl('');
    setCustomMethod('GET');
    setCustomHeaders([]);
    setCustomBody('');
    setTestResult(null);
  }, [api.id]);

  const handleTest = async () => {
    if (!customUrl && !selectedEndpoint) {
      toast({
        title: 'Erro',
        description: 'Selecione um endpoint ou digite uma URL customizada',
        variant: 'destructive'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const testData: TestAPIRequest = {
        api_id: api.id,
        endpoint_id: selectedEndpoint?.id || undefined,
        custom_url: customUrl || undefined,
        custom_method: customMethod,
        custom_headers: customHeaders.reduce((acc, header) => {
          if (header.name && header.value) {
            acc[header.name] = header.value;
          }
          return acc;
        }, {} as Record<string, string>),
        custom_body: customBody || undefined
      };

      console.log('Dados do teste sendo enviados:', testData);
      console.log('URL que será testada:', selectedEndpoint 
        ? `${api.base_url}${selectedEndpoint.path}` 
        : customUrl
      );

      const result = await onTest(testData);
      if (result) {
        setTestResult(result);
      } else {
        // Garantir que algo seja exibido
        setTestResult({
          success: false,
          url: testData.custom_url || (selectedEndpoint ? `${api.base_url}${selectedEndpoint.path}` : api.base_url),
          method: customMethod,
          headers: {},
          response_time_ms: 0,
          status: 0,
          body: '',
          error: 'Sem resposta da função'
        } as TestAPIResponse);
      }
      
      if (result?.success) {
        toast({
          title: 'Sucesso',
          description: 'Teste realizado com sucesso!'
        });
      } else {
        toast({
          title: 'Erro',
          description: result?.error || 'Erro ao testar API',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao executar teste:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao executar teste',
        variant: 'destructive'
      });

      const errorMessage = error instanceof Error ? error.message : 'Erro ao executar teste';
      setTestResult({
        success: false,
        url: customUrl || (selectedEndpoint ? `${api.base_url}${selectedEndpoint.path}` : api.base_url),
        method: customMethod,
        headers: {},
        response_time_ms: 0,
        status: 0,
        body: '',
        error: errorMessage
      } as TestAPIResponse);
    } finally {
      setIsTesting(false);
    }
  };

  const addHeader = () => {
    if (newHeader.name && newHeader.value) {
      setCustomHeaders(prev => [...prev, { ...newHeader }]);
      setNewHeader({ name: '', value: '' });
    }
  };

  const removeHeader = (index: number) => {
    setCustomHeaders(prev => prev.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'Conteúdo copiado para a área de transferência!'
    });
  };

  const downloadResult = () => {
    if (!testResult) return;

    const data = {
      api: api.name,
      test_date: new Date().toISOString(),
      request: {
        url: testResult.url,
        method: testResult.method,
        headers: testResult.headers,
      },
      response: {
        status: testResult.status,
        body: testResult.body,
        response_time: testResult.response_time_ms,
        success: testResult.success
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-result-${api.name}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    if (!testResult) return null;
    
    if (testResult.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    if (!testResult) return null;
    
    if (testResult.success) {
      return <Badge variant="default" className="bg-green-500">Sucesso</Badge>;
    } else {
      return <Badge variant="destructive">Erro</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Testar API</h2>
          <p className="text-muted-foreground">
            {api.name} - {api.base_url}
          </p>
        </div>
        {selectedEndpoint && onEditEndpoint && (
          <Button variant="outline" onClick={() => onEditEndpoint(selectedEndpoint)}>
            Editar Endpoint
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração do Teste */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuração do Teste
              </CardTitle>
              <CardDescription>
                Configure os parâmetros do teste
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Seleção de Endpoint */}
              <div>
                <Label>Endpoint</Label>
                <Select
                  value={selectedEndpoint?.id || 'custom'}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      // Opção "URL Customizada" selecionada
                      setSelectedEndpoint(null);
                      setCustomUrl('');
                      setCustomMethod('GET');
                    } else {
                      const endpoint = endpoints.find(e => e.id === value);
                      setSelectedEndpoint(endpoint || null);
                      if (endpoint) {
                        setCustomUrl('');
                        setCustomMethod(endpoint.method);
                        // Pré-preencher headers se o endpoint tiver
                        if (endpoint.headers && Object.keys(endpoint.headers).length > 0) {
                          const endpointHeaders = Object.entries(endpoint.headers).map(([name, value]) => ({
                            name,
                            value: String(value)
                          }));
                          setCustomHeaders(endpointHeaders);
                        }
                        // Pré-preencher body se o endpoint tiver
                        if (endpoint.body) {
                          setCustomBody(typeof endpoint.body === 'string' ? endpoint.body : JSON.stringify(endpoint.body, null, 2));
                        }
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um endpoint ou use URL customizada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">URL Customizada</SelectItem>
                    {endpoints.map((endpoint) => (
                      <SelectItem key={endpoint.id} value={endpoint.id}>
                        {endpoint.name} ({endpoint.method}) - {endpoint.path}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedEndpoint && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <div><strong>Caminho:</strong> {selectedEndpoint.path}</div>
                    {selectedEndpoint.description && (
                      <div><strong>Descrição:</strong> {selectedEndpoint.description}</div>
                    )}
                  </div>
                )}
              </div>

              {/* URL Customizada */}
              <div>
                <Label>URL Customizada {selectedEndpoint ? '(desabilitada - endpoint selecionado)' : ''}</Label>
                <Input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://api.exemplo.com/v1/endpoint"
                  disabled={!!selectedEndpoint}
                />
                {!selectedEndpoint && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Use este campo para testar URLs que não estão cadastradas como endpoints
                  </p>
                )}
              </div>

              {/* URL Final que será testada */}
              <div>
                <Label>URL Final</Label>
                <div className="p-2 bg-muted rounded font-mono text-sm break-all">
                  {(() => {
                    if (customUrl) {
                      return customUrl;
                    } else if (selectedEndpoint) {
                      const baseUrl = api.base_url.endsWith('/') ? api.base_url.slice(0, -1) : api.base_url;
                      const path = selectedEndpoint.path.startsWith('/') ? selectedEndpoint.path : '/' + selectedEndpoint.path;
                      return baseUrl + path;
                    } else {
                      return api.base_url || 'Nenhuma URL definida';
                    }
                  })()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Esta é a URL que será testada quando você clicar em "Executar Teste"
                </p>
              </div>

              {/* Método HTTP */}
              <div>
                <Label>Método HTTP</Label>
                <Select
                  value={customMethod}
                  onValueChange={setCustomMethod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Headers Customizados */}
              <div>
                <Label>Headers Customizados</Label>
                <div className="space-y-2">
                  {customHeaders.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={header.name}
                        onChange={(e) => {
                          const newHeaders = [...customHeaders];
                          newHeaders[index].name = e.target.value;
                          setCustomHeaders(newHeaders);
                        }}
                        placeholder="Nome do header"
                        className="flex-1"
                      />
                      <Input
                        value={header.value}
                        onChange={(e) => {
                          const newHeaders = [...customHeaders];
                          newHeaders[index].value = e.target.value;
                          setCustomHeaders(newHeaders);
                        }}
                        placeholder="Valor do header"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeHeader(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newHeader.name}
                      onChange={(e) => setNewHeader(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do header"
                      className="flex-1"
                    />
                    <Input
                      value={newHeader.value}
                      onChange={(e) => setNewHeader(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Valor do header"
                      className="flex-1"
                    />
                    <Button onClick={addHeader}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Body */}
              {['POST', 'PUT', 'PATCH'].includes(customMethod) && (
                <div>
                  <Label>Body da Requisição</Label>
                  <Textarea
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
              )}

              {/* Botão de Teste */}
              <Button 
                onClick={handleTest} 
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Executar Teste
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Informações da API */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Informações da API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Nome:</span> {api.name}
              </div>
              <div>
                <span className="font-medium">URL Base:</span>
                <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{api.base_url}</p>
              </div>
              <div>
                <span className="font-medium">Autenticação:</span> {api.auth_type}
              </div>
              {api.auth_type !== 'none' && (
                <div>
                  <span className="font-medium">API Key:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={api.api_key || ''}
                      readOnly
                      type={showApiKey ? 'text' : 'password'}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
              {/* Informação de IA desabilitada */}
              <div className="flex items-center gap-2 opacity-50 pointer-events-none">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600">Análise de IA (em breve)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultado do Teste */}
        <div className="space-y-6">
          {testResult ? (
            <>
              {/* Resumo do Resultado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon()}
                    Resultado do Teste
                    {getStatusBadge()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Status:</span> {testResult.status}
                    </div>
                    <div>
                      <span className="font-medium">Tempo:</span> {testResult.response_time_ms}ms
                    </div>
                    <div>
                      <span className="font-medium">Método:</span> {testResult.method}
                    </div>
                    <div>
                      <span className="font-medium">Sucesso:</span> {testResult.success ? 'Sim' : 'Não'}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">URL:</span>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{testResult.url}</p>
                  </div>

                  {testResult.error && (
                    <Alert variant="destructive">
                      <AlertDescription>{testResult.error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(testResult, null, 2))}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Resultado
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadResult}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detalhes da Resposta */}
              <Tabs defaultValue="response" className="w-full">
                <TabsList>
                  <TabsTrigger value="response">Resposta</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="request">Requisição</TabsTrigger>
                  <TabsTrigger value="json">JSON Completo</TabsTrigger>
                </TabsList>

                <TabsContent value="response" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Body da Resposta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Tentar parsear como JSON
                        try {
                          const json = JSON.parse(testResult.body);
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Coluna JSON formatado */}
                              <pre className="text-sm bg-muted p-4 rounded overflow-x-auto max-h-96">
                                {JSON.stringify(json, null, 2)}
                              </pre>
                              {/* Coluna Texto bruto */}
                              <pre className="text-sm bg-muted p-4 rounded overflow-x-auto max-h-96">
                                {testResult.body}
                              </pre>
                            </div>
                          );
                        } catch {
                          // Se não for JSON, mostrar apenas texto bruto
                          return (
                            <pre className="text-sm bg-muted p-4 rounded overflow-x-auto max-h-96">
                              {testResult.body}
                            </pre>
                          );
                        }
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="headers" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Headers da Resposta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                        {JSON.stringify(testResult.headers, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="request" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes da Requisição</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="font-medium">URL:</span>
                        <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{testResult.url}</p>
                      </div>
                      <div>
                        <span className="font-medium">Método:</span> {testResult.method}
                      </div>
                      <div>
                        <span className="font-medium">Headers:</span>
                        <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(testResult.headers, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="json" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>JSON Completo do Teste</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-muted p-4 rounded overflow-x-auto max-h-96">
                        {JSON.stringify(testResult, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhum teste executado</h3>
                <p className="text-muted-foreground">
                  Configure os parâmetros e execute um teste para ver os resultados aqui.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 