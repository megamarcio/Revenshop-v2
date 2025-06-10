
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import { MaintenancePart, MaintenanceLabor } from '../../types/maintenance';
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
  onClose: () => void;
  editingMaintenance?: any;
}

const MaintenanceForm = ({ onClose, editingMaintenance }: MaintenanceFormProps) => {
  const { vehicles, loading: vehiclesLoading } = useVehiclesOptimized({ 
    category: 'forSale', 
    limit: 50, 
    minimal: true 
  });

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

  const { getMaintenanceStatus, getStatusColor, getStatusText } = useMaintenanceFormStatus(repairDate, promisedDate);

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);

  const handleMaintenanceItemChange = (item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      maintenance_items: checked 
        ? [...prev.maintenance_items, item]
        : prev.maintenance_items.filter(i => i !== item)
    }));
  };

  const addPart = () => {
    const newPart: MaintenancePart = {
      id: Date.now().toString(),
      name: '',
      value: 0
    };
    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, newPart]
    }));
  };

  const updatePart = (id: string, field: keyof MaintenancePart, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.map(part => 
        part.id === id ? { ...part, [field]: value } : part
      )
    }));
  };

  const removePart = (id: string) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter(part => part.id !== id)
    }));
  };

  const addLabor = () => {
    const newLabor: MaintenanceLabor = {
      id: Date.now().toString(),
      description: '',
      value: 0
    };
    setFormData(prev => ({
      ...prev,
      labor: [...prev.labor, newLabor]
    }));
  };

  const updateLabor = (id: string, field: keyof MaintenanceLabor, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor.map(labor => 
        labor.id === id ? { ...labor, [field]: value } : labor
      )
    }));
  };

  const removeLabor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor.filter(labor => labor.id !== id)
    }));
  };

  const calculateTotal = () => {
    const partsTotal = formData.parts.reduce((sum, part) => sum + (part.value || 0), 0);
    const laborTotal = formData.labor.reduce((sum, labor) => sum + (labor.value || 0), 0);
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

  console.log('MaintenanceForm - vehicles loaded:', vehicles.length);
  console.log('MaintenanceForm - vehiclesLoading:', vehiclesLoading);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <MaintenanceFormHeader
          isEditing={!!editingMaintenance}
          status={getMaintenanceStatus()}
          statusColor={getStatusColor()}
          statusText={getStatusText()}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <VehicleMaintenanceSelector
            selectedVehicleId={formData.vehicle_id}
            onVehicleChange={(vehicleId) => setFormData(prev => ({ ...prev, vehicle_id: vehicleId }))}
          />

          <DateSelectionForm
            detectionDate={detectionDate}
            repairDate={repairDate}
            promisedDate={promisedDate}
            onDetectionDateChange={setDetectionDate}
            onRepairDateChange={setRepairDate}
            onPromisedDateChange={setPromisedDate}
          />

          <MaintenanceItemsSelector
            maintenanceType={formData.maintenance_type}
            maintenanceItems={formData.maintenance_items}
            customMaintenance={formData.custom_maintenance}
            onMaintenanceTypeChange={(value) => 
              setFormData(prev => ({ ...prev, maintenance_type: value, maintenance_items: [] }))
            }
            onMaintenanceItemChange={handleMaintenanceItemChange}
            onCustomMaintenanceChange={(value) => 
              setFormData(prev => ({ ...prev, custom_maintenance: value }))
            }
          />

          <MechanicInfoForm
            mechanicName={formData.mechanic_name}
            mechanicPhone={formData.mechanic_phone}
            details={formData.details}
            onMechanicNameChange={(value) => 
              setFormData(prev => ({ ...prev, mechanic_name: value }))
            }
            onMechanicPhoneChange={(value) => 
              setFormData(prev => ({ ...prev, mechanic_phone: value }))
            }
            onDetailsChange={(value) => 
              setFormData(prev => ({ ...prev, details: value }))
            }
          />

          <PartsAndLaborForm
            parts={formData.parts}
            labor={formData.labor}
            onAddPart={addPart}
            onUpdatePart={updatePart}
            onRemovePart={removePart}
            onAddLabor={addLabor}
            onUpdateLabor={updateLabor}
            onRemoveLabor={removeLabor}
          />

          <ReceiptUploadForm />

          <MaintenanceFormActions
            onCancel={onClose}
            loading={loading}
            vehiclesLoading={vehiclesLoading}
            isEditing={!!editingMaintenance}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceForm;
