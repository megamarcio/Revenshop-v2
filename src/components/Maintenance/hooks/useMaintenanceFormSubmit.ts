
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { MaintenanceFormData } from '../../../types/maintenance';
import { useMaintenance } from '../../../hooks/useMaintenance';

interface UseMaintenanceFormSubmitProps {
  formData: MaintenanceFormData;
  detectionDate: Date;
  repairDate?: Date;
  promisedDate?: Date;
  selectedVehicle: any;
  editingMaintenance?: any;
  onClose: () => void;
  calculateTotal: () => number;
  getMaintenanceStatus: () => string;
}

export const useMaintenanceFormSubmit = ({
  formData,
  detectionDate,
  repairDate,
  promisedDate,
  selectedVehicle,
  editingMaintenance,
  onClose,
  calculateTotal,
  getMaintenanceStatus
}: UseMaintenanceFormSubmitProps) => {
  const [loading, setLoading] = useState(false);
  const { addMaintenance, updateMaintenance } = useMaintenance();

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
        repair_date: repairDate ? format(repairDate, 'yyyy-MM-dd') : '',
        promised_date: promisedDate ? format(promisedDate, 'yyyy-MM-dd') : '',
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

  return {
    handleSubmit,
    loading
  };
};
