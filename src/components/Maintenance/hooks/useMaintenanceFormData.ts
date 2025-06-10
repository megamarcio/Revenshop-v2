
import { useState, useEffect } from 'react';
import { MaintenanceFormData } from '../../../types/maintenance';

export const useMaintenanceFormData = (editingMaintenance?: any) => {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicle_id: '',
    detection_date: '',
    repair_date: '',
    promised_date: '',
    maintenance_type: 'preventive',
    maintenance_items: [],
    custom_maintenance: '',
    details: '',
    mechanic_name: '',
    mechanic_phone: '',
    parts: [],
    labor: [],
    receipt_urls: []
  });

  const [detectionDate, setDetectionDate] = useState<Date>(new Date());
  const [repairDate, setRepairDate] = useState<Date>();
  const [promisedDate, setPromisedDate] = useState<Date>();

  useEffect(() => {
    if (editingMaintenance) {
      setFormData({
        vehicle_id: editingMaintenance.vehicle_id || '',
        detection_date: editingMaintenance.detection_date || '',
        repair_date: editingMaintenance.repair_date || '',
        promised_date: editingMaintenance.promised_date || '',
        maintenance_type: editingMaintenance.maintenance_type || 'preventive',
        maintenance_items: editingMaintenance.maintenance_items || [],
        custom_maintenance: editingMaintenance.custom_maintenance || '',
        details: editingMaintenance.details || '',
        mechanic_name: editingMaintenance.mechanic_name || '',
        mechanic_phone: editingMaintenance.mechanic_phone || '',
        parts: (editingMaintenance.parts || []).map((part: any) => ({
          ...part,
          priceQuotes: (part.priceQuotes || []).map((quote: any) => ({
            ...quote,
            purchased: quote.purchased || false
          }))
        })),
        labor: editingMaintenance.labor || [],
        receipt_urls: editingMaintenance.receipt_urls || []
      });
      
      if (editingMaintenance.detection_date) {
        setDetectionDate(new Date(editingMaintenance.detection_date));
      }
      if (editingMaintenance.repair_date) {
        setRepairDate(new Date(editingMaintenance.repair_date));
      }
      if (editingMaintenance.promised_date) {
        setPromisedDate(new Date(editingMaintenance.promised_date));
      }
    }
  }, [editingMaintenance]);

  return {
    formData,
    setFormData,
    detectionDate,
    setDetectionDate,
    repairDate,
    setRepairDate,
    promisedDate,
    setPromisedDate
  };
};
