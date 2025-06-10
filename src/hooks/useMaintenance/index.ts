
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadMaintenanceData();
  }, [vehicleId]);

  const loadMaintenanceData = async () => {
    setLoading(true);
    const data = await loadMaintenances(vehicleId);
    setMaintenances(data);
    setLoading(false);
  };

  const getTotalMaintenanceCost = (vehicleId: string) => {
    return maintenances
      .filter(m => m.vehicle_id === vehicleId)
      .reduce((total, maintenance) => total + maintenance.total_amount, 0);
  };

  const addMaintenance = async (maintenance: Omit<MaintenanceRecord, 'id' | 'created_at' | 'vehicle_name' | 'vehicle_internal_code'>) => {
    if (!user?.id) {
      return;
    }

    const newMaintenance = await addMaintenanceRecord(maintenance, user.id);
    if (newMaintenance) {
      setMaintenances(prev => [newMaintenance, ...prev]);
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  };

  const updateMaintenance = async (id: string, updates: Partial<MaintenanceRecord>) => {
    const success = await updateMaintenanceRecord(id, updates);
    if (success) {
      setMaintenances(prev => 
        prev.map(m => m.id === id ? { ...m, ...updates } : m)
      );
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  };

  const deleteMaintenance = async (id: string) => {
    const success = await deleteMaintenanceRecord(id);
    if (success) {
      setMaintenances(prev => prev.filter(m => m.id !== id));
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
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
