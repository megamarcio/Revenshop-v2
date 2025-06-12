
import { MaintenanceFormData } from '../../../types/maintenance';

export const useMaintenanceFormStatus = (repairDate?: Date, promisedDate?: Date) => {
  const getMaintenanceStatus = () => {
    // Concluída: com data de reparo
    if (repairDate) return 'completed';
    
    // Pendente: com data prometida mas sem data de reparo
    if (promisedDate && !repairDate) return 'pending';
    
    // Em aberto: sem data prometida e sem data de reparo
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

  return {
    getMaintenanceStatus,
    getStatusColor,
    getStatusText
  };
};
