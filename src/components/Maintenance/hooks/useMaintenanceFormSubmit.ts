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

  // Detectar se é uma manutenção reaberta (tem ID mas não tem data de reparo)
  const isReopenedMaintenance = editingMaintenance?.id && !editingMaintenance?.repair_date;

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.vehicle_id) {
      errors.push('Selecione um veículo');
    }

    if (!detectionDate) {
      errors.push('Informe a data de detecção');
    }

    if (formData.maintenance_items.length === 0 && !formData.custom_maintenance) {
      errors.push('Selecione pelo menos um item de manutenção ou especifique uma manutenção customizada');
    }

    if (!formData.mechanic_name?.trim()) {
      errors.push('Informe o nome do mecânico');
    }

    // Validar se há pelo menos uma peça ou mão de obra apenas para manutenções novas
    if (!isReopenedMaintenance && formData.parts.length === 0 && formData.labor.length === 0) {
      errors.push('Adicione pelo menos uma peça ou serviço de mão de obra');
    }

    // Validar se as peças têm nome
    const partsWithoutName = formData.parts.filter(part => !part.name?.trim());
    if (partsWithoutName.length > 0) {
      errors.push('Todas as peças devem ter um nome');
    }

    // Validar se os serviços de mão de obra têm descrição
    const laborWithoutDescription = formData.labor.filter(labor => !labor.description?.trim());
    if (laborWithoutDescription.length > 0) {
      errors.push('Todos os serviços de mão de obra devem ter uma descrição');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (errors.length > 0) {
      toast({
        title: 'Campos obrigatórios não preenchidos',
        description: errors.join('. '),
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
        await updateMaintenance(editingMaintenance.id, maintenanceData);
      } else {
        await addMaintenance(maintenanceData);
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
        description: 'Erro ao salvar manutenção. Verifique os dados e tente novamente.',
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
