
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category_id?: string;
  type: 'fixa' | 'variavel' | 'sazonal' | 'investimento';
  date: string; // Obrigatório para compatibilidade com banco
  due_date: string; // Data de vencimento - principal referência
  is_paid: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    type: string;
  };
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          category:financial_categories(name, type)
        `)
        .order('due_date', { ascending: false })
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses((data || []) as Expense[]);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar despesas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    try {
      // Garantir que date tenha o mesmo valor de due_date para compatibilidade
      const expenseData = {
        ...expense,
        date: expense.due_date, // Usar due_date como valor para date
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select(`
          *,
          category:financial_categories(name, type)
        `)
        .single();

      if (error) throw error;
      
      setExpenses(prev => [data as Expense, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Despesa criada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar despesa',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      // Se due_date foi atualizado, atualizar date também para compatibilidade
      const updateData = {
        ...updates,
        ...(updates.due_date && { date: updates.due_date }),
      };

      const { data, error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          category:financial_categories(name, type)
        `)
        .single();

      if (error) throw error;
      
      setExpenses(prev => prev.map(exp => exp.id === id ? data as Expense : exp));
      toast({
        title: 'Sucesso',
        description: 'Despesa atualizada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar despesa',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Despesa removida com sucesso',
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover despesa',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    isLoading,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
};
