
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRecord } from '../../types/maintenance';
import { toast } from '@/hooks/use-toast';
import { formatMaintenanceRecord } from './utils';
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
    // Preparar dados tratando strings vazias nas datas como null
    const insertData = {
      vehicle_id: maintenance.vehicle_id,
      detection_date: maintenance.detection_date,
      repair_date: maintenance.repair_date === '' ? null : maintenance.repair_date,
      promised_date: maintenance.promised_date === '' ? null : maintenance.promised_date,
      maintenance_type: maintenance.maintenance_type,
      maintenance_items: maintenance.maintenance_items,
      custom_maintenance: maintenance.custom_maintenance || null,
      details: maintenance.details || null,
      mechanic_name: maintenance.mechanic_name,
      mechanic_phone: maintenance.mechanic_phone,
      parts: maintenance.parts as any, // Cast to Json type for Supabase
      labor: maintenance.labor as any, // Cast to Json type for Supabase
      total_amount: maintenance.total_amount,
      receipt_urls: maintenance.receipt_urls,
      is_urgent: maintenance.is_urgent,
      created_by: userId
    };

    console.log('Dados preparados para inserção:', insertData);

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
    // Preparar atualizações tratando strings vazias nas datas como null
    const updateData: any = {};
    
    Object.keys(updates).forEach(key => {
      if (key === 'repair_date' || key === 'promised_date') {
        // Converter strings vazias para null para campos de data
        const value = updates[key as keyof MaintenanceRecord];
        updateData[key] = value === '' ? null : value;
      } else if (key === 'parts' || key === 'labor') {
        // Cast arrays to Json type for Supabase
        updateData[key] = updates[key as keyof MaintenanceRecord] as any;
      } else if (updates[key as keyof MaintenanceRecord] !== undefined) {
        updateData[key] = updates[key as keyof MaintenanceRecord];
      }
    });

    console.log('Dados preparados para atualização:', updateData);

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
