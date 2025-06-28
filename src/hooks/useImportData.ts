import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ImportDataRecord {
  id: string;
  original_date: string;
  original_amount: number;
  original_business: string;
  original_category?: string;
  transaction_id?: string;
  account?: string;
  status: 'Fixa' | 'Variavel';
  classified_type?: 'receita' | 'despesa';
  classified_destination?: 'pontual' | 'previsao';
  category_id?: string;
  due_day?: number;
  ai_summary?: string;
  ai_summary_applied: boolean;
  is_imported: boolean;
  imported_at?: string;
  imported_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateImportDataRecord {
  original_date: string;
  original_amount: number;
  original_business: string;
  original_category?: string;
  transaction_id?: string;
  account?: string;
  status: 'Fixa' | 'Variavel';
  classified_type?: 'receita' | 'despesa';
  classified_destination?: 'pontual' | 'previsao';
  category_id?: string;
  due_day?: number;
}

export const useImportData = () => {
  const [records, setRecords] = useState<ImportDataRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('import_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dados de importação:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados de importação',
          variant: 'destructive',
        });
        return;
      }

      setRecords(data || []);
    } catch (error) {
      console.error('Erro ao buscar dados de importação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRecord = async (recordData: CreateImportDataRecord): Promise<ImportDataRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('import_data')
        .insert([recordData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar registro de importação:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar dados de importação',
          variant: 'destructive',
        });
        return null;
      }

      await fetchRecords(); // Recarregar lista
      return data;
    } catch (error) {
      console.error('Erro ao criar registro de importação:', error);
      return null;
    }
  };

  const updateRecord = async (id: string, updates: Partial<ImportDataRecord>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('import_data')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar registro de importação:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar registro',
          variant: 'destructive',
        });
        return false;
      }

      await fetchRecords(); // Recarregar lista
      return true;
    } catch (error) {
      console.error('Erro ao atualizar registro de importação:', error);
      return false;
    }
  };

  const deleteRecord = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('import_data')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar registro de importação:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao deletar registro',
          variant: 'destructive',
        });
        return false;
      }

      await fetchRecords(); // Recarregar lista
      return true;
    } catch (error) {
      console.error('Erro ao deletar registro de importação:', error);
      return false;
    }
  };

  const markAsImported = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('import_data')
        .update({
          is_imported: true,
          imported_at: new Date().toISOString(),
          imported_by: user?.id
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao marcar como importado:', error);
        return false;
      }

      await fetchRecords(); // Recarregar lista
      return true;
    } catch (error) {
      console.error('Erro ao marcar como importado:', error);
      return false;
    }
  };

  const bulkCreate = async (recordsData: CreateImportDataRecord[]): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('import_data')
        .insert(recordsData)
        .select();

      if (error) {
        console.error('Erro ao criar registros em lote:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar dados de importação em lote',
          variant: 'destructive',
        });
        return 0;
      }

      await fetchRecords(); // Recarregar lista
      return data?.length || 0;
    } catch (error) {
      console.error('Erro ao criar registros em lote:', error);
      return 0;
    }
  };

  // Buscar apenas registros não importados
  const getPendingRecords = (): ImportDataRecord[] => {
    return records.filter(record => !record.is_imported);
  };

  // Buscar registros por tipo
  const getRecordsByType = (type: 'receita' | 'despesa'): ImportDataRecord[] => {
    return records.filter(record => record.classified_type === type);
  };

  // Buscar registros por destino
  const getRecordsByDestination = (destination: 'pontual' | 'previsao'): ImportDataRecord[] => {
    return records.filter(record => record.classified_destination === destination);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    isLoading,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    markAsImported,
    bulkCreate,
    getPendingRecords,
    getRecordsByType,
    getRecordsByDestination,
  };
}; 