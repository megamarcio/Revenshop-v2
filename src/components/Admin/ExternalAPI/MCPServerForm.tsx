import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Settings, Wrench, FileText } from 'lucide-react';
import { MCPServerConfig, MCPTool, MCPResource } from '@/types/externalApi';

interface MCPServerFormProps {
  onSubmit: (data: any) => void;
}

const MCPServerForm: React.FC<MCPServerFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_url: '',
    api_key: '',
    auth_type: 'none' as const,
    headers: [{ name: '', value: '' }],
    query_params: [{ name: '', value: '' }],
    mcp_config: {
      server_name: '',
      server_description: '',
      server_version: '1.0.0',
      capabilities: [''],
      tools: [] as MCPTool[],
      resources: [] as MCPResource[]
    }
  });

  const [showToolForm, setShowToolForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingTool, setEditingTool] = useState<MCPTool | null>(null);
  const [editingResource, setEditingResource] = useState<MCPResource | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMCPConfigChange = (field: keyof MCPServerConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: { ...prev.mcp_config, [field]: value }
    }));
  };

  const handleHeaderChange = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => 
        i === index ? { ...header, [field]: value } : header
      )
    }));
  };

  const addHeader = () => {
    setFormData(prev => ({
      ...prev,
      headers: [...prev.headers, { name: '', value: '' }]
    }));
  };

  const removeHeader = (index: number) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };

  const handleCapabilityChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        capabilities: prev.mcp_config.capabilities.map((cap, i) => 
          i === index ? value : cap
        )
      }
    }));
  };

  const addCapability = () => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        capabilities: [...prev.mcp_config.capabilities, '']
      }
    }));
  };

  const removeCapability = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        capabilities: prev.mcp_config.capabilities.filter((_, i) => i !== index)
      }
    }));
  };

  const addTool = (tool: MCPTool) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        tools: [...prev.mcp_config.tools, tool]
      }
    }));
    setShowToolForm(false);
    setEditingTool(null);
  };

  const updateTool = (tool: MCPTool) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        tools: prev.mcp_config.tools.map(t => 
          t.name === editingTool?.name ? tool : t
        )
      }
    }));
    setShowToolForm(false);
    setEditingTool(null);
  };

  const removeTool = (toolName: string) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        tools: prev.mcp_config.tools.filter(t => t.name !== toolName)
      }
    }));
  };

  const addResource = (resource: MCPResource) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        resources: [...prev.mcp_config.resources, resource]
      }
    }));
    setShowResourceForm(false);
    setEditingResource(null);
  };

  const updateResource = (resource: MCPResource) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        resources: prev.mcp_config.resources.map(r => 
          r.name === editingResource?.name ? resource : r
        )
      }
    }));
    setShowResourceForm(false);
    setEditingResource(null);
  };

  const removeResource = (resourceName: string) => {
    setFormData(prev => ({
      ...prev,
      mcp_config: {
        ...prev.mcp_config,
        resources: prev.mcp_config.resources.filter(r => r.name !== resourceName)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome do servidor é obrigatório');
      return;
    }
    
    if (!formData.base_url.trim()) {
      alert('URL base é obrigatória');
      return;
    }

    if (!formData.mcp_config.server_name.trim()) {
      alert('Nome do servidor MCP é obrigatório');
      return;
    }

    // Filtrar headers vazios e capabilities vazias
    const cleanData = {
      ...formData,
      headers: formData.headers.filter(h => h.name.trim() && h.value.trim()),
      mcp_config: {
        ...formData.mcp_config,
        capabilities: formData.mcp_config.capabilities.filter(c => c.trim())
      }
    };

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Servidor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Servidor *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Servidor de Análise de Dados"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o propósito deste servidor MCP"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="base_url">URL Base *</Label>
            <Input
              id="base_url"
              value={formData.base_url}
              onChange={(e) => handleInputChange('base_url', e.target.value)}
              placeholder="https://mcp-server.exemplo.com"
              type="url"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuração MCP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração MCP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mcp_server_name">Nome do Servidor MCP *</Label>
            <Input
              id="mcp_server_name"
              value={formData.mcp_config.server_name}
              onChange={(e) => handleMCPConfigChange('server_name', e.target.value)}
              placeholder="Nome interno do servidor MCP"
              required
            />
          </div>

          <div>
            <Label htmlFor="mcp_server_description">Descrição do Servidor MCP</Label>
            <Textarea
              id="mcp_server_description"
              value={formData.mcp_config.server_description}
              onChange={(e) => handleMCPConfigChange('server_description', e.target.value)}
              placeholder="Descrição das funcionalidades do servidor MCP"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="mcp_server_version">Versão do Servidor</Label>
            <Input
              id="mcp_server_version"
              value={formData.mcp_config.server_version}
              onChange={(e) => handleMCPConfigChange('server_version', e.target.value)}
              placeholder="1.0.0"
            />
          </div>

          <div>
            <Label>Capacidades</Label>
            <div className="space-y-2">
              {formData.mcp_config.capabilities.map((capability, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={capability}
                    onChange={(e) => handleCapabilityChange(index, e.target.value)}
                    placeholder="Ex: file_system, database"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCapability(index)}
                    disabled={formData.mcp_config.capabilities.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addCapability}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Capacidade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ferramentas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Ferramentas
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowToolForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ferramenta
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.mcp_config.tools.length > 0 ? (
            <div className="space-y-3">
              {formData.mcp_config.tools.map((tool, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-gray-600">{tool.description}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingTool(tool);
                          setShowToolForm(true);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTool(tool.name)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma ferramenta configurada</p>
              <p className="text-sm">Adicione ferramentas para expandir as capacidades do servidor</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recursos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recursos
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowResourceForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Recurso
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.mcp_config.resources.length > 0 ? (
            <div className="space-y-3">
              {formData.mcp_config.resources.map((resource, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-sm text-gray-600">{resource.description}</div>
                      <div className="text-xs text-gray-500 font-mono">{resource.uri}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingResource(resource);
                          setShowResourceForm(true);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeResource(resource.name)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum recurso configurado</p>
              <p className="text-sm">Adicione recursos para disponibilizar arquivos e dados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-2">
        <Button type="submit" className="min-w-[120px]">
          Criar Servidor MCP
        </Button>
      </div>

      {/* Modal de Ferramenta */}
      {showToolForm && (
        <ToolForm
          onSubmit={editingTool ? updateTool : addTool}
          initialData={editingTool}
          onClose={() => {
            setShowToolForm(false);
            setEditingTool(null);
          }}
        />
      )}

      {/* Modal de Recurso */}
      {showResourceForm && (
        <ResourceForm
          onSubmit={editingResource ? updateResource : addResource}
          initialData={editingResource}
          onClose={() => {
            setShowResourceForm(false);
            setEditingResource(null);
          }}
        />
      )}
    </form>
  );
};

// Componentes auxiliares para formulários de ferramentas e recursos
const ToolForm: React.FC<{
  onSubmit: (tool: MCPTool) => void;
  initialData?: MCPTool | null;
  onClose: () => void;
}> = ({ onSubmit, initialData, onClose }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    inputSchema: initialData?.inputSchema ? JSON.stringify(initialData.inputSchema, null, 2) : '',
    outputSchema: initialData?.outputSchema ? JSON.stringify(initialData.outputSchema, null, 2) : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome da ferramenta é obrigatório');
      return;
    }

    try {
      const tool: MCPTool = {
        name: formData.name,
        description: formData.description,
        inputSchema: formData.inputSchema.trim() ? JSON.parse(formData.inputSchema) : {},
        outputSchema: formData.outputSchema.trim() ? JSON.parse(formData.outputSchema) : undefined
      };
      
      onSubmit(tool);
    } catch (error) {
      alert('Schema JSON inválido');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {initialData ? 'Editar Ferramenta' : 'Nova Ferramenta'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome da Ferramenta *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: analyze_data"
              required
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o que esta ferramenta faz"
              rows={3}
            />
          </div>

          <div>
            <Label>Schema de Entrada (JSON)</Label>
            <Textarea
              value={formData.inputSchema}
              onChange={(e) => setFormData(prev => ({ ...prev, inputSchema: e.target.value }))}
              placeholder='{"type": "object", "properties": {...}}'
              rows={5}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label>Schema de Saída (JSON - Opcional)</Label>
            <Textarea
              value={formData.outputSchema}
              onChange={(e) => setFormData(prev => ({ ...prev, outputSchema: e.target.value }))}
              placeholder='{"type": "object", "properties": {...}}'
              rows={5}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Adicionar'} Ferramenta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResourceForm: React.FC<{
  onSubmit: (resource: MCPResource) => void;
  initialData?: MCPResource | null;
  onClose: () => void;
}> = ({ onSubmit, initialData, onClose }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    uri: initialData?.uri || '',
    mimeType: initialData?.mimeType || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome do recurso é obrigatório');
      return;
    }

    if (!formData.uri.trim()) {
      alert('URI do recurso é obrigatória');
      return;
    }

    const resource: MCPResource = {
      name: formData.name,
      description: formData.description,
      uri: formData.uri,
      mimeType: formData.mimeType
    };
    
    onSubmit(resource);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {initialData ? 'Editar Recurso' : 'Novo Recurso'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome do Recurso *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: database_schema"
              required
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva este recurso"
              rows={3}
            />
          </div>

          <div>
            <Label>URI *</Label>
            <Input
              value={formData.uri}
              onChange={(e) => setFormData(prev => ({ ...prev, uri: e.target.value }))}
              placeholder="Ex: file:///path/to/resource"
              required
            />
          </div>

          <div>
            <Label>Tipo MIME</Label>
            <Input
              value={formData.mimeType}
              onChange={(e) => setFormData(prev => ({ ...prev, mimeType: e.target.value }))}
              placeholder="Ex: application/json"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Adicionar'} Recurso
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MCPServerForm; 