import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import { useMaintenance } from '../../hooks/useMaintenance';
import { MaintenanceFormData, MaintenancePart, MaintenanceLabor } from '../../types/maintenance';
import VehicleMaintenanceSelector from './VehicleMaintenanceSelector';
import DateSelectionForm from './forms/DateSelectionForm';
import MaintenanceItemsSelector from './forms/MaintenanceItemsSelector';
import MechanicInfoForm from './forms/MechanicInfoForm';
import PartsAndLaborForm from './forms/PartsAndLaborForm';
import ReceiptUploadForm from './forms/ReceiptUploadForm';

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
  const { addMaintenance, updateMaintenance } = useMaintenance();
  const [loading, setLoading] = useState(false);
  
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

  const [detectionDate, setDetectionDate] = useState<Date>(new Date()); // Hoje por padrão
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
        parts: editingMaintenance.parts || [],
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

  const getMaintenanceStatus = () => {
    // Em aberto: sem data prometida e sem data de reparo
    if (!promisedDate && !repairDate) return 'open';
    
    // Concluída: com data de reparo
    if (repairDate) return 'completed';
    
    // Pendente: com data prometida mas sem data de reparo
    if (promisedDate && !repairDate) return 'pending';
    
    return 'open';
  };

  const getStatusColor = () => {
    const status = getMaintenanceStatus();
    switch (status) {
      case 'open':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-orange-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    const status = getMaintenanceStatus();
    switch (status) {
      case 'open':
        return 'Em Aberto';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluída';
      default:
        return 'Indefinido';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicle_id) {
      toast({
        title: 'Erro',
        description: 'Selecione um veículo',
        variant: 'destructive'
      });
      return;
    }

    if (!detectionDate) {
      toast({
        title: 'Erro',
        description: 'Informe a data de detecção',
        variant: 'destructive'
      });
      return;
    }

    const status = getMaintenanceStatus();
    
    // Validar se data de reparo é obrigatória para status "completed"
    if (status === 'completed' && !repairDate) {
      toast({
        title: 'Erro',
        description: 'Data de reparo é obrigatória para manutenções concluídas',
        variant: 'destructive'
      });
      return;
    }

    if (formData.maintenance_items.length === 0 && !formData.custom_maintenance) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um item de manutenção',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const maintenanceData = {
        ...formData,
        detection_date: format(detectionDate, 'yyyy-MM-dd'),
        repair_date: repairDate ? format(repairDate, 'yyyy-MM-dd') : '', // Corrigido: enviar string vazia se não houver data
        promised_date: promisedDate ? format(promisedDate, 'yyyy-MM-dd') : '', // Corrigido: enviar string vazia se não houver data
        total_amount: calculateTotal(),
        vehicle_name: selectedVehicle?.name || '',
        vehicle_internal_code: selectedVehicle?.internal_code || ''
      };

      console.log('Dados da manutenção antes de enviar:', maintenanceData);

      if (editingMaintenance) {
        updateMaintenance(editingMaintenance.id, maintenanceData);
      } else {
        addMaintenance(maintenanceData);
      }
      
      toast({
        title: 'Sucesso',
        description: `Manutenção ${editingMaintenance ? 'atualizada' : 'salva'} com sucesso!`
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar manutenção',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('MaintenanceForm - vehicles loaded:', vehicles.length);
  console.log('MaintenanceForm - vehiclesLoading:', vehiclesLoading);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Status no canto superior esquerdo */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <div className={`w-3 h-3 ${getStatusColor()} rounded-full`}></div>
          <span className="text-xs font-medium text-gray-700">{getStatusText()}</span>
        </div>

        <DialogHeader className="pt-8">
          <DialogTitle>
            {editingMaintenance ? 'Editar Manutenção' : 'Nova Manutenção'}
          </DialogTitle>
        </DialogHeader>

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

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || vehiclesLoading}>
              {loading ? 'Salvando...' : 'Salvar Manutenção'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceForm;
