import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { MaintenanceRecord } from '../../types/maintenance';
import { MaintenanceOperations } from './types';
import { 
  loadMaintenances, 
  addMaintenanceRecord, 
  updateMaintenanceRecord, 
  deleteMaintenanceRecord 
} from './operations';

export const useMaintenance = (vehicleId?: string): MaintenanceOperations => {
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadMaintenanceData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadMaintenances(vehicleId);
      setMaintenances(data);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  // Carregar dados iniciais
  useEffect(() => {
    loadMaintenanceData();
  }, [loadMaintenanceData]);

  // Sistema de polling para atualização automática
  useEffect(() => {
    // Limpar intervalo anterior se existir
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Configurar novo intervalo de polling (a cada 5 segundos)
    pollingIntervalRef.current = setInterval(() => {
      loadMaintenanceData();
    }, 5000);

    // Cleanup ao desmontar
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [loadMaintenanceData]);

  const getTotalMaintenanceCost = (vehicleId: string) => {
    return maintenances
      .filter(m => m.vehicle_id === vehicleId)
      .reduce((total, maintenance) => total + maintenance.total_amount, 0);
  };

  const addMaintenance = async (maintenance: Omit<MaintenanceRecord, 'id' | 'created_at' | 'vehicle_name' | 'vehicle_internal_code'>) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const newMaintenance = await addMaintenanceRecord(maintenance, user.id);
      if (newMaintenance) {
        // Atualizar estado local imediatamente
        setMaintenances(prev => [newMaintenance, ...prev]);
        
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        queryClient.invalidateQueries({ queryKey: ['maintenances'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        
        // Recarregar dados para garantir sincronização
        await loadMaintenanceData();
      } else {
        throw new Error('Falha ao adicionar manutenção');
      }
    } catch (error) {
      console.error('Erro ao adicionar manutenção:', error);
      throw error;
    }
  };

  const updateMaintenance = async (id: string, updates: Partial<MaintenanceRecord>) => {
    try {
      const success = await updateMaintenanceRecord(id, updates);
      if (success) {
        // Atualizar estado local imediatamente
        setMaintenances(prev => 
          prev.map(m => m.id === id ? { ...m, ...updates } : m)
        );
        
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        queryClient.invalidateQueries({ queryKey: ['maintenances'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        
        // Recarregar dados para garantir sincronização
        await loadMaintenanceData();
      } else {
        throw new Error('Falha ao atualizar manutenção');
      }
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error);
      throw error;
    }
  };

  const deleteMaintenance = async (id: string) => {
    try {
      const success = await deleteMaintenanceRecord(id);
      if (success) {
        // Atualizar estado local imediatamente
        setMaintenances(prev => prev.filter(m => m.id !== id));
        
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        queryClient.invalidateQueries({ queryKey: ['maintenances'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        
        // Recarregar dados para garantir sincronização
        await loadMaintenanceData();
      } else {
        throw new Error('Falha ao excluir manutenção');
      }
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      throw error;
    }
  };

  return {
    maintenances,
    loading,
    getTotalMaintenanceCost,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    refresh: loadMaintenanceData
  };
};
