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
const MaintenanceForm = ({
  open,
  onClose,
  editingMaintenance
}: MaintenanceFormProps) => {
  const {
    canEditVehicles
  } = useAuth();
  const {
    vehicles,
    loading: vehiclesLoading
  } = useVehicles();
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
  const {
    getMaintenanceStatus,
    getStatusColor,
    getStatusText
  } = useMaintenanceFormStatus(promisedDate, repairDate);
  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
  const calculateTotal = () => {
    const partsTotal = formData.parts.reduce((sum, part) => sum + part.value, 0);
    const laborTotal = formData.labor.reduce((sum, labor) => sum + labor.value, 0);
    return partsTotal + laborTotal;
  };
  const {
    handleSubmit,
    loading
  } = useMaintenanceFormSubmit({
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
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-[16px] my-0">
        <MaintenanceFormHeader isEditing={isEditing} status={status} statusColor={statusColor} statusText={statusText} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <VehicleMaintenanceSelector selectedVehicleId={formData.vehicle_id} onVehicleChange={vehicleId => setFormData(prev => ({
          ...prev,
          vehicle_id: vehicleId
        }))} />

          <DateSelectionForm detectionDate={detectionDate} repairDate={repairDate} promisedDate={promisedDate} onDetectionDateChange={setDetectionDate} onRepairDateChange={setRepairDate} onPromisedDateChange={setPromisedDate} />

          <MaintenanceItemsSelector maintenanceType={formData.maintenance_type} maintenanceItems={formData.maintenance_items} customMaintenance={formData.custom_maintenance} onMaintenanceTypeChange={type => setFormData(prev => ({
          ...prev,
          maintenance_type: type
        }))} onMaintenanceItemChange={(item, checked) => {
          if (checked) {
            setFormData(prev => ({
              ...prev,
              maintenance_items: [...prev.maintenance_items, item]
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              maintenance_items: prev.maintenance_items.filter(i => i !== item)
            }));
          }
        }} onCustomMaintenanceChange={custom => setFormData(prev => ({
          ...prev,
          custom_maintenance: custom
        }))} />

          <MechanicInfoForm mechanicName={formData.mechanic_name} mechanicPhone={formData.mechanic_phone} details={formData.details} onMechanicNameChange={name => setFormData(prev => ({
          ...prev,
          mechanic_name: name
        }))} onMechanicPhoneChange={phone => setFormData(prev => ({
          ...prev,
          mechanic_phone: phone
        }))} onDetailsChange={details => setFormData(prev => ({
          ...prev,
          details: details
        }))} />

          <PartsAndLaborForm parts={formData.parts} labor={formData.labor} onAddPart={() => {
          const newPart = {
            id: crypto.randomUUID(),
            name: '',
            value: 0
          };
          setFormData(prev => ({
            ...prev,
            parts: [...prev.parts, newPart]
          }));
        }} onUpdatePart={(id, field, value) => {
          setFormData(prev => ({
            ...prev,
            parts: prev.parts.map(part => part.id === id ? {
              ...part,
              [field]: value
            } : part)
          }));
        }} onRemovePart={id => {
          setFormData(prev => ({
            ...prev,
            parts: prev.parts.filter(part => part.id !== id)
          }));
        }} onAddLabor={() => {
          const newLabor = {
            id: crypto.randomUUID(),
            description: '',
            value: 0
          };
          setFormData(prev => ({
            ...prev,
            labor: [...prev.labor, newLabor]
          }));
        }} onUpdateLabor={(id, field, value) => {
          setFormData(prev => ({
            ...prev,
            labor: prev.labor.map(labor => labor.id === id ? {
              ...labor,
              [field]: value
            } : labor)
          }));
        }} onRemoveLabor={id => {
          setFormData(prev => ({
            ...prev,
            labor: prev.labor.filter(labor => labor.id !== id)
          }));
        }} />

          <ReceiptUploadForm receiptUrls={formData.receipt_urls} onReceiptUrlsChange={urls => setFormData(prev => ({
          ...prev,
          receipt_urls: urls
        }))} />

          <MaintenanceFormActions onCancel={onClose} loading={loading} vehiclesLoading={vehiclesLoading} isEditing={isEditing} />
        </form>
      </DialogContent>
    </Dialog>;
};
export default MaintenanceForm;