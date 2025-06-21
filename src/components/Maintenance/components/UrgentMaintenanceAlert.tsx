import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Wrench, Eye, Plus, ChevronRight } from 'lucide-react';
import { MaintenanceRecord } from '../../../types/maintenance';
import { formatDate } from '../utils/maintenanceFormatters';

interface UrgentMaintenanceAlertProps {
  urgentMaintenances: MaintenanceRecord[];
  onViewDetails: (vehicleId: string, vehicleName: string) => void;
  onCreateNewMaintenance?: (vehicleId: string, vehicleName: string) => void;
}

const UrgentMaintenanceAlert = ({ 
  urgentMaintenances, 
  onViewDetails,
  onCreateNewMaintenance
}: UrgentMaintenanceAlertProps) => {
  if (urgentMaintenances.length === 0) {
    return null;
  }

  const getMaintenanceDisplayText = (maintenance: MaintenanceRecord) => {
    if (maintenance.maintenance_items.includes('Outros') && maintenance.custom_maintenance) {
      return `Outros: ${maintenance.custom_maintenance}`;
    }
    return maintenance.maintenance_items.slice(0, 1).join(', ');
  };

  return (
    <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-orange-50 shadow-sm">
      <CardContent className="p-4">
        {/* Header compacto */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">
                Manutenções Urgentes
              </h3>
              <p className="text-xs text-red-600">
                {urgentMaintenances.length} manutenção{urgentMaintenances.length > 1 ? 'ões' : ''} precisam de atenção
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails('', '')}
              className="h-7 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50"
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver Todas
            </Button>
            {onCreateNewMaintenance && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreateNewMaintenance('', '')}
                className="h-7 px-2 text-xs border-green-200 text-green-700 hover:bg-green-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Nova
              </Button>
            )}
          </div>
        </div>

        {/* Lista compacta de manutenções */}
        <div className="space-y-2">
          {urgentMaintenances.slice(0, 3).map((maintenance) => (
            <div 
              key={maintenance.id} 
              className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-red-100 hover:bg-white/90 transition-colors cursor-pointer"
              onClick={() => onViewDetails(maintenance.vehicle_id, maintenance.vehicle_name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-red-700 text-sm">
                      {maintenance.vehicle_internal_code}
                    </span>
                    <span className="text-gray-600 text-xs truncate">
                      {maintenance.vehicle_name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      <span className="truncate max-w-24">{getMaintenanceDisplayText(maintenance)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(maintenance.detection_date)}</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="h-4 w-4 text-red-400 flex-shrink-0" />
              </div>
            </div>
          ))}
          
          {urgentMaintenances.length > 3 && (
            <div className="text-center pt-1">
              <p className="text-xs text-red-600">
                ... e mais {urgentMaintenances.length - 3} manutenção{urgentMaintenances.length - 3 > 1 ? 'ões' : ''} urgente{urgentMaintenances.length - 3 > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentMaintenanceAlert;
