
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles } from '../../hooks/useVehicles';
import { useMaintenance } from '../../hooks/useMaintenance';
import VehicleMaintenanceSelector from './VehicleMaintenanceSelector';
import DateSelectionForm from './forms/DateSelectionForm';
import MaintenanceItemsSelector from './forms/MaintenanceItemsSelector';
import MechanicInfoForm from './forms/MechanicInfoForm';
import PartsAndLaborForm from './forms/PartsAndLaborForm';
import ReceiptUploadForm from './forms/ReceiptUploadForm';
import MaintenanceFormHeader from './forms/MaintenanceFormHeader';
import MaintenanceFormActions from './forms/MaintenanceFormActions';
import { useMaintenanceFormData } from './hooks/useMaintenanceFormData';
import { useMaintenanceFormStatus } from './hooks/useMaintenanceFormStatus';
import { useMaintenanceFormSubmit } from './hooks/useMaintenanceFormSubmit';

interface MaintenanceFormProps {
  open: boolean;
  onClose: () => void;
  editingMaintenance?: any;
}

const MaintenanceForm = ({ open, onClose, editingMaintenance }: MaintenanceFormProps) => {
  const { canEditVehicles } = useAuth();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  
  const {
    formData,
    setFormData,
    detectionDate,
    setDetectionDate,
    repairDate,
    setRepairDate,
    promisedDate,
    setPromisedDate
  } = useMaintenanceFormData(editingMaintenance);

  const { getMaintenanceStatus, getStatusColor, getStatusText } = useMaintenanceFormStatus(promisedDate, repairDate);

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);

  const calculateTotal = () => {
    const partsTotal = formData.parts.reduce((sum, part) => sum + part.cost, 0);
    const laborTotal = formData.labor.reduce((sum, labor) => sum + labor.cost, 0);
    return partsTotal + laborTotal;
  };

  const { handleSubmit, loading } = useMaintenanceFormSubmit({
    formData,
    detectionDate,
    repairDate,
    promisedDate,
    selectedVehicle,
    editingMaintenance,
    onClose,
    calculateTotal,
    getMaintenanceStatus
  });

  const isEditing = !!editingMaintenance;
  const status = getMaintenanceStatus();
  const statusColor = getStatusColor();
  const statusText = getStatusText();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <MaintenanceFormHeader 
          isEditing={isEditing}
          status={status}
          statusColor={statusColor}
          statusText={statusText}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <VehicleMaintenanceSelector
            vehicles={vehicles}
            selectedVehicleId={formData.vehicle_id}
            onVehicleChange={(vehicleId) => setFormData(prev => ({ ...prev, vehicle_id: vehicleId }))}
            disabled={!canEditVehicles}
            loading={vehiclesLoading}
          />

          <DateSelectionForm
            detectionDate={detectionDate}
            setDetectionDate={setDetectionDate}
            repairDate={repairDate}
            setRepairDate={setRepairDate}
            promisedDate={promisedDate}
            setPromisedDate={setPromisedDate}
          />

          <MaintenanceItemsSelector
            maintenanceType={formData.maintenance_type}
            setMaintenanceType={(type) => setFormData(prev => ({ ...prev, maintenance_type: type }))}
            maintenanceItems={formData.maintenance_items}
            setMaintenanceItems={(items) => setFormData(prev => ({ ...prev, maintenance_items: items }))}
            customMaintenance={formData.custom_maintenance}
            setCustomMaintenance={(custom) => setFormData(prev => ({ ...prev, custom_maintenance: custom }))}
            details={formData.details}
            setDetails={(details) => setFormData(prev => ({ ...prev, details: details }))}
          />

          <MechanicInfoForm
            mechanicName={formData.mechanic_name}
            setMechanicName={(name) => setFormData(prev => ({ ...prev, mechanic_name: name }))}
            mechanicPhone={formData.mechanic_phone}
            setMechanicPhone={(phone) => setFormData(prev => ({ ...prev, mechanic_phone: phone }))}
          />

          <PartsAndLaborForm
            parts={formData.parts}
            setParts={(parts) => setFormData(prev => ({ ...prev, parts }))}
            labor={formData.labor}
            setLabor={(labor) => setFormData(prev => ({ ...prev, labor }))}
          />

          <ReceiptUploadForm
            receiptUrls={formData.receipt_urls}
            setReceiptUrls={(urls) => setFormData(prev => ({ ...prev, receipt_urls: urls }))}
          />

          <MaintenanceFormActions
            onCancel={onClose}
            loading={loading}
            vehiclesLoading={vehiclesLoading}
            isEditing={isEditing}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceForm;
