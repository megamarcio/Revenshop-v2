
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User, FileText } from 'lucide-react';
import { useMaintenance } from '@/hooks/useMaintenance';

interface VehicleMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehicleName: string;
}

const VehicleMaintenanceModal = ({
  isOpen,
  onClose,
  vehicleId,
  vehicleName
}: VehicleMaintenanceModalProps) => {
  const { maintenances, loading, getTotalMaintenanceCost } = useMaintenance(vehicleId);

  const vehicleMaintenances = maintenances.filter(m => m.vehicle_id === vehicleId);
  const totalCost = getTotalMaintenanceCost(vehicleId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manutenções - {vehicleName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total de Manutenções</p>
                <p className="text-2xl font-bold">{vehicleMaintenances.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Custo Total</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </div>

          {/* Lista de Manutenções */}
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : vehicleMaintenances.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma manutenção encontrada para este veículo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicleMaintenances.map((maintenance) => (
                  <div
                    key={maintenance.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{maintenance.description}</h3>
                        <Badge className={getStatusColor(maintenance.status)}>
                          {getStatusText(maintenance.status)}
                        </Badge>
                      </div>
                      <span className="font-bold text-lg text-red-600">
                        {formatCurrency(maintenance.total_amount)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(maintenance.maintenance_date)}</span>
                      </div>
                      {maintenance.mechanic_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{maintenance.mechanic_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          Labor: {formatCurrency(maintenance.labor_cost)} | 
                          Peças: {formatCurrency(maintenance.parts_cost)}
                        </span>
                      </div>
                    </div>

                    {maintenance.notes && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <strong>Observações:</strong> {maintenance.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleMaintenanceModal;
