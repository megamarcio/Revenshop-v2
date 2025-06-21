import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles } from '../../hooks/useVehicles';
import VehicleMaintenanceSelector from './VehicleMaintenanceSelector';
import DateSelectionForm from './forms/DateSelectionForm';
import MaintenanceItemsSelector from './forms/MaintenanceItemsSelector';
import MechanicInfoForm from './forms/MechanicInfoForm';
import ReceiptUploadForm from './forms/ReceiptUploadForm';
import MaintenanceFormHeader from './forms/MaintenanceFormHeader';
import MaintenanceFormActions from './forms/MaintenanceFormActions';
import MaintenancePartsManager from './components/MaintenancePartsManager';
import UrgentMaintenanceSection from './forms/UrgentMaintenanceSection';
import { useMaintenanceFormData } from './hooks/useMaintenanceFormData';
import { useMaintenanceFormStatus } from './hooks/useMaintenanceFormStatus';
import { useMaintenanceFormSubmit } from './hooks/useMaintenanceFormSubmit';
import { useMaintenanceQuotes } from './hooks/useMaintenanceQuotes';

interface MaintenanceFormProps {
  open: boolean;
  onClose: () => void;
  editingMaintenance?: any;
  preSelectedVehicleId?: string;
}

const MaintenanceForm = ({
  open,
  onClose,
  editingMaintenance,
  preSelectedVehicleId
}: MaintenanceFormProps) => {
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
  
  // Se não há manutenção sendo editada e há um vehicleId pré-selecionado, definir o veículo
  React.useEffect(() => {
    if (!editingMaintenance && preSelectedVehicleId && !formData.vehicle_id) {
      setFormData(prev => ({
        ...prev,
        vehicle_id: preSelectedVehicleId
      }));
    }
  }, [preSelectedVehicleId, editingMaintenance, formData.vehicle_id, setFormData]);
  
  const {
    getMaintenanceStatus,
    getStatusColor,
    getStatusText
  } = useMaintenanceFormStatus(promisedDate, repairDate);

  const {
    handleAddQuote,
    handleUpdateQuote,
    handleRemoveQuote
  } = useMaintenanceQuotes(formData, setFormData);

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);

  const calculateTotal = () => {
    const purchasedPartsTotal = formData.parts.reduce((sum, part) => {
      const purchasedQuotesTotal = part.priceQuotes?.reduce((partSum, quote) => {
        return partSum + (quote.purchased ? (quote.estimatedPrice || 0) : 0);
      }, 0) || 0;
      return sum + purchasedQuotesTotal;
    }, 0);
    const laborTotal = formData.labor.reduce((sum, labor) => sum + labor.value, 0);
    return purchasedPartsTotal + laborTotal;
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-[16px] my-0">
        <MaintenanceFormHeader 
          isEditing={isEditing} 
          status={status} 
          statusColor={statusColor} 
          statusText={statusText} 
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <VehicleMaintenanceSelector 
            selectedVehicleId={formData.vehicle_id} 
            onVehicleChange={vehicleId => setFormData(prev => ({
              ...prev,
              vehicle_id: vehicleId
            }))} 
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
            onMaintenanceTypeChange={type => setFormData(prev => ({
              ...prev,
              maintenance_type: type
            }))} 
            onMaintenanceItemChange={(item, checked) => {
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
            }} 
            onCustomMaintenanceChange={custom => setFormData(prev => ({
              ...prev,
              custom_maintenance: custom
            }))} 
          />

          <UrgentMaintenanceSection
            isUrgent={formData.is_urgent}
            onUrgentChange={urgent => setFormData(prev => ({
              ...prev,
              is_urgent: urgent
            }))}
          />

          <MechanicInfoForm 
            mechanicName={formData.mechanic_name} 
            mechanicPhone={formData.mechanic_phone} 
            details={formData.details} 
            onMechanicNameChange={name => setFormData(prev => ({
              ...prev,
              mechanic_name: name
            }))} 
            onMechanicPhoneChange={phone => setFormData(prev => ({
              ...prev,
              mechanic_phone: phone
            }))} 
            onDetailsChange={details => setFormData(prev => ({
              ...prev,
              details: details
            }))} 
          />

          <MaintenancePartsManager
            formData={formData}
            setFormData={setFormData}
            onAddQuote={handleAddQuote}
            onUpdateQuote={handleUpdateQuote}
            onRemoveQuote={handleRemoveQuote}
          />

          <ReceiptUploadForm 
            maintenanceId={editingMaintenance?.id}
            receiptUrls={formData.receipt_urls} 
            onReceiptUrlsChange={urls => setFormData(prev => ({
              ...prev,
              receipt_urls: urls
            }))} 
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
