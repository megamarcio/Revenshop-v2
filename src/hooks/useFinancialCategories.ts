
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Parcela Carro', type: 'despesa' as const, is_default: true },
];

export const useFinancialCategories = () => {
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const defaultCategoriesCreated = useRef(false);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories((data || []) as FinancialCategory[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar categorias',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultCategories = async () => {
    if (defaultCategoriesCreated.current) return;

    try {
      const promises = DEFAULT_EXPENSE_CATEGORIES.map(async (category) => {
        // Verificar se a categoria já existe
        const existingCategory = categories.find(
          cat => cat.name === category.name && cat.type === category.type
        );
        
        if (!existingCategory) {
          console.log(`Creating default category: ${category.name}`);
          return createCategory(category);
        }
        return null;
      });

      await Promise.all(promises);
      defaultCategoriesCreated.current = true;
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  };

  const createCategory = async (category: Omit<FinancialCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data as FinancialCategory]);
      toast({
        title: 'Sucesso',
        description: 'Categoria criada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar categoria',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<FinancialCategory>) => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => prev.map(cat => cat.id === id ? data as FinancialCategory : cat));
      toast({
        title: 'Sucesso',
        description: 'Categoria atualizada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar categoria',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Categoria removida com sucesso',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover categoria',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Criar categorias padrão após carregar as categorias existentes
  useEffect(() => {
    if (!isLoading && categories.length >= 0 && !defaultCategoriesCreated.current) {
      createDefaultCategories();
    }
  }, [isLoading, categories.length]);

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};
