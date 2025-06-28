import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings,
  Globe,
  Lock,
  Key,
  Code,
  FileText,
  Zap,
  TestTube
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ExternalAPI, CreateExternalAPIRequest, UpdateExternalAPIRequest } from '@/types/externalApi';

interface N8NStyleAPIFormProps {
  api?: ExternalAPI;
  onSubmit: (data: CreateExternalAPIRequest | UpdateExternalAPIRequest) => Promise<void>;
  onCancel: () => void;
  onTest?: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const N8NStyleAPIForm: React.FC<N8NStyleAPIFormProps> = ({
  api,
  onSubmit,
  onCancel,
  onTest,
  isLoading = false
}) => {
  const isEditMode = !!api;
  
  // Estados do formulário no estilo N8N
  const [formData, setFormData] = useState({
    // Configurações básicas (como no N8N)
    name: '',
    description: '',
    requestMethod: 'GET',
    url: '',
    
    // Autenticação (como no N8N)
    authentication: 'none',
    authData: {
      apiKey: '',
      apiKeyValue: '',
      bearerToken: '',
      username: '',
      password: ''
    },
    
    // Headers (como no N8N)
    sendHeaders: false,
    headerParameters: [] as Array<{name: string, value: string}>,
    
    // Query Parameters (como no N8N)
    sendQuery: false,
    queryParameters: [] as Array<{name: string, value: string}>,
    
    // Body (como no N8N)
    sendBody: false,
    bodyContentType: 'json',
    bodyJson: '',
    bodyFormData: [] as Array<{name: string, value: string}>,
    bodyRaw: '',
    
    // Configurações específicas do Revenshop
    is_active: true,
    observations: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Carregar dados da API se estiver editando
  useEffect(() => {
    if (api) {
      const headers = Array.isArray(api.headers) ? api.headers : [];
      
      setFormData({
        name: api.name || '',
        description: api.description || '',
        requestMethod: 'GET',
        url: api.base_url || '',
        authentication: api.auth_type || 'none',
        authData: {
          apiKey: 'Authorization',
          apiKeyValue: api.api_key || '',
          bearerToken: api.api_key || '',
          username: '',
          password: ''
        },
        sendHeaders: headers.length > 0,
        headerParameters: headers.map((h: any) => ({
          name: h.name || h.key || '',
          value: h.value || ''
        })),
        sendQuery: false,
        queryParameters: [],
        sendBody: false,
        bodyContentType: 'json',
        bodyJson: '',
        bodyFormData: [],
        bodyRaw: '',
        is_active: api.is_active ?? true,
        observations: api.observations || ''
      });
    }
  }, [api]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      authData: {
        ...prev.authData,
        [field]: value
      }
    }));
  };

  const addParameter = (type: 'header' | 'query' | 'formData') => {
    const field = type === 'header' ? 'headerParameters' : 
                  type === 'query' ? 'queryParameters' : 'bodyFormData';
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { name: '', value: '' }]
    }));
  };

  const removeParameter = (type: 'header' | 'query' | 'formData', index: number) => {
    const field = type === 'header' ? 'headerParameters' : 
                  type === 'query' ? 'queryParameters' : 'bodyFormData';
    
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateParameter = (type: 'header' | 'query' | 'formData', index: number, field: 'name' | 'value', value: string) => {
    const arrayField = type === 'header' ? 'headerParameters' : 
                       type === 'query' ? 'queryParameters' : 'bodyFormData';
    
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Converter dados do formato N8N para o formato do Revenshop
      const apiData: CreateExternalAPIRequest | UpdateExternalAPIRequest = {
        name: formData.name,
        description: formData.description,
        base_url: formData.url,
        auth_type: formData.authentication as any,
        api_key: formData.authentication === 'api_key' ? formData.authData.apiKeyValue :
                 formData.authentication === 'bearer' ? formData.authData.bearerToken : '',
        headers: formData.sendHeaders ? formData.headerParameters.filter(h => h.name) : [],
        is_active: formData.is_active,
        observations: formData.observations
      };

      await onSubmit(apiData);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar API',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="h-6 w-6" />
                {isEditMode ? 'Editar API' : 'Nova API'} 
                <Badge variant="outline" className="ml-2">Estilo N8N</Badge>
              </h2>
              <p className="text-muted-foreground">
                Configure sua API externa usando a interface familiar do N8N
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="auth">Autenticação</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="params">Parâmetros</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
            </TabsList>

            {/* Aba Básico */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações Básicas
                  </CardTitle>
                  <CardDescription>
                    Configure as informações principais da sua API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da API *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Ex: API do WhatsApp"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="method">Método HTTP</Label>
                      <Select value={formData.requestMethod} onValueChange={(value) => handleInputChange('requestMethod', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      placeholder="https://api.exemplo.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descreva o que esta API faz..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">API Ativa</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Autenticação */}
            <TabsContent value="auth" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Autenticação
                  </CardTitle>
                  <CardDescription>
                    Configure como autenticar com a API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tipo de Autenticação</Label>
                    <Select value={formData.authentication} onValueChange={(value) => handleInputChange('authentication', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        <SelectItem value="api_key">API Key</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.authentication === 'api_key' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Header</Label>
                        <Input
                          value={formData.authData.apiKey}
                          onChange={(e) => handleAuthDataChange('apiKey', e.target.value)}
                          placeholder="Authorization"
                        />
                      </div>
                      <div>
                        <Label>Valor da API Key</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.authData.apiKeyValue}
                            onChange={(e) => handleAuthDataChange('apiKeyValue', e.target.value)}
                            placeholder="sua-api-key-aqui"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.authentication === 'bearer' && (
                    <div>
                      <Label>Bearer Token</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.authData.bearerToken}
                          onChange={(e) => handleAuthDataChange('bearerToken', e.target.value)}
                          placeholder="seu-bearer-token-aqui"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {formData.authentication === 'basic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Usuário</Label>
                        <Input
                          value={formData.authData.username}
                          onChange={(e) => handleAuthDataChange('username', e.target.value)}
                          placeholder="usuário"
                        />
                      </div>
                      <div>
                        <Label>Senha</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.authData.password}
                            onChange={(e) => handleAuthDataChange('password', e.target.value)}
                            placeholder="senha"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Headers */}
            <TabsContent value="headers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Headers HTTP
                  </CardTitle>
                  <CardDescription>
                    Adicione headers personalizados à requisição
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendHeaders"
                      checked={formData.sendHeaders}
                      onCheckedChange={(checked) => handleInputChange('sendHeaders', checked)}
                    />
                    <Label htmlFor="sendHeaders">Enviar Headers</Label>
                  </div>

                  {formData.sendHeaders && (
                    <div className="space-y-3">
                      {formData.headerParameters.map((header, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Nome do header"
                            value={header.name}
                            onChange={(e) => updateParameter('header', index, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Valor do header"
                            value={header.value}
                            onChange={(e) => updateParameter('header', index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeParameter('header', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addParameter('header')}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Header
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Parâmetros */}
            <TabsContent value="params" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Query Parameters
                  </CardTitle>
                  <CardDescription>
                    Adicione parâmetros à URL da requisição
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendQuery"
                      checked={formData.sendQuery}
                      onCheckedChange={(checked) => handleInputChange('sendQuery', checked)}
                    />
                    <Label htmlFor="sendQuery">Enviar Query Parameters</Label>
                  </div>

                  {formData.sendQuery && (
                    <div className="space-y-3">
                      {formData.queryParameters.map((param, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Nome do parâmetro"
                            value={param.name}
                            onChange={(e) => updateParameter('query', index, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Valor do parâmetro"
                            value={param.value}
                            onChange={(e) => updateParameter('query', index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeParameter('query', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addParameter('query')}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Parâmetro
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Body */}
            <TabsContent value="body" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Body da Requisição
                  </CardTitle>
                  <CardDescription>
                    Configure o corpo da requisição para métodos POST/PUT/PATCH
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendBody"
                      checked={formData.sendBody}
                      onCheckedChange={(checked) => handleInputChange('sendBody', checked)}
                    />
                    <Label htmlFor="sendBody">Enviar Body</Label>
                  </div>

                  {formData.sendBody && (
                    <div className="space-y-4">
                      <div>
                        <Label>Tipo de Conteúdo</Label>
                        <Select value={formData.bodyContentType} onValueChange={(value) => handleInputChange('bodyContentType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="form">Form Data</SelectItem>
                            <SelectItem value="raw">Raw</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.bodyContentType === 'json' && (
                        <div>
                          <Label>JSON Body</Label>
                          <Textarea
                            value={formData.bodyJson}
                            onChange={(e) => handleInputChange('bodyJson', e.target.value)}
                            placeholder='{"key": "value"}'
                            rows={6}
                            className="font-mono text-sm"
                          />
                        </div>
                      )}

                      {formData.bodyContentType === 'form' && (
                        <div className="space-y-3">
                          {formData.bodyFormData.map((field, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <Input
                                placeholder="Nome do campo"
                                value={field.name}
                                onChange={(e) => updateParameter('formData', index, 'name', e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Valor do campo"
                                value={field.value}
                                onChange={(e) => updateParameter('formData', index, 'value', e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeParameter('formData', index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addParameter('formData')}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Campo
                          </Button>
                        </div>
                      )}

                      {formData.bodyContentType === 'raw' && (
                        <div>
                          <Label>Raw Body</Label>
                          <Textarea
                            value={formData.bodyRaw}
                            onChange={(e) => handleInputChange('bodyRaw', e.target.value)}
                            placeholder="Conteúdo bruto..."
                            rows={6}
                            className="font-mono text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>
                Adicione notas sobre esta API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Notas, documentação ou observações sobre esta API..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Atualizar API' : 'Criar API'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
