import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { ExternalAPIEndpoint, EndpointFormData } from '@/types/externalApi';

interface EndpointFormProps {
  onSubmit: (data: any) => void;
  initialData?: ExternalAPIEndpoint | null;
  apiId?: string;
}

const EndpointForm: React.FC<EndpointFormProps> = ({ onSubmit, initialData, apiId }) => {
  const [formData, setFormData] = useState<EndpointFormData>({
    name: '',
    path: '',
    method: 'GET',
    description: '',
    headers: [{ name: '', value: '' }],
    query_params: [{ name: '', value: '' }],
    body_schema: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        path: initialData.path,
        method: initialData.method,
        description: initialData.description || '',
        headers: initialData.headers.length > 0 ? initialData.headers : [{ name: '', value: '' }],
        query_params: initialData.query_params.length > 0 ? initialData.query_params : [{ name: '', value: '' }],
        body_schema: JSON.stringify(initialData.body_schema, null, 2)
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof EndpointFormData, value: any) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome do endpoint é obrigatório');
      return;
    }
    
    if (!formData.path.trim()) {
      alert('Caminho do endpoint é obrigatório');
      return;
    }

    // Filtrar headers e query params vazios
    const cleanData = {
      ...formData,
      headers: formData.headers.filter(h => h.name.trim() && h.value.trim()),
      query_params: formData.query_params.filter(q => q.name.trim() && q.value.trim()),
      body_schema: formData.body_schema.trim() ? JSON.parse(formData.body_schema) : {}
    };

    onSubmit(cleanData);
  };

  const validateJsonSchema = (jsonString: string) => {
    try {
      if (jsonString.trim()) {
        JSON.parse(jsonString);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Endpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Endpoint *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Buscar Usuários"
              required
            />
          </div>

          <div>
            <Label htmlFor="path">Caminho do Endpoint *</Label>
            <Input
              id="path"
              value={formData.path}
              onChange={(e) => handleInputChange('path', e.target.value)}
              placeholder="/api/users"
              required
            />
          </div>

          <div>
            <Label htmlFor="method">Método HTTP</Label>
            <Select
              value={formData.method}
              onValueChange={(value: any) => handleInputChange('method', value)}
            >
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

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o que este endpoint faz"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Headers Específicos */}
      <Card>
        <CardHeader>
          <CardTitle>Headers Específicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.headers.map((header, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Nome do header"
                value={header.name}
                onChange={(e) => handleHeaderChange(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Valor"
                value={header.value}
                onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeHeader(index)}
                disabled={formData.headers.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addHeader}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Header
          </Button>
        </CardContent>
      </Card>

      {/* Query Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros de Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.query_params.map((param, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Nome do parâmetro"
                value={param.name}
                onChange={(e) => handleQueryParamChange(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Valor padrão"
                value={param.value}
                onChange={(e) => handleQueryParamChange(index, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeQueryParam(index)}
                disabled={formData.query_params.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addQueryParam}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Parâmetro
          </Button>
        </CardContent>
      </Card>

      {/* Schema do Body */}
      {['POST', 'PUT', 'PATCH'].includes(formData.method) && (
        <Card>
          <CardHeader>
            <CardTitle>Schema do Body (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.body_schema}
              onChange={(e) => handleInputChange('body_schema', e.target.value)}
              placeholder={`{
  "name": "string",
  "email": "string",
  "age": "number"
}`}
              rows={8}
              className="font-mono text-sm"
            />
            {formData.body_schema.trim() && !validateJsonSchema(formData.body_schema) && (
              <p className="text-red-500 text-sm mt-2">
                JSON inválido. Verifique a sintaxe.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botões de Ação */}
      <div className="flex justify-end gap-2">
        <Button type="submit" className="min-w-[120px]">
          {initialData ? 'Atualizar' : 'Criar'} Endpoint
        </Button>
      </div>
    </form>
  );
};

export default EndpointForm; 