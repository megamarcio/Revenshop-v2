
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MaintenanceRecord } from '../types/maintenance';
import { toast } from '@/hooks/use-toast';

export const useMaintenance = (vehicleId?: string) => {
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    loadMaintenances();
  }, [vehicleId]);

  const loadMaintenances = async () => {
    try {
      setLoading(true);
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
        return;
      }

      const formattedMaintenances: MaintenanceRecord[] = data?.map(record => ({
        id: record.id,
        vehicle_id: record.vehicle_id,
        vehicle_name: record.vehicles?.name || '',
        vehicle_internal_code: record.vehicles?.internal_code || '',
        detection_date: record.detection_date,
        repair_date: record.repair_date,
        maintenance_type: record.maintenance_type as 'preventive' | 'corrective' | 'bodyshop',
        maintenance_items: record.maintenance_items || [],
        custom_maintenance: record.custom_maintenance || '',
        details: record.details || '',
        mechanic_name: record.mechanic_name,
        mechanic_phone: record.mechanic_phone,
        parts: record.parts || [],
        labor: record.labor || [],
        total_amount: record.total_amount,
        receipt_urls: record.receipt_urls || [],
        created_at: record.created_at,
        created_by: record.created_by
      })) || [];

      setMaintenances(formattedMaintenances);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar manutenções',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalMaintenanceCost = (vehicleId: string) => {
    return maintenances
      .filter(m => m.vehicle_id === vehicleId)
      .reduce((total, maintenance) => total + maintenance.total_amount, 0);
  };

  const addMaintenance = async (maintenance: Omit<MaintenanceRecord, 'id' | 'created_at' | 'vehicle_name' | 'vehicle_internal_code'>) => {
    try {
      if (!user?.id) {
        toast({
          title: 'Erro',
          description: 'Usuário não autenticado',
          variant: 'destructive'
        });
        return;
      }

      const { data, error } = await supabase
        .from('maintenance_records')
        .insert({
          ...maintenance,
          created_by: user.id
        })
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
        return;
      }

      const newMaintenance: MaintenanceRecord = {
        id: data.id,
        vehicle_id: data.vehicle_id,
        vehicle_name: data.vehicles?.name || '',
        vehicle_internal_code: data.vehicles?.internal_code || '',
        detection_date: data.detection_date,
        repair_date: data.repair_date,
        maintenance_type: data.maintenance_type as 'preventive' | 'corrective' | 'bodyshop',
        maintenance_items: data.maintenance_items || [],
        custom_maintenance: data.custom_maintenance || '',
        details: data.details || '',
        mechanic_name: data.mechanic_name,
        mechanic_phone: data.mechanic_phone,
        parts: data.parts || [],
        labor: data.labor || [],
        total_amount: data.total_amount,
        receipt_urls: data.receipt_urls || [],
        created_at: data.created_at,
        created_by: data.created_by
      };

      setMaintenances(prev => [newMaintenance, ...prev]);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      
      toast({
        title: 'Sucesso',
        description: 'Manutenção salva com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao adicionar manutenção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar manutenção',
        variant: 'destructive'
      });
    }
  };

  const updateMaintenance = async (id: string, updates: Partial<MaintenanceRecord>) => {
    try {
      const { error } = await supabase
        .from('maintenance_records')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar manutenção:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar manutenção',
          variant: 'destructive'
        });
        return;
      }

      setMaintenances(prev => 
        prev.map(m => m.id === id ? { ...m, ...updates } : m)
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      
      toast({
        title: 'Sucesso',
        description: 'Manutenção atualizada com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar manutenção',
        variant: 'destructive'
      });
    }
  };

  const deleteMaintenance = async (id: string) => {
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
        return;
      }

      setMaintenances(prev => prev.filter(m => m.id !== id));
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      
      toast({
        title: 'Sucesso',
        description: 'Manutenção excluída com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir manutenção',
        variant: 'destructive'
      });
    }
  };

  return {
    maintenances,
    loading,
    getTotalMaintenanceCost,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    refresh: loadMaintenances
  };
};
