
import { MaintenanceRecord, MaintenancePart, MaintenanceLabor } from '../../types/maintenance';
import { DatabaseMaintenanceRecord } from './types';

export const parseJsonArray = <T>(data: unknown, fallback: T[] = []): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }
  return fallback;
};

export const formatMaintenanceRecord = (record: DatabaseMaintenanceRecord): MaintenanceRecord => {
  return {
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
    parts: Array.isArray(record.parts) ? (record.parts as unknown as MaintenancePart[]) : [],
    labor: Array.isArray(record.labor) ? (record.labor as unknown as MaintenanceLabor[]) : [],
    total_amount: record.total_amount,
    receipt_urls: record.receipt_urls || [],
    created_at: record.created_at,
    created_by: record.created_by
  };
};

export const prepareMaintenanceForDatabase = (
  maintenance: Omit<MaintenanceRecord, 'id' | 'created_at' | 'vehicle_name' | 'vehicle_internal_code'>,
  userId: string
) => {
  return {
    vehicle_id: maintenance.vehicle_id,
    detection_date: maintenance.detection_date,
    repair_date: maintenance.repair_date,
    maintenance_type: maintenance.maintenance_type,
    maintenance_items: maintenance.maintenance_items,
    custom_maintenance: maintenance.custom_maintenance,
    details: maintenance.details,
    mechanic_name: maintenance.mechanic_name,
    mechanic_phone: maintenance.mechanic_phone,
    parts: maintenance.parts as any,
    labor: maintenance.labor as any,
    total_amount: maintenance.total_amount,
    receipt_urls: maintenance.receipt_urls,
    created_by: userId
  };
};

export const prepareMaintenanceUpdates = (updates: Partial<MaintenanceRecord>) => {
  const updateData: any = { ...updates };
  if (updates.parts) {
    updateData.parts = updates.parts as any;
  }
  if (updates.labor) {
    updateData.labor = updates.labor as any;
  }
  return updateData;
};
