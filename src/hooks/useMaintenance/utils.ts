
import { MaintenanceRecord } from '../../types/maintenance';
import { DatabaseMaintenanceRecord } from './types';

export const formatMaintenanceRecord = (record: DatabaseMaintenanceRecord): MaintenanceRecord => {
  return {
    id: record.id,
    vehicle_id: record.vehicle_id,
    vehicle_name: record.vehicles?.name || '',
    vehicle_internal_code: record.vehicles?.internal_code || '',
    detection_date: record.detection_date,
    repair_date: record.repair_date || undefined,
    promised_date: record.promised_date || undefined,
    maintenance_type: record.maintenance_type as 'preventive' | 'corrective' | 'bodyshop',
    maintenance_items: record.maintenance_items,
    custom_maintenance: record.custom_maintenance || undefined,
    details: record.details || '',
    mechanic_name: record.mechanic_name,
    mechanic_phone: record.mechanic_phone,
    parts: Array.isArray(record.parts) ? record.parts as any[] : [],
    labor: Array.isArray(record.labor) ? record.labor as any[] : [],
    total_amount: record.total_amount,
    receipt_urls: record.receipt_urls,
    is_urgent: record.is_urgent || false,
    created_at: record.created_at,
    created_by: record.created_by || undefined
  };
};
