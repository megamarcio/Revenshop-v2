
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Wrench, Eye } from 'lucide-react';
import { MaintenanceRecord } from '../../../types/maintenance';
import { formatDate } from '../utils/maintenanceFormatters';

interface UrgentMaintenanceAlertProps {
  urgentMaintenances: MaintenanceRecord[];
  onViewDetails: (vehicleId: string, vehicleName: string) => void;
}

const UrgentMaintenanceAlert = ({ 
  urgentMaintenances, 
  onViewDetails 
}: UrgentMaintenanceAlertProps) => {
  if (urgentMaintenances.length === 0) {
    return null;
  }

  const getMaintenanceDisplayText = (maintenance: MaintenanceRecord) => {
    if (maintenance.maintenance_items.includes('Outros') && maintenance.custom_maintenance) {
      return `Outros: ${maintenance.custom_maintenance}`;
    }
    return maintenance.maintenance_items.slice(0, 2).join(', ');
  };

  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Manutenções Urgentes ({urgentMaintenances.length})
            </h3>
            <p className="text-red-700 mb-4">
              Existem manutenções marcadas como urgentes que precisam de atenção imediata.
            </p>
            
            <div className="space-y-3">
              {urgentMaintenances.slice(0, 3).map((maintenance) => (
                <div 
                  key={maintenance.id} 
                  className="bg-white rounded-lg p-3 border border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-red-700">
                          {maintenance.vehicle_internal_code}
                        </span>
                        <span className="text-gray-600">- {maintenance.vehicle_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Wrench className="h-4 w-4" />
                          <span>{getMaintenanceDisplayText(maintenance)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Criada: {formatDate(maintenance.detection_date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(maintenance.vehicle_id, maintenance.vehicle_name)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
              
              {urgentMaintenances.length > 3 && (
                <p className="text-sm text-red-600 text-center pt-2">
                  ... e mais {urgentMaintenances.length - 3} manutenções urgentes
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentMaintenanceAlert;
