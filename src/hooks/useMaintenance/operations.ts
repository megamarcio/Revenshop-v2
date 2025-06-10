
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRecord } from '../../types/maintenance';
import { toast } from '@/hooks/use-toast';
import { formatMaintenanceRecord, prepareMaintenanceForDatabase, prepareMaintenanceUpdates } from './utils';
import { DatabaseMaintenanceRecord } from './types';

export const loadMaintenances = async (vehicleId?: string): Promise<MaintenanceRecord[]> => {
  try {
    let query = supabase
      .from('maintenance_records')
      .select(`
        *,
        vehicles!inner(name, internal_code)
      `)
      .order('created_at', { ascending: false });

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao carregar manutenções:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar manutenções',
        variant: 'destructive'
      });
      return [];
    }

    return data?.map((record: DatabaseMaintenanceRecord) => formatMaintenanceRecord(record)) || [];
  } catch (error) {
    console.error('Erro ao carregar manutenções:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao carregar manutenções',
      variant: 'destructive'
    });
    return [];
  }
};

export const addMaintenanceRecord = async (
  maintenance: Omit<MaintenanceRecord, 'id' | 'created_at' | 'vehicle_name' | 'vehicle_internal_code'>,
  userId: string
): Promise<MaintenanceRecord | null> => {
  try {
    const insertData = prepareMaintenanceForDatabase(maintenance, userId);

    const { data, error } = await supabase
      .from('maintenance_records')
      .insert(insertData)
      .select(`
        *,
        vehicles!inner(name, internal_code)
      `)
      .single();

    if (error) {
      console.error('Erro ao adicionar manutenção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar manutenção',
        variant: 'destructive'
      });
      return null;
    }

    toast({
      title: 'Sucesso',
      description: 'Manutenção salva com sucesso!'
    });

    return formatMaintenanceRecord(data);
  } catch (error) {
    console.error('Erro ao adicionar manutenção:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao salvar manutenção',
      variant: 'destructive'
    });
    return null;
  }
};

export const updateMaintenanceRecord = async (
  id: string,
  updates: Partial<MaintenanceRecord>
): Promise<boolean> => {
  try {
    const updateData = prepareMaintenanceUpdates(updates);

    const { error } = await supabase
      .from('maintenance_records')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar manutenção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar manutenção',
        variant: 'destructive'
      });
      return false;
    }

    toast({
      title: 'Sucesso',
      description: 'Manutenção atualizada com sucesso!'
    });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar manutenção:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao atualizar manutenção',
      variant: 'destructive'
    });
    return false;
  }
};

export const deleteMaintenanceRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('maintenance_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir manutenção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir manutenção',
        variant: 'destructive'
      });
      return false;
    }

    toast({
      title: 'Sucesso',
      description: 'Manutenção excluída com sucesso!'
    });
    return true;
  } catch (error) {
    console.error('Erro ao excluir manutenção:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao excluir manutenção',
      variant: 'destructive'
    });
    return false;
  }
};
