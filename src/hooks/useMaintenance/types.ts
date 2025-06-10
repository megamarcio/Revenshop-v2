
import { MaintenanceRecord, MaintenancePart, MaintenanceLabor } from '../../types/maintenance';

export interface MaintenanceOperations {
  maintenances: MaintenanceRecord[];
  loading: boolean;
  getTotalMaintenanceCost: (vehicleId: string) => number;
  addMaintenance: (maintenance: Omit<MaintenanceRecord, 'id' | 'created_at' | 'vehicle_name' | 'vehicle_internal_code'>) => Promise<void>;
  updateMaintenance: (id: string, updates: Partial<MaintenanceRecord>) => Promise<void>;
  deleteMaintenance: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface DatabaseMaintenanceRecord {
  id: string;
  vehicle_id: string;
  detection_date: string;
  repair_date: string | null;
  promised_date: string | null;
  maintenance_type: string;
  maintenance_items: string[];
  custom_maintenance: string | null;
  details: string | null;
  mechanic_name: string;
  mechanic_phone: string;
  parts: unknown;
  labor: unknown;
  total_amount: number;
  receipt_urls: string[];
  created_at: string;
  created_by: string | null;
  vehicles?: {
    name: string;
    internal_code: string;
  };
}
