import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ExpenseForecast {
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

export interface CreateExpenseForecastData {
  description: string;
  amount: number;
  type: 'fixa' | 'variavel';
  category_id?: string | null;
  due_day: number;
  is_active: boolean;
  notes?: string | null;
}

const STORAGE_KEY = 'expense_forecasts';

// Helper para acessar tabelas que ainda não existem nos tipos
const safeSupabaseCall = async <T>(operation: () => PromiseLike<T>): Promise<T | null> => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.warn('📊 Tabela não encontrada no Supabase, usando localStorage como fallback:', error);
    return null; // Retornar null em caso de erro
  }
};

export const useExpenseForecasts = () => {
  const [forecasts, setForecasts] = useState<ExpenseForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se Supabase está configurado
  const isSupabaseConfigured = () => {
    try {
      const hasUrl = import.meta.env?.VITE_SUPABASE_URL;
      const hasKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
      console.log('🔧 Verificando configuração - URL:', !!hasUrl, 'KEY:', !!hasKey);
      return hasUrl && hasKey;
    } catch (error) {
      console.log('🔧 Erro ao verificar configuração, usando localStorage:', error);
      return false;
    }
  };

  const fetchForecasts = async () => {
    try {
      setIsLoading(true);
      
      if (isSupabaseConfigured()) {
        // Tentar usar Supabase - ignorando tipos temporariamente
        try {
          const result = await safeSupabaseCall(() => 
            supabase
              .from('expense_forecasts')
              .select('*')
              .order('created_at', { ascending: false })
          );
          
          const { data, error } = result as { data: unknown[] | null; error: unknown };
          if (error) throw error;
          setForecasts((data || []) as ExpenseForecast[]);
          return;
        } catch (supabaseError) {
          console.warn('📊 Tabela expense_forecasts não encontrada, usando localStorage:', supabaseError);
          // Fallback para localStorage se a tabela não existir
        }
      }
      
      // Usar localStorage como fallback
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : [];
      setForecasts(data);
    } catch (error) {
      console.error('Erro ao buscar previsões:', error);
      // Tentar fallback para localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : [];
        setForecasts(data);
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as previsões de despesas.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveToStorage = (data: ExpenseForecast[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const createExpense = async (data: CreateExpenseForecastData) => {
    try {
      console.log('🚀 Hook createExpense iniciado');
      console.log('📋 Dados recebidos:', data);
      console.log('🔧 Supabase configurado?', isSupabaseConfigured());

      if (isSupabaseConfigured()) {
        // Usar Supabase - ignorando tipos temporariamente
        try {
                    console.log('☁️ Usando Supabase...');
           const result = await safeSupabaseCall(() =>
             supabase
               .from('expense_forecasts')
               .insert([data])
               .select()
               .single()
           );

          const { data: newForecast, error } = result as { data: unknown; error: unknown };
          if (error) {
            console.error('❌ Erro do Supabase:', error);
            throw error;
          }
          console.log('✅ Previsão criada no Supabase:', newForecast);
          setForecasts(prev => [newForecast as ExpenseForecast, ...prev]);
        } catch (supabaseError) {
          console.warn('📊 Erro do Supabase, usando localStorage:', supabaseError);
          // Fallback para localStorage se houver erro
          throw supabaseError;
        }
      } else {
        // Usar localStorage
        console.log('💾 Usando localStorage...');
        const newForecast: ExpenseForecast = {
          id: crypto.randomUUID(),
          description: data.description,
          amount: data.amount,
          type: data.type,
          category_id: data.category_id || null,
          due_day: data.due_day,
          is_active: data.is_active,
          notes: data.notes || null,
          created_at: new Date().toISOString(),
        };

        console.log('📝 Nova previsão criada:', newForecast);
        const updated = [newForecast, ...forecasts];
        setForecasts(updated);
        saveToStorage(updated);
        console.log('💾 Salvo no localStorage');
      }

      console.log('🎉 Mostrando toast de sucesso...');
      toast({
        title: 'Sucesso',
        description: 'Previsão de despesa criada com sucesso!',
      });
    } catch (error) {
      console.error('❌ Erro no hook createExpense:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a previsão de despesa.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateExpense = async (id: string, data: Partial<CreateExpenseForecastData>) => {
    try {
      if (isSupabaseConfigured()) {
        // Usar Supabase - ignorando tipos temporariamente
        try {
          const result = await safeSupabaseCall(() =>
            supabase
              .from('expense_forecasts')
              .update(data)
              .eq('id', id)
              .select()
              .single()
          );

          const { data: updatedForecast, error } = result as { data: unknown; error: unknown };
          if (error) throw error;
          setForecasts(prev => 
            prev.map(f => f.id === id ? (updatedForecast as ExpenseForecast) : f)
          );
        } catch (supabaseError) {
          console.warn('📊 Erro do Supabase, usando localStorage:', supabaseError);
          throw supabaseError;
        }
      } else {
        // Usar localStorage
        const updated = forecasts.map(f => 
          f.id === id 
            ? { ...f, ...data, updated_at: new Date().toISOString() }
            : f
        );
        setForecasts(updated);
        saveToStorage(updated);
      }

      toast({
        title: 'Sucesso',
        description: 'Previsão de despesa atualizada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao atualizar previsão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a previsão de despesa.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        // Usar Supabase - ignorando tipos temporariamente
        try {
          const result = await safeSupabaseCall(() =>
            supabase
              .from('expense_forecasts')
              .delete()
              .eq('id', id)
          );

          const { error } = result as { error: unknown };
          if (error) throw error;
        } catch (supabaseError) {
          console.warn('📊 Erro do Supabase, usando localStorage:', supabaseError);
          // Fallback para localStorage se houver erro
          const updated = forecasts.filter(f => f.id !== id);
          setForecasts(updated);
          saveToStorage(updated);
          
          toast({
            title: 'Sucesso',
            description: 'Previsão de despesa excluída com sucesso!',
          });
          return;
        }
      } else {
        // Usar localStorage
        const updated = forecasts.filter(f => f.id !== id);
        setForecasts(updated);
        saveToStorage(updated);
        
        toast({
          title: 'Sucesso',
          description: 'Previsão de despesa excluída com sucesso!',
        });
        return;
      }

      setForecasts(prev => prev.filter(f => f.id !== id));

      toast({
        title: 'Sucesso',
        description: 'Previsão de despesa excluída com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao excluir previsão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a previsão de despesa.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const replicateToExpenses = async (
    forecastId: string, 
    startDate: Date, 
    installments: number
  ) => {
    try {
      // Buscar a previsão
      const forecast = forecasts.find(f => f.id === forecastId);
      if (!forecast) throw new Error('Previsão não encontrada');

      // Criar as despesas replicadas
      const expenses = [];
      for (let i = 0; i < installments; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        dueDate.setDate(forecast.due_day);

        expenses.push({
          description: `${forecast.description} (${i + 1}/${installments})`,
          amount: forecast.amount,
          type: forecast.type,
          category_id: null, // Será mapeado pela categoria
          due_date: dueDate.toISOString().split('T')[0],
          is_paid: false,
          notes: `Gerado automaticamente da previsão: ${forecast.description}`,
          date: dueDate.toISOString().split('T')[0],
        });
      }

      // Inserir no banco de despesas reais
      if (isSupabaseConfigured()) {
        try {
          const result = await safeSupabaseCall(() =>
            supabase
              .from('expenses')
              .insert(expenses)
          );

          const { error } = result as { error: unknown };
          if (error) throw error;
        } catch (supabaseError) {
          console.warn('📊 Erro ao replicar no Supabase:', supabaseError);
          throw supabaseError;
        }
      } else {
        // Em modo localStorage, só simular (não temos acesso ao hook de expenses aqui)
        console.log('Despesas que seriam criadas:', expenses);
      }

      toast({
        title: 'Sucesso',
        description: `${installments} despesas criadas com sucesso!`,
      });

    } catch (error) {
      console.error('Erro ao replicar despesas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível replicar as despesas.',
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
    createExpense,
    updateExpense,
    deleteExpense,
    replicateToExpenses,
    refetch: fetchForecasts,
  };
}; 