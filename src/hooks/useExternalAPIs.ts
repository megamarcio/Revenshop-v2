import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from './use-toast';
import {
  ExternalAPI,
  ExternalAPIEndpoint,
  ExternalAPITestHistory,
  CreateExternalAPIRequest,
  UpdateExternalAPIRequest,
  CreateEndpointRequest,
  UpdateEndpointRequest,
  TestAPIRequest,
  TestAPIResponse
} from '../types/externalApi';

export const useExternalAPIs = () => {
  const [apis, setApis] = useState<ExternalAPI[]>([]);
  const [endpoints, setEndpoints] = useState<ExternalAPIEndpoint[]>([]);
  const [testHistory, setTestHistory] = useState<ExternalAPITestHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todas as APIs
  const fetchAPIs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('external_apis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApis(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar APIs';
      // Só mostra erro se não for um problema de tabela não existir ou estar vazia
      if (!errorMessage.includes('relation "external_apis" does not exist')) {
        setError(errorMessage);
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive'
        });
      } else {
        // Se a tabela não existe, apenas define uma lista vazia sem erro
        setApis([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar endpoints de uma API específica
  const fetchEndpoints = useCallback(async (apiId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('external_api_endpoints')
        .select('*')
        .eq('api_id', apiId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEndpoints(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar endpoints';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar histórico de testes
  const fetchTestHistory = useCallback(async (apiId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('external_api_test_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (apiId) {
        query = query.eq('api_id', apiId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTestHistory(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar histórico';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova API
  const createAPI = useCallback(async (apiData: CreateExternalAPIRequest): Promise<ExternalAPI | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('external_apis')
        .insert([apiData])
        .select()
        .single();

      if (error) throw error;
      
      setApis(prev => [data, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'API criada com sucesso!'
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar API';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar API
  const updateAPI = useCallback(async (id: string, apiData: UpdateExternalAPIRequest): Promise<ExternalAPI | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('external_apis')
        .update(apiData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setApis(prev => prev.map(api => api.id === id ? data : api));
      toast({
        title: 'Sucesso',
        description: 'API atualizada com sucesso!'
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar API';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar API
  const deleteAPI = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('external_apis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApis(prev => prev.filter(api => api.id !== id));
      toast({
        title: 'Sucesso',
        description: 'API removida com sucesso!'
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover API';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar endpoint
  const createEndpoint = useCallback(async (endpointData: CreateEndpointRequest): Promise<ExternalAPIEndpoint | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('external_api_endpoints')
        .insert([endpointData])
        .select()
        .single();

      if (error) throw error;
      
      setEndpoints(prev => [data, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Endpoint criado com sucesso!'
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar endpoint';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar endpoint
  const updateEndpoint = useCallback(async (id: string, endpointData: UpdateEndpointRequest): Promise<ExternalAPIEndpoint | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('external_api_endpoints')
        .update(endpointData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEndpoints(prev => prev.map(endpoint => endpoint.id === id ? data : endpoint));
      toast({
        title: 'Sucesso',
        description: 'Endpoint atualizado com sucesso!'
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar endpoint';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar endpoint
  const deleteEndpoint = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('external_api_endpoints')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEndpoints(prev => prev.filter(endpoint => endpoint.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Endpoint removido com sucesso!'
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover endpoint';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Testar API usando Edge Function
  const testAPI = useCallback(async (testData: TestAPIRequest): Promise<TestAPIResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/test-external-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(testData)
      });

      if (!response.ok) {
        throw new Error(`Erro na edge function: ${response.status}`);
      }

      const result = await response.json();
      
      // Atualizar histórico
      await fetchTestHistory(testData.api_id);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao testar API';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchTestHistory]);

  // Buscar APIs ativas para dropdown
  const getActiveAPIs = useCallback(() => {
    return apis.filter(api => api.is_active);
  }, [apis]);

  // Buscar APIs MCP
  const getMCPServers = useCallback(() => {
    return apis.filter(api => api.is_mcp_server && api.is_active);
  }, [apis]);

  useEffect(() => {
    fetchAPIs();
  }, [fetchAPIs]);

  return {
    // Estado
    apis,
    endpoints,
    testHistory,
    loading,
    error,
    
    // Ações
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
    
    // Utilitários
    getActiveAPIs,
    getMCPServers,
    
    // Limpar erro
    clearError: () => setError(null)
  };
}; 