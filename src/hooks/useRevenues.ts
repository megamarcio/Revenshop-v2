import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Revenue {
  id: string;
  description: string;
  amount: number;
  category_id?: string;
  type: 'padrao' | 'estimada' | 'venda' | 'comissao' | 'servico' | 'financiamento';
  date: string;
  is_confirmed: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    type: string;
  };
}

export const useRevenues = () => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevenues = async () => {
    try {
      const { data, error } = await supabase
        .from('revenues')
        .select(`
          *,
          category:financial_categories(name, type)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setRevenues((data || []) as Revenue[]);
    } catch (error) {
      console.error('Error fetching revenues:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar receitas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRevenue = async (revenue: Omit<Revenue, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    try {
      const { data, error } = await supabase
        .from('revenues')
        .insert([revenue])
        .select(`
          *,
          category:financial_categories(name, type)
        `)
        .single();

      if (error) throw error;
      
      setRevenues(prev => [data as Revenue, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Receita criada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error creating revenue:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar receita',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateRevenue = async (id: string, updates: Partial<Revenue>) => {
    try {
      const { data, error } = await supabase
        .from('revenues')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          category:financial_categories(name, type)
        `)
        .single();

      if (error) throw error;
      
      setRevenues(prev => prev.map(rev => rev.id === id ? data as Revenue : rev));
      toast({
        title: 'Sucesso',
        description: 'Receita atualizada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error updating revenue:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar receita',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteRevenue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRevenues(prev => prev.filter(rev => rev.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Receita removida com sucesso',
      });
    } catch (error) {
      console.error('Error deleting revenue:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover receita',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  return {
    revenues,
    isLoading,
    createRevenue,
    updateRevenue,
    deleteRevenue,
    refetch: fetchRevenues,
  };
};
