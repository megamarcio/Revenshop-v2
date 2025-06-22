import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { RotateCcw } from 'lucide-react';

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
    updateVehicleId,
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
      updateVehicleId(preSelectedVehicleId);
    }
  }, [preSelectedVehicleId, editingMaintenance, formData.vehicle_id, updateVehicleId]);
  
  // Efeito adicional para garantir que o vehicleId seja aplicado quando o formulário abrir
  React.useEffect(() => {
    if (open && !editingMaintenance && preSelectedVehicleId) {
      updateVehicleId(preSelectedVehicleId);
    }
  }, [open, preSelectedVehicleId, editingMaintenance, updateVehicleId]);
  
  // Efeito para garantir que o vehicleId da manutenção sendo editada seja aplicado
  React.useEffect(() => {
    if (open && editingMaintenance && editingMaintenance.vehicle_id && !formData.vehicle_id) {
      updateVehicleId(editingMaintenance.vehicle_id);
    }
  }, [open, editingMaintenance, formData.vehicle_id, updateVehicleId]);
  
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
  
  // Detectar se a manutenção foi reaberta (tem ID mas não tem data de reparo)
  const isReopened = isEditing && editingMaintenance?.id && !editingMaintenance?.repair_date;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="
        max-w-4xl 
        w-[95vw] 
        max-h-[95vh] 
        sm:max-h-[90vh] 
        overflow-hidden 
        mx-2 
        sm:mx-[16px] 
        my-2 
        sm:my-0 
        p-0 
        sm:p-6
        flex 
        flex-col
        rounded-lg
        sm:rounded-lg
        bg-background
        border
        shadow-lg
        data-[state=open]:animate-in 
        data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 
        data-[state=open]:fade-in-0 
        data-[state=closed]:zoom-out-95 
        data-[state=open]:zoom-in-95 
        data-[state=closed]:slide-out-to-left-1/2 
        data-[state=closed]:slide-out-to-top-[48%] 
        data-[state=open]:slide-in-from-left-1/2 
        data-[state=open]:slide-in-from-top-[48%]
      ">
        {/* Header fixo */}
        <div className="flex-shrink-0 p-4 sm:p-6 pb-2 sm:pb-4 border-b">
          <MaintenanceFormHeader 
            isEditing={isEditing} 
            status={status} 
            statusColor={statusColor} 
            statusText={statusText}
            isReopened={isReopened}
          />
        </div>

        {/* Conteúdo scrollável com botões incluídos */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 pt-2 sm:pt-4 -webkit-overflow-scrolling-touch">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {isReopened && (
              <Alert className="border-green-200 bg-green-50">
                <RotateCcw className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm">
                  Esta manutenção foi reaberta. Você pode editar todos os valores, adicionar novos serviços e peças, e definir uma nova data de conclusão.
                </AlertDescription>
              </Alert>
            )}

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

            {/* Botões no final do formulário, dentro da área scrollável */}
            <div className="pt-6 pb-4 border-t bg-background">
              <MaintenanceFormActions 
                onCancel={onClose} 
                loading={loading} 
                vehiclesLoading={vehiclesLoading}
                isEditing={isEditing}
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceForm;
