import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Eye, EyeOff, Brain, FileText, MessageSquare } from 'lucide-react';
import { ExternalAPI, APIFormData } from '@/types/externalApi';
import { useAISettings } from '@/hooks/useAISettings';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface APIFormProps {
  onSubmit: (data: any) => void;
  initialData?: ExternalAPI | null;
}

const APIForm: React.FC<APIFormProps> = ({ onSubmit, initialData }) => {
  const { aiSettings } = useAISettings();
  const [formData, setFormData] = useState<APIFormData>({
    name: '',
    description: '',
    base_url: '',
    api_key: '',
    auth_type: 'none',
    headers: [{ name: '', value: '' }],
    query_params: [{ name: '', value: '' }],
    is_mcp_server: false,
    mcp_config: {
      server_name: '',
      server_description: '',
      server_version: '1.0.0',
      capabilities: [],
      tools: [],
      resources: []
    },
    is_active: true,
    mcp_tools: [],
    observations: '',
    documentation: '',
    ai_analysis_enabled: false,
    ai_key_id: ''
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [newHeader, setNewHeader] = useState({ name: '', value: '' });
  const [newMcpTool, setNewMcpTool] = useState({ name: '', description: '', parameters: '{}' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        base_url: initialData.base_url,
        api_key: initialData.api_key || '',
        auth_type: initialData.auth_type,
        headers: Array.isArray(initialData.headers) && initialData.headers.length > 0 ? initialData.headers : [{ name: '', value: '' }],
        query_params: Array.isArray(initialData.query_params) && initialData.query_params.length > 0 ? initialData.query_params : [{ name: '', value: '' }],
        is_mcp_server: initialData.is_mcp_server,
        mcp_config: initialData.mcp_config,
        is_active: initialData.is_active,
        mcp_tools: Array.isArray(initialData.mcp_tools) ? initialData.mcp_tools : [],
        observations: initialData.observations || '',
        documentation: initialData.documentation || '',
        ai_analysis_enabled: initialData.ai_analysis_enabled || false,
        ai_key_id: initialData.ai_key_id || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof APIFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeaderChange = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => 
        i === index ? { ...header, [field]: value } : header
      )
    }));
  };

  const handleQueryParamChange = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      query_params: prev.query_params.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const addHeader = () => {
    if (newHeader.name && newHeader.value) {
      setFormData(prev => ({
        ...prev,
        headers: [...prev.headers, { ...newHeader }]
      }));
      setNewHeader({ name: '', value: '' });
    }
  };

  const removeHeader = (index: number) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };

  const addQueryParam = () => {
    setFormData(prev => ({
      ...prev,
      query_params: [...prev.query_params, { name: '', value: '' }]
    }));
  };

  const removeQueryParam = (index: number) => {
    setFormData(prev => ({
      ...prev,
      query_params: prev.query_params.filter((_, i) => i !== index)
    }));
  };

  const addMcpTool = () => {
    if (newMcpTool.name && newMcpTool.description) {
      try {
        const parameters = JSON.parse(newMcpTool.parameters);
        setFormData(prev => ({
          ...prev,
          mcp_tools: [...prev.mcp_tools, {
            name: newMcpTool.name,
            description: newMcpTool.description,
            parameters
          }]
        }));
        setNewMcpTool({ name: '', description: '', parameters: '{}' });
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Parâmetros JSON inválidos',
          variant: 'destructive'
        });
      }
    }
  };

  const removeMcpTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mcp_tools: prev.mcp_tools.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome da API é obrigatório');
      return;
    }
    
    if (!formData.base_url.trim()) {
      alert('URL base é obrigatória');
      return;
    }

    // Filtrar headers e query params vazios e mapear para o formato correto da API
    const cleanData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      base_url: formData.base_url.trim(),
      auth_type: formData.auth_type,
      api_key: formData.api_key?.trim() || undefined,
      headers: formData.headers?.filter(h => h.name.trim() && h.value.trim()) || [],
      query_params: formData.query_params?.filter(q => q.name.trim() && q.value.trim()) || [],
      is_active: formData.is_active,
      is_mcp_server: formData.is_mcp_server,
      mcp_config: formData.mcp_config || {},
      mcp_tools: formData.mcp_tools || [],
      observations: formData.observations?.trim() || undefined,
      documentation: formData.documentation?.trim() || undefined,
      ai_analysis_enabled: formData.ai_analysis_enabled || false,
      ai_key_id: formData.ai_key_id?.trim() || undefined
    };

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="auth">Autenticação</TabsTrigger>
          <TabsTrigger value="mcp">MCP Server</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Aba Básico */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Configure as informações principais da API
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
                    placeholder="Ex: API de Pagamentos"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="base_url">URL Base *</Label>
                  <Input
                    id="base_url"
                    value={formData.base_url}
                    onChange={(e) => handleInputChange('base_url', e.target.value)}
                    placeholder="https://api.exemplo.com"
                    type="url"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o propósito desta API"
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
              <CardTitle>Configuração de Autenticação</CardTitle>
              <CardDescription>
                Configure como a API será autenticada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="auth_type">Tipo de Autenticação</Label>
                <Select
                  value={formData.auth_type}
                  onValueChange={(value: any) => handleInputChange('auth_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.auth_type !== 'none' && (
                <div>
                  <Label htmlFor="api_key" className="flex items-center gap-2">
                    {formData.auth_type === 'api_key' ? 'API Key' :
                     formData.auth_type === 'bearer' ? 'Bearer Token' :
                     formData.auth_type === 'basic' ? 'Credenciais Basic' :
                     'OAuth Token'}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </Label>
                  <Input
                    id="api_key"
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.api_key}
                    onChange={(e) => handleInputChange('api_key', e.target.value)}
                    placeholder="Digite a chave de autenticação..."
                  />
                </div>
              )}

              <Separator />

              <div>
                <Label>Headers Adicionais</Label>
                <div className="space-y-2">
                  {formData.headers?.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={header.name}
                        onChange={(e) => {
                          const newHeaders = [...(formData.headers || [])];
                          newHeaders[index].name = e.target.value;
                          handleInputChange('headers', newHeaders);
                        }}
                        placeholder="Nome do header"
                        className="flex-1"
                      />
                      <Input
                        value={header.value}
                        onChange={(e) => {
                          const newHeaders = [...(formData.headers || [])];
                          newHeaders[index].value = e.target.value;
                          handleInputChange('headers', newHeaders);
                        }}
                        placeholder="Valor do header"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeHeader(index)}
                      >
                        <Trash2 className="h-4 w-4" />
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
                    <Button type="button" onClick={addHeader}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba MCP Server */}
        <TabsContent value="mcp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração MCP Server</CardTitle>
              <CardDescription>
                Configure esta API como um servidor MCP (Model Context Protocol)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_mcp_server"
                  checked={formData.is_mcp_server}
                  onCheckedChange={(checked) => handleInputChange('is_mcp_server', checked)}
                />
                <Label htmlFor="is_mcp_server">Ativar como MCP Server</Label>
              </div>

              {formData.is_mcp_server && (
                <>
                  <Separator />
                  
                  <div>
                    <Label>Ferramentas MCP</Label>
                    <div className="space-y-4">
                      {formData.mcp_tools?.map((tool, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{tool.name}</Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeMcpTool(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                      ))}
                      
                      <div className="space-y-2 p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input
                            value={newMcpTool.name}
                            onChange={(e) => setNewMcpTool(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nome da ferramenta"
                          />
                          <Input
                            value={newMcpTool.description}
                            onChange={(e) => setNewMcpTool(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descrição da ferramenta"
                          />
                        </div>
                        <Textarea
                          value={newMcpTool.parameters}
                          onChange={(e) => setNewMcpTool(prev => ({ ...prev, parameters: e.target.value }))}
                          placeholder='{"type": "object", "properties": {...}}'
                          className="font-mono text-sm"
                          rows={3}
                        />
                        <Button type="button" onClick={addMcpTool}>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Ferramenta
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Avançado */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análise de IA
              </CardTitle>
              <CardDescription>
                Esta funcionalidade estará disponível em breve.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 opacity-50 pointer-events-none">
                <Switch
                  id="ai_analysis_enabled"
                  checked={formData.ai_analysis_enabled}
                  onCheckedChange={() => {}}
                  disabled
                />
                <Label htmlFor="ai_analysis_enabled">Habilitar análise de IA</Label>
              </div>
              <div className="opacity-50 pointer-events-none">
                <Label htmlFor="ai_key_id">Chave de IA</Label>
                <Select value={formData.ai_key_id} onValueChange={() => {}} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma configuração de IA" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Opções desabilitadas */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Observações
              </CardTitle>
              <CardDescription>
                Adicione observações e notas sobre esta API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Adicione observações, notas ou informações adicionais sobre esta API..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentação
              </CardTitle>
              <CardDescription>
                Adicione documentação da API para análise de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.documentation}
                onChange={(e) => handleInputChange('documentation', e.target.value)}
                placeholder="Cole aqui a documentação da API (endpoints, parâmetros, exemplos, etc.) para que a IA possa usar como referência..."
                rows={6}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2">
        <Button type="submit" className="min-w-[120px]">
          {initialData ? 'Atualizar' : 'Criar'} API
        </Button>
      </div>
    </form>
  );
};

export default APIForm; 