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
    receipt_urls: [],
    is_urgent: false
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
        parts: Array.isArray(editingMaintenance.parts) ? editingMaintenance.parts.map((part: any) => ({
          id: part.id || crypto.randomUUID(),
          name: part.name || '',
          priceQuotes: Array.isArray(part.priceQuotes) ? part.priceQuotes.map((quote: any) => ({
            ...quote,
            id: quote.id || crypto.randomUUID(),
            purchased: quote.purchased || false
          })) : []
        })) : [],
        labor: Array.isArray(editingMaintenance.labor) ? editingMaintenance.labor.map((labor: any) => ({
          id: labor.id || crypto.randomUUID(),
          description: labor.description || '',
          value: labor.value || 0
        })) : [],
        receipt_urls: editingMaintenance.receipt_urls || [],
        is_urgent: editingMaintenance.is_urgent || false
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
    } else {
      // Reset form data when not editing
      setFormData({
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
        receipt_urls: [],
        is_urgent: false
      });
      
      setDetectionDate(new Date());
      setRepairDate(undefined);
      setPromisedDate(undefined);
    }
  }, [editingMaintenance]);

  // Função para atualizar o vehicleId especificamente
  const updateVehicleId = (vehicleId: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_id: vehicleId
    }));
  };

  return {
    formData,
    setFormData,
    updateVehicleId,
    detectionDate,
    setDetectionDate,
    repairDate,
    setRepairDate,
    promisedDate,
    setPromisedDate
  };
};
