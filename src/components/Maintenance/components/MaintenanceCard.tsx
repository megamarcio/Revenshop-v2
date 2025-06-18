
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Wrench, Edit, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { MaintenanceRecord } from '../../../types/maintenance';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';
import { formatCurrency, formatDate, getMaintenanceTypeLabel } from '../utils/maintenanceFormatters';

interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
  canEditVehicles: boolean;
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (maintenance: MaintenanceRecord) => void;
}

const MaintenanceCard = ({
  maintenance,
  canEditVehicles,
  onEdit,
  onDelete
}: MaintenanceCardProps) => {
  const {
    getMaintenanceStatus,
    getStatusLabel,
    getStatusBadgeStyles
  } = useMaintenanceStatus();

  const status = getMaintenanceStatus(maintenance);

  const getMaintenanceItemsDisplay = () => {
    if (maintenance.maintenance_items.includes('Outros') && maintenance.custom_maintenance) {
      const otherItems = maintenance.maintenance_items.filter(item => item !== 'Outros');
      const outrosText = `Outros: ${maintenance.custom_maintenance}`;
      
      if (otherItems.length > 0) {
        return `${otherItems.slice(0, 1).join(', ')}, ${outrosText}`;
      }
      return outrosText;
    }
    
    const displayItems = maintenance.maintenance_items.slice(0, 2).join(', ');
    if (maintenance.maintenance_items.length > 2) {
      return `${displayItems}... +${maintenance.maintenance_items.length - 2}`;
    }
    return displayItems;
  };

  const cardBorderClass = maintenance.is_urgent 
    ? "border-l-4 border-l-red-500 bg-red-50" 
    : "border-l-4 border-l-revenshop-primary";

  return (
    <Card className={`hover:shadow-md transition-shadow ${cardBorderClass}`}>
      <CardContent className="p-3">
        {/* Linha principal compacta */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Status e Urgente */}
            <div className="flex gap-1 flex-shrink-0">
              <Badge className={`${getStatusBadgeStyles(status)} text-[10px] px-1 py-0`}>
                {getStatusLabel(status)}
              </Badge>
              {maintenance.is_urgent && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-1 py-0 flex items-center gap-1">
                  <AlertTriangle className="h-2 w-2" />
                  Urgente
                </Badge>
              )}
            </div>
            
            {/* Código e Nome do Veículo */}
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="font-bold text-revenshop-primary text-sm flex-shrink-0">
                {maintenance.vehicle_internal_code}
              </span>
              <span className="text-gray-700 text-sm truncate">
                - {maintenance.vehicle_name}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {getMaintenanceTypeLabel(maintenance.maintenance_type)}
              </span>
            </div>
          </div>
          
          {/* Valor e Ações */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-bold text-revenshop-primary text-sm">
              {formatCurrency(maintenance.total_amount)}
            </span>
            {canEditVehicles && (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(maintenance)} className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(maintenance)} 
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Linha de detalhes compacta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span>Criado: {formatDate(maintenance.detection_date)}</span>
          </div>
          
          {maintenance.promised_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-500" />
              <span>Promessa: {formatDate(maintenance.promised_date)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Wrench className="h-3 w-3 text-gray-400" />
            <span className="truncate">{maintenance.mechanic_name}</span>
          </div>
        </div>

        {/* Itens de manutenção */}
        <div className="mt-2 text-xs text-gray-600">
          <span className="font-medium">Itens:</span>
          <span className="ml-1">{getMaintenanceItemsDisplay()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCard;
