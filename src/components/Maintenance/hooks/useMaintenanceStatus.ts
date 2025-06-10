
import { MaintenanceRecord } from '../../../types/maintenance';

export const useMaintenanceStatus = () => {
  const getMaintenanceStatus = (maintenance: MaintenanceRecord) => {
    const today = new Date();
    const repairDate = maintenance.repair_date ? new Date(maintenance.repair_date) : null;
    const promisedDate = maintenance.promised_date ? new Date(maintenance.promised_date) : null;
    
    // Concluída: com data de reparo
    if (repairDate) return 'completed';
    
    // Pendente: com data prometida mas sem data de reparo
    if (promisedDate && !repairDate) return 'pending';
    
    // Em aberto: sem data prometida e sem data de reparo
    return 'open';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Em Aberto';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'open': 
        return 'bg-yellow-500 hover:bg-yellow-600 text-white border-0';
      case 'pending': 
        return 'bg-orange-500 hover:bg-orange-600 text-white border-0';
      case 'completed': 
        return 'bg-green-500 hover:bg-green-600 text-white border-0';
      default: 
        return 'bg-gray-500 hover:bg-gray-600 text-white border-0';
    }
  };

  return {
    getMaintenanceStatus,
    getStatusLabel,
    getStatusBadgeStyles
  };
};
