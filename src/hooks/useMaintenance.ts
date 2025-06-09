
import { useState, useEffect } from 'react';
import { MaintenanceRecord } from '../types/maintenance';

// Mock data para demonstração - em produção viria do banco de dados
const mockMaintenances: MaintenanceRecord[] = [
  {
    id: '1',
    vehicle_id: '571db587-a657-45a3-aea8-3d16963da694',
    vehicle_name: 'HONDA ODYSSEY LX',
    vehicle_internal_code: '04',
    detection_date: '2024-01-10',
    repair_date: '2024-01-15',
    maintenance_type: 'corrective',
    maintenance_items: ['Bateria descarregada', 'Alternador'],
    details: 'Bateria com problema e alternador com ruído',
    mechanic_name: 'João Silva',
    mechanic_phone: '(11) 99999-9999',
    parts: [
      { id: '1', name: 'Bateria', value: 150.00 },
      { id: '2', name: 'Alternador', value: 200.00 }
    ],
    labor: [
      { id: '1', description: 'Instalação bateria', value: 50.00 },
      { id: '2', description: 'Troca alternador', value: 80.00 }
    ],
    total_amount: 480.00,
    receipt_urls: [],
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    vehicle_id: '571db587-a657-45a3-aea8-3d16963da694',
    vehicle_name: 'HONDA ODYSSEY LX',
    vehicle_internal_code: '04',
    detection_date: '2024-02-01',
    repair_date: '2024-02-05',
    maintenance_type: 'preventive',
    maintenance_items: ['Troca de óleo', 'Filtro de óleo'],
    details: 'Manutenção preventiva programada',
    mechanic_name: 'Carlos Santos',
    mechanic_phone: '(11) 88888-8888',
    parts: [
      { id: '3', name: 'Óleo 5W30', value: 80.00 },
      { id: '4', name: 'Filtro de óleo', value: 25.00 }
    ],
    labor: [
      { id: '3', description: 'Troca de óleo', value: 30.00 }
    ],
    total_amount: 135.00,
    receipt_urls: [],
    created_at: '2024-02-01T09:00:00Z'
  }
];

export const useMaintenance = (vehicleId?: string) => {
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      if (vehicleId) {
        setMaintenances(mockMaintenances.filter(m => m.vehicle_id === vehicleId));
      } else {
        setMaintenances(mockMaintenances);
      }
      setLoading(false);
    }, 500);
  }, [vehicleId]);

  const getTotalMaintenanceCost = (vehicleId: string) => {
    return mockMaintenances
      .filter(m => m.vehicle_id === vehicleId)
      .reduce((total, maintenance) => total + maintenance.total_amount, 0);
  };

  const addMaintenance = (maintenance: Omit<MaintenanceRecord, 'id' | 'created_at'>) => {
    const newMaintenance: MaintenanceRecord = {
      ...maintenance,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setMaintenances(prev => [newMaintenance, ...prev]);
    mockMaintenances.unshift(newMaintenance);
  };

  const updateMaintenance = (id: string, updates: Partial<MaintenanceRecord>) => {
    setMaintenances(prev => 
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    );
    const index = mockMaintenances.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMaintenances[index] = { ...mockMaintenances[index], ...updates };
    }
  };

  return {
    maintenances,
    loading,
    getTotalMaintenanceCost,
    addMaintenance,
    updateMaintenance
  };
};
