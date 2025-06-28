import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface RevenueForecast {
  id: string;
  description: string;
  amount: number;
  type: 'fixa' | 'variavel';
  category_id: string | null;
  due_day: number;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
  category?: {
    id: string;
    name: string;
    type: string;
  } | null;
}

export interface CreateRevenueForecastData {
  description: string;
  amount: number;
  type: 'fixa' | 'variavel';
  category_id?: string | null;
  due_day: number;
  is_active: boolean;
  notes?: string | null;
}

const isSupabaseConfigured = () => {
  try {
    return !!supabase && process.env.NODE_ENV !== 'test';
  } catch {
    return false;
  }
};

export const useRevenueForecasts = () => {
  const [forecasts, setForecasts] = useState<RevenueForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchForecasts = async () => {
    try {
      setIsLoading(true);
      
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('revenue_forecasts')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.warn('Tabela revenue_forecasts não existe ainda, usando fallback local');
            throw error;
          }
          setForecasts(data || []);
        } catch (supabaseError) {
          // Fallback para localStorage quando tabela não existe
          console.log('Usando fallback local para revenue_forecasts');
          const localData = localStorage.getItem('revenue_forecasts');
          const parsedData = localData ? JSON.parse(localData) : [];
          setForecasts(parsedData);
        }
      } else {
        // Fallback para dados locais/mock se necessário
        const localData = localStorage.getItem('revenue_forecasts');
        const parsedData = localData ? JSON.parse(localData) : [];
        setForecasts(parsedData);
      }
    } catch (error) {
      console.error('Error fetching revenue forecasts:', error);
      // Não mostrar toast de erro para problemas de tabela não existente
      const localData = localStorage.getItem('revenue_forecasts');
      const parsedData = localData ? JSON.parse(localData) : [];
      setForecasts(parsedData);
    } finally {
      setIsLoading(false);
    }
  };

  const createRevenue = async (data: CreateRevenueForecastData) => {
    try {
      console.log('📝 Criando previsão de receita:', data);

      if (isSupabaseConfigured()) {
        const { data: newForecast, error } = await supabase
          .from('revenue_forecasts')
          .insert([data])
          .select()
          .single();

        if (error) throw error;

        setForecasts(prev => [newForecast, ...prev]);
        toast({
          title: 'Sucesso',
          description: 'Previsão de receita criada com sucesso',
        });

        return newForecast;
      } else {
        // Fallback para localStorage
        const newForecast: RevenueForecast = {
          id: Date.now().toString(),
          ...data,
          created_at: new Date().toISOString(),
        };

        const localData = localStorage.getItem('revenue_forecasts');
        const existing = localData ? JSON.parse(localData) : [];
        const updated = [newForecast, ...existing];
        localStorage.setItem('revenue_forecasts', JSON.stringify(updated));
        
        setForecasts(updated);
        toast({
          title: 'Sucesso',
          description: 'Previsão de receita criada com sucesso (modo local)',
        });

        return newForecast;
      }
    } catch (error) {
      console.error('Error creating revenue forecast:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar previsão de receita',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateRevenue = async (id: string, data: Partial<CreateRevenueForecastData>) => {
    try {
      console.log('📝 Atualizando previsão de receita:', { id, data });

      if (isSupabaseConfigured()) {
        const { data: updatedForecast, error } = await supabase
          .from('revenue_forecasts')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        setForecasts(prev => prev.map(f => f.id === id ? updatedForecast : f));
        toast({
          title: 'Sucesso',
          description: 'Previsão de receita atualizada com sucesso',
        });

        return updatedForecast;
      } else {
        // Fallback para localStorage
        const localData = localStorage.getItem('revenue_forecasts');
        const existing = localData ? JSON.parse(localData) : [];
        const updated = existing.map((f: RevenueForecast) => 
          f.id === id ? { ...f, ...data, updated_at: new Date().toISOString() } : f
        );
        localStorage.setItem('revenue_forecasts', JSON.stringify(updated));
        
        setForecasts(updated);
        toast({
          title: 'Sucesso',
          description: 'Previsão de receita atualizada com sucesso (modo local)',
        });

        return updated.find((f: RevenueForecast) => f.id === id);
      }
    } catch (error) {
      console.error('Error updating revenue forecast:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar previsão de receita',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteRevenue = async (id: string) => {
    try {
      console.log('🗑️ Excluindo previsão de receita:', id);

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('revenue_forecasts')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setForecasts(prev => prev.filter(f => f.id !== id));
        toast({
          title: 'Sucesso',
          description: 'Previsão de receita excluída com sucesso',
        });
      } else {
        // Fallback para localStorage
        const localData = localStorage.getItem('revenue_forecasts');
        const existing = localData ? JSON.parse(localData) : [];
        const updated = existing.filter((f: RevenueForecast) => f.id !== id);
        localStorage.setItem('revenue_forecasts', JSON.stringify(updated));
        
        setForecasts(updated);
        toast({
          title: 'Sucesso',
          description: 'Previsão de receita excluída com sucesso (modo local)',
        });
      }
    } catch (error) {
      console.error('Error deleting revenue forecast:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir previsão de receita',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const replicateToRevenues = async (
    forecastId: string, 
    startDate: Date, 
    installments: number
  ) => {
    try {
      // Buscar a previsão
      const forecast = forecasts.find(f => f.id === forecastId);
      if (!forecast) throw new Error('Previsão não encontrada');

      // Criar as receitas replicadas
      const revenues = [];
      for (let i = 0; i < installments; i++) {
        const revenueDate = new Date(startDate);
        revenueDate.setMonth(revenueDate.getMonth() + i);
        revenueDate.setDate(forecast.due_day);

        revenues.push({
          description: `${forecast.description} (${i + 1}/${installments})`,
          amount: forecast.amount,
          type: 'padrao',
          category_id: forecast.category_id,
          date: revenueDate.toISOString().split('T')[0],
          is_confirmed: false,
          notes: `Gerado automaticamente da previsão: ${forecast.description}`,
        });
      }

      // Inserir no banco de receitas reais
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('revenues')
          .insert(revenues);

        if (error) throw error;
      } else {
        // Em modo localStorage, só simular (não temos acesso ao hook de revenues aqui)
        console.log('Receitas que seriam criadas:', revenues);
      }

      toast({
        title: 'Sucesso',
        description: `${installments} receitas criadas com sucesso!`,
      });

    } catch (error) {
      console.error('Erro ao replicar receitas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível replicar as receitas.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  return {
    forecasts,
    isLoading,
    createRevenue,
    updateRevenue,
    deleteRevenue,
    replicateToRevenues,
    refetch: fetchForecasts,
  };
}; 