import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaintenanceRecord } from '../../../types/maintenance';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const getMaintenanceTypeLabel = (type: string) => {
  switch (type) {
    case 'preventive': return '🛠️ Preventiva';
    case 'corrective': return '🔧 Corretiva';
    case 'bodyshop': return '🧽 Bodyshop';
    default: return type;
  }
};

export const sortMaintenances = (maintenances: MaintenanceRecord[]) => {
  return [...maintenances].sort((a, b) => {
    // Primeiro por código interno do veículo
    const codeComparison = a.vehicle_internal_code.localeCompare(b.vehicle_internal_code);
    if (codeComparison !== 0) return codeComparison;
    
    // Depois por data de detecção (mais antiga primeiro)
    return new Date(a.detection_date).getTime() - new Date(b.detection_date).getTime();
  });
};
